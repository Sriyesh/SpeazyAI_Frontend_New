import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Mic, Square, Play, Pause } from "lucide-react";
import { RecordingWaveform } from "./recordingWaveform";
import { LoadingAssessment } from "./loadingAssessment";
import { SpeechAssessmentResults } from "./SpeechAssessmentResults";


export function AudioRecorder({ expectedText = "I like apples", lessonColor = "from-blue-500 to-cyan-400" }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const audioRef = useRef(null);

  // Recording timer
  useEffect(() => {
    if (!isRecording) return;
    timerIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 10);
    }, 10);
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording]);

  // Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioUrl(null);
      setApiResponse(null);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  // When recording stops, convert audio and call API
  const handleRecordingStop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const format = audioBlob.type.includes("webm") ? "webm" : "wav";

    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(audioUrl);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Audio = reader.result.split(",")[1];
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
      await callSpeechAssessmentAPI(base64Audio, format);
    };
    reader.readAsDataURL(audioBlob);
  };

  // 🔥 API Integration
  const callSpeechAssessmentAPI = async (base64Audio, format) => {
    console.log("Calling LanguageConfidence API through CORS proxy...");
    const apiUrl = "https://apis.languageconfidence.ai/speech-assessment/scripted/uk";
    const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // temporary public proxy
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/speechProxy', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          audio_base64: base64Audio,
          expected_text: expectedText,
          audio_format: format,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      setApiResponse(data);
    } catch (error) {
      console.error("Error calling API:", error);
      alert("Error processing audio. Please try again.");
      setApiResponse({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Playback Controls
  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
  };

  useEffect(() => {
  const audioElement = audioRef.current;
  if (!audioElement) return;

  const handleEnded = () => setIsPlaying(false);
  audioElement.addEventListener("ended", handleEnded);

  return () => {
    // 🩹 Prevent crash: check if ref still exists before removing
    if (audioElement) {
      audioElement.removeEventListener("ended", handleEnded);
    }
  };
}, [audioUrl]);


  return (
    <div className="w-full space-y-6">
      {/* 🎙 Start / Stop Recording */}
      {!isRecording && (
        <Button
          size="lg"
          onClick={() => {
            if (audioUrl) {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
              // Reset for new recording
              setApiResponse(null);
              setAudioUrl(null);
              startRecording();
            } else {
              // First-time recording
              startRecording();
            }
          }}
          className={`bg-gradient-to-r ${lessonColor} hover:opacity-90 text-white rounded-full px-8 shadow-lg transform hover:scale-105 transition-all duration-200`}
        >
          <Mic className="w-6 h-6 mr-2" />
          {audioUrl ? "Record Again" : "Start Recording"}
        </Button>
      )}


      {isRecording && (
        <div className="flex flex-col items-center space-y-6 p-8 bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
          <RecordingWaveform analyser={analyserRef.current} isRecording={isRecording} recordingTime={recordingTime} />
          <Button
            size="lg"
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 shadow-lg flex items-center gap-2 mt-4"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </Button>
        </div>
      )}

      {/* 🎧 Playback Section */}
      {audioUrl && !isRecording && (
        <div className="flex flex-col items-center space-y-4 bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            className="w-full rounded-lg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <Button
            onClick={togglePlayback}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90 rounded-full px-6 shadow-lg flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isPlaying ? "Pause" : "Play Recording"}
          </Button>
        </div>
      )}

      {/* ⏳ Loading State */}
      {isLoading && <LoadingAssessment />}

      {/* 🧠 API JSON Response */}
      {apiResponse && !isLoading && (
            <div className="mt-8">
              <SpeechAssessmentResults data={apiResponse} />
            </div>
      )}
    </div>
  );
}
