"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Mic, Square, Play, Pause } from "lucide-react"
import { RecordingWaveform } from "./recordingWaveform"
import { LoadingAssessment } from "./loadingAssessment"

export function AudioRecorder({
  expectedText = "",
  lessonColor = "from-blue-500 to-cyan-400",
  endpoint = "https://apis.languageconfidence.ai/speech-assessment/unscripted/uk",
  onApiResponse = null
}: {
  expectedText?: string;
  lessonColor?: string;
  endpoint?: string;
  onApiResponse?: any;
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Recording timer
  useEffect(() => {
    if (!isRecording) return
    timerIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 10)
    }, 10)
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isRecording])

  // Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      // Detect supported mimeType for better mobile compatibility
      let mimeType = "audio/webm"; // Default fallback
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4"; // iOS Safari often supports this
      } else if (MediaRecorder.isTypeSupported("audio/aac")) {
        mimeType = "audio/aac";
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = handleRecordingStop

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setAudioUrl(null)
      setApiResponse(null)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Unable to access microphone. Please check permissions.")
    }
  }

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }

  // When recording stops, convert audio and call API
  const handleRecordingStop = () => {
    // Use the mimeType from the recorder if available, otherwise fallback
    const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
    
    // Map mimeType to API format
    // API expects 'webm', 'wav', 'mp3', 'm4a', 'ogg'
    let format = "webm";
    if (mimeType.includes("wav")) format = "wav";
    else if (mimeType.includes("mp4") || mimeType.includes("m4a") || mimeType.includes("aac")) format = "m4a";
    else if (mimeType.includes("ogg")) format = "ogg";
    else if (mimeType.includes("webm")) format = "webm";

    const audioUrl = URL.createObjectURL(audioBlob)
    setAudioUrl(audioUrl)

    const reader = new FileReader()
    reader.onloadend = async () => {
      if (reader.result && typeof reader.result === 'string') {
        const base64Audio = reader.result.split(",")[1]
        streamRef.current?.getTracks().forEach((t) => t.stop())
        audioContextRef.current?.close()
        await callSpeechAssessmentAPI(base64Audio, format)
      }
    }
    reader.readAsDataURL(audioBlob)
  }

  // 🔥 API Integration
  const callSpeechAssessmentAPI = async (base64Audio, format) => {
    console.log("Calling LanguageConfidence API through CORS proxy...")
    // Determine the correct proxy URL based on the environment
    // If we're running on localhost, use the local express server (port 4000)
    // If we're on Netlify, use the Netlify function
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    const proxyUrl = isLocal ? "http://localhost:4000/speechProxy" : "/.netlify/functions/speechProxy"
    
    setIsLoading(true)

    const isScripted = typeof endpoint === "string" && endpoint.includes("speech-assessment/scripted")
    const payloadObj: any = {
      audio_base64: base64Audio,
      audio_format: format,
    }
    
    // Only send expected_text if it's a scripted endpoint
    if (isScripted && expectedText) {
      payloadObj.expected_text = expectedText
    }
    const payload = JSON.stringify(payloadObj)

    try {
      const response = await fetch(`${proxyUrl}?endpoint=${encodeURIComponent(endpoint)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "lc-beta-features": "false",
        },
        body: payload,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error (${response.status}): ${errorText}`)
      }

      const data = await response.json()
      console.log("API Response:", data)
      setApiResponse(data)
      // Pass API response to parent component
      if (onApiResponse) {
        onApiResponse(data)
      }
    } catch (error) {
      console.error("Error calling API:", error)
      alert("Error processing audio. Please try again.")
      setApiResponse({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  // Playback Controls
  const togglePlayback = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
  }

  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) return

    const handleEnded = () => setIsPlaying(false)
    audioElement.addEventListener("ended", handleEnded)

    return () => {
      // 🩹 Prevent crash: check if ref still exists before removing
      if (audioElement) {
        audioElement.removeEventListener("ended", handleEnded)
      }
    }
  }, [audioUrl])

  return (
    <div className="w-full space-y-6">
      {/* 🎙 Start / Stop Recording */}
      {!isRecording && (
        <Button
          size="lg"
          onClick={() => {
            if (audioUrl) {
              if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
              }
              // Reset for new recording
              setApiResponse(null)
              setAudioUrl(null)
              startRecording()
            } else {
              // First-time recording
              startRecording()
            }
          }}
          className="text-white rounded-full px-8 shadow-lg transform hover:scale-105 transition-all duration-200"
          style={{
            background: `linear-gradient(to right, ${lessonColor.split(" to ")[0].replace("from-", "#")}, ${lessonColor.split(" to ")[1]?.replace("to-", "#")})`,
          }}
        >
          <Mic className="w-6 h-6 mr-2" />
          {audioUrl ? "Record Again" : "Start Recording"}
        </Button>
      )}

      {isRecording && (
        <div
          className="flex flex-col items-center space-y-6 p-8 rounded-2xl shadow-lg"
          style={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
        >
          <RecordingWaveform analyser={analyserRef.current} isRecording={isRecording} recordingTime={recordingTime} />
          <Button
            size="lg"
            onClick={stopRecording}
            className="text-white rounded-full px-8 shadow-lg flex items-center gap-2 mt-4"
            style={{
              backgroundColor: "#DC2626",
            }}
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </Button>
        </div>
      )}

      {/* 🎧 Playback Section */}
      {audioUrl && !isRecording && (
        <div
          className="flex flex-col items-center space-y-4 rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
        >
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            className="w-full h-14 rounded-lg shadow-sm"
            style={{ display: 'block' }}
          />
        </div>
      )}

      {/* ⏳ Loading State */}
      {isLoading && <LoadingAssessment />}
    </div>
  )
}
