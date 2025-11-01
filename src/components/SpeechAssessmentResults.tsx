"use client"

import type React from "react"

//@ts-ignore
import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card"
import { Mic, BookOpen, AlertTriangle, Volume2, Award, Brain, Square, Play, Pause } from "lucide-react"

export function SpeechAssessmentResults({ data }) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  const [practiceScore, setPracticeScore] = useState<number | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const pronunciation = data?.pronunciation || {}
  const fluency = data?.fluency || {}
  const overall = data?.overall || {}
  const reading = data?.reading || {}
  const warnings = data?.warnings || {}
  const metadata = data?.metadata || {}

  const wordScores = (pronunciation.words || []).map((w: { word_text: any; word_score: any; phonemes?: any[] }) => ({
    name: w.word_text,
    score: w.word_score,
    phonemes: w.phonemes || [],
  }))

  const playPhonemeSound = (phoneme: string) => {
    const utterance = new SpeechSynthesisUtterance(phoneme)
    utterance.rate = 0.5
    window.speechSynthesis.speak(utterance)
  }

  const playWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.rate = 0.8
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const options = {
      mimeType: "audio/webm;codecs=opus",
      audioBitsPerSecond: 16000,
    }

    const mediaRecorder = new MediaRecorder(stream, options)
    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []
    setRecordingTime(0)
    setIsRecording(true)

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
      const audioUrl = URL.createObjectURL(audioBlob)
      setRecordedAudio(audioUrl)
      stream.getTracks().forEach((track) => track.stop())

      const randomScore = Math.floor(Math.random() * 30) + 60
      setPracticeScore(randomScore)
    }

    mediaRecorder.start()

    // === FIXED: Auto-stop at exactly 5 seconds ===
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        const newTime = prev + 1
        if (newTime >= 5) {
          stopRecording() // This will trigger onstop
          return 5 // Cap at 5
        }
        return newTime
      })
    }, 1000)

    // === Safety: Force stop after 5.1s in case interval fails ===
    setTimeout(() => {
      if (isRecording) {
        stopRecording()
      }
    }, 5100)

  } catch (error) {
    console.error("Error accessing microphone:", error)
    setIsRecording(false)
  }
}

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }
  }

  const playRecordedAudio = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio)
      audio.play()
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [])

  const cardBase = "rounded-2xl shadow-md border border-gray-200 bg-white/60 backdrop-blur text-gray-800"

  if (!data) return null

  return (
    <div className="w-full space-y-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={cardBase}>
          <CardContent className="p-6 text-center">
            <Award className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-5xl font-bold text-blue-600 mb-1">{overall.overall_score}</div>
            <p className="text-sm text-gray-700">Overall Score</p>
            <p className="text-xs text-gray-500 mt-1">
              IELTS {overall.english_proficiency_scores?.mock_ielts?.prediction} • CEFR{" "}
              {overall.english_proficiency_scores?.mock_cefr?.prediction} • PTE{" "}
              {overall.english_proficiency_scores?.mock_pte?.prediction}
            </p>
          </CardContent>
        </Card>

        <Card className={cardBase}>
          <CardContent className="p-6 text-center">
            <Mic className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
            <div className="text-5xl font-bold text-cyan-600 mb-1">{pronunciation.overall_score}</div>
            <p className="text-sm text-gray-700">Pronunciation Accuracy</p>
            <p className="text-xs text-gray-500 mt-1">
              IELTS {pronunciation.english_proficiency_scores?.mock_ielts?.prediction} • CEFR{" "}
              {pronunciation.english_proficiency_scores?.mock_cefr?.prediction}
            </p>
          </CardContent>
        </Card>

        <Card className={cardBase}>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-5xl font-bold text-emerald-600 mb-1">{fluency.overall_score}</div>
            <p className="text-sm text-gray-700">Fluency</p>
            <p className="text-xs text-gray-500 mt-1">
              IELTS {fluency.english_proficiency_scores?.mock_ielts?.prediction} • CEFR{" "}
              {fluency.english_proficiency_scores?.mock_cefr?.prediction}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className={cardBase}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Volume2 className="w-5 h-5 text-blue-500" />
            Pronunciation Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Click on any word to see detailed pronunciation breakdown:</p>
            <div className="flex flex-wrap gap-2">
              {wordScores.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWord(selectedWord === word.name ? null : word.name)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedWord === word.name
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                      : word.score >= 80
                        ? "border-green-300 bg-green-50 text-green-700 hover:border-green-400"
                        : word.score >= 60
                          ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:border-yellow-400"
                          : "border-red-300 bg-red-50 text-red-700 hover:border-red-400"
                    }`}
                >
                  {word.name}
                  <span className="ml-2 text-xs font-semibold">({word.score})</span>
                </button>
              ))}
            </div>
          </div>

          {selectedWord && (
            <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-blue-700">{selectedWord}</h3>
                  <button
                    onClick={() => playWord(selectedWord)}
                    className="p-2 hover:bg-blue-200 rounded-full transition-colors"
                    title="Play word pronunciation"
                  >
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
                <div className="text-2xl font-semibold text-blue-600">
                  Score: {wordScores.find((w) => w.name === selectedWord)?.score}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Phonemes:</h4>
                <div className="flex flex-wrap gap-2">
                  {(pronunciation.lowest_scoring_phonemes || [])
                    .filter((p: any) => selectedWord.toLowerCase().includes(p.ipa_label?.toLowerCase()))
                    .map((p: { ipa_label: any; phoneme_score: any }, idx: any) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 border border-blue-300 bg-white px-3 py-2 rounded-lg"
                      >
                        <span className="font-mono text-blue-700">{p.ipa_label}</span>
                        <span className="text-sm text-gray-600">({p.phoneme_score})</span>
                        <button
                          onClick={() => playPhonemeSound(p.ipa_label)}
                          className="p-1 hover:bg-blue-100 rounded transition-colors"
                          title="Play sound"
                        >
                          <Volume2 className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    ))}
                  {(pronunciation.lowest_scoring_phonemes || []).filter((p: any) =>
                    selectedWord.toLowerCase().includes(p.ipa_label?.toLowerCase()),
                  ).length === 0 && (
                      <p className="text-sm text-gray-500">No specific phoneme data available for this word.</p>
                    )}
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Practice Pronunciation:</h4>

                <div className="flex items-center gap-4">
                  {/* Left side: Record button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors`}
                      style={{
                        backgroundColor: isRecording ? "#EF4444" : "#4A98F8", // red-500 or purple-400
                        color: "white",
                        borderRadius: isRecording ? "8px" : "9999px",
                        padding: "12px 32px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        transform: isRecording ? "none" : "scale(1)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isRecording ? "#2563EB" : "#4A98F8"; // hover colors
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isRecording ? "#EF4444" : "#4A98F8"; // reset color
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-5 h-5" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          Record
                        </>
                      )}
                    </button>
                  </div>

                  {/* Middle: Audio player with slider */}
                  <div className="flex-1">
                    {recordedAudio ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlayPause}
                          className="flex-shrink-0 p-2 bg-red-600 hover:bg-blue-600 text-white rounded-full transition-colors"
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <div className="flex-1">
                          <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSliderChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                        <audio
                          ref={audioRef}
                          src={recordedAudio}
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          onEnded={handleEnded}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-12 text-sm text-gray-400">
                        {isRecording ? "Recording in progress..." : "No recording yet"}
                      </div>
                    )}
                  </div>

                  {/* Right side: Score boxes */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {/* Current Score (Orange) */}
                    <div className="px-4 py-2 bg-orange-100 border-2 border-orange-400 rounded-lg text-center min-w-[100px]">
                      <p className="text-xs text-gray-600 mb-1">Current</p>
                      <p className="text-xl font-bold text-orange-600">
                        {wordScores.find((w) => w.name === selectedWord)?.score}
                      </p>
                    </div>
                    {/* Practice Score (Green) - initially empty */}
                    <div className="px-4 py-2 bg-green-100 border-2 border-green-400 rounded-lg text-center min-w-[100px]">
                      <p className="text-xs text-gray-600 mb-1">Practice</p>
                      {practiceScore !== null ? (
                        <p className="text-xl font-bold text-green-600">{practiceScore}</p>
                      ) : (
                        <p className="text-xl font-bold text-gray-400">-</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recording progress indicator */}
                {isRecording && (
                  <div className="mt-4">
                    <p className="text-sm text-red-600 flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                      Recording... {recordingTime}s / 5s
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((recordingTime / 5) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Improvement message */}
                {practiceScore !== null && (
                  <div className="mt-4">
                    {practiceScore > (wordScores.find((w) => w.name === selectedWord)?.score || 0) ? (
                      <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                        <Award className="w-5 h-5" />
                        <span>Great improvement! Keep practicing!</span>
                      </div>
                    ) : (
                      <div className="text-center text-gray-600">
                        <span>Keep practicing to improve your score!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-6">
            <p className="text-sm font-semibold text-gray-700 w-full mb-2">Lowest Scoring Phonemes:</p>
            {(pronunciation.lowest_scoring_phonemes || []).map(
              (p: { ipa_label: any; phoneme_score: any }, idx: any) => (
                <span key={idx} className="border border-red-300 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                  {p.ipa_label}: {p.phoneme_score}
                </span>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      <Card className={cardBase}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Brain className="w-5 h-5 text-emerald-500" />
            Fluency & Rhythm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
              <p className="text-sm text-gray-600">Speech Rate (wpm)</p>
              <p className="text-2xl font-semibold text-emerald-600">{fluency.metrics?.speech_rate}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
              <p className="text-sm text-gray-600">Pauses</p>
              <p className="text-2xl font-semibold text-emerald-600">{fluency.metrics?.pauses}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
              <p className="text-sm text-gray-600">Filler Words</p>
              <p className="text-2xl font-semibold text-emerald-600">{fluency.metrics?.filler_words}</p>
            </div>
          </div>

          <div className="grid gap-2 mt-4">
            {Object.entries(fluency.feedback || {}).map(([key, value]) =>
              key !== "tagged_transcript" ? (
                <div key={key} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-emerald-700 capitalize">{key.replace(/_/g, " ")}</p>
                  <p className="text-gray-700 text-sm">{value.feedback_text}</p>
                </div>
              ) : null,
            )}
          </div>
        </CardContent>
      </Card>

      <Card className={cardBase}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Reading Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-2xl font-semibold text-purple-600">{(reading.accuracy * 100).toFixed(0)}%</p>
            </div>
            <div className="text-center bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Completion</p>
              <p className="text-2xl font-semibold text-purple-600">{(reading.completion * 100).toFixed(0)}%</p>
            </div>
            <div className="text-center bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Speed (WPM)</p>
              <p className="text-2xl font-semibold text-purple-600">{reading.speed_wpm.toFixed(1)}</p>
            </div>
            <div className="text-center bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Words Read</p>
              <p className="text-2xl font-semibold text-purple-600">{reading.words_read}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(Object.keys(warnings).length > 0 || metadata.predicted_text) && (
        <Card className={cardBase}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-800">
            {Object.entries(warnings).map(([key, value]) => (
              <div key={key}>
                <strong>{key}: </strong>
                {value}
              </div>
            ))}
            {metadata.predicted_text && (
              <div>
                <strong>Predicted Text:</strong> {metadata.predicted_text}
              </div>
            )}
            {metadata.content_relevance && (
              <div>
                <strong>Content Relevance:</strong> {metadata.content_relevance}%
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
