"use client"

import React, { useState, useRef, useEffect } from "react"
import { Mic, Square, Play, Pause, Clock } from "lucide-react"

interface IELTSQuestionRecorderProps {
  questionId: number;
  maxTimeSeconds?: number; // Maximum recording time per question in seconds (default 120 = 2 minutes)
  onRecordingComplete?: (audioBlob: Blob, duration: number, base64Audio: string) => void;
  onRecordingStart?: (questionId: number) => void;
  onTimeUpdate?: (remainingTime: number) => void;
  totalTimeUsed?: number; // Not used anymore - each question has its own time
  isRecording?: boolean; // Whether this specific question is currently recording
  shouldStop?: boolean; // External signal to stop recording
  autoStart?: boolean; // Automatically start recording when this prop is true
}

export function IELTSQuestionRecorder({
  questionId,
  maxTimeSeconds = 120,
  onRecordingComplete,
  onRecordingStart,
  onTimeUpdate,
  totalTimeUsed = 0,
  isRecording: globalIsRecording = false,
  shouldStop = false,
  autoStart = false,
}: IELTSQuestionRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0) // in milliseconds
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Each question has its own 2-minute timer
  // Calculate remaining time for THIS question only
  const currentRecordingSeconds = isRecording ? Math.floor(recordingTime / 1000) : 0
  const questionTimeUsed = audioUrl ? duration : 0 // Time already used for this question
  const remainingTimeSeconds = Math.max(0, maxTimeSeconds - questionTimeUsed - currentRecordingSeconds)

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // Stop recording if shouldStop is true
  useEffect(() => {
    if (shouldStop && isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      stopRecording();
    }
  }, [shouldStop, isRecording]);

  // Auto-start recording when autoStart prop is true
  useEffect(() => {
    if (autoStart && !isRecording && !audioUrl && remainingTimeSeconds > 0) {
      // Use a small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        startRecording();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  // Recording timer
  useEffect(() => {
    if (!isRecording) return
    
    timerIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        const newTime = prev + 100
        const newSeconds = Math.floor(newTime / 1000)
        
        // Get current question time used from state
        const currentQuestionTimeUsed = duration || 0
        const remaining = Math.max(0, maxTimeSeconds - currentQuestionTimeUsed - newSeconds)
        
        // Check if we've exceeded the remaining time for this question
        if (remaining <= 0) {
          // Auto-stop recording when time limit reached
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            stopRecording()
          }
          return prev
        }
        
        // Update parent with remaining time
        if (onTimeUpdate) {
          onTimeUpdate(remaining)
        }
        
        return newTime
      })
    }, 100)
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isRecording, maxTimeSeconds, duration, audioUrl, onTimeUpdate])

  // Start Recording
  const startRecording = async () => {
    const questionTimeUsed = audioUrl ? duration : 0
    const availableTime = Math.max(0, maxTimeSeconds - questionTimeUsed)
    if (availableTime <= 0) {
      alert("No time remaining for this question. Maximum recording time has been reached.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Detect supported mimeType
      let mimeType = "audio/webm"
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus"
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4"
      } else if (MediaRecorder.isTypeSupported("audio/aac")) {
        mimeType = "audio/aac"
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        const recordedDurationSeconds = Math.floor(recordingTime / 1000)
        
        // Convert to base64
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64Audio = reader.result as string
          
          const url = URL.createObjectURL(audioBlob)
          setAudioUrl(url)
          
          // Get actual audio duration from the blob
          const audio = new Audio(url)
          const getDuration = () => {
            if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
              const actualDuration = Math.floor(audio.duration)
              setDuration(actualDuration)
              if (onRecordingComplete) {
                onRecordingComplete(audioBlob, actualDuration, base64Audio)
              }
            } else {
              // Fallback to recorded duration if audio metadata fails
              setDuration(recordedDurationSeconds)
              if (onRecordingComplete) {
                onRecordingComplete(audioBlob, recordedDurationSeconds, base64Audio)
              }
            }
          }
          
          audio.onloadedmetadata = getDuration
          audio.onerror = () => {
            // Fallback to recorded duration if audio metadata fails
            setDuration(recordedDurationSeconds)
            if (onRecordingComplete) {
              onRecordingComplete(audioBlob, recordedDurationSeconds, base64Audio)
            }
          }
          
          // Try to get duration immediately if already loaded
          if (audio.readyState >= 2) {
            getDuration()
          }
        }
        reader.onerror = () => {
          console.error('Error converting audio to base64')
          // Still call onRecordingComplete with null base64
          const url = URL.createObjectURL(audioBlob)
          setAudioUrl(url)
          setDuration(recordedDurationSeconds)
          if (onRecordingComplete) {
            onRecordingComplete(audioBlob, recordedDurationSeconds, '')
          }
        }
        reader.readAsDataURL(audioBlob)
        
        // Stop all tracks
        streamRef.current?.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setAudioUrl(null)
      
      // Notify parent that recording has started
      if (onRecordingStart) {
        onRecordingStart(questionId)
      }
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Unable to access microphone. Please check permissions.")
    }
  }


  // Play/Pause audio
  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  return (
    <div style={{
      marginTop: '16px',
      padding: '16px',
      backgroundColor: 'rgba(17, 24, 39, 0.6)',
      border: '1px solid rgba(236, 72, 153, 0.3)',
      borderRadius: '12px',
    }}>
      {/* Timer Display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Clock size={16} color="#ec4899" />
          <span style={{
            color: '#ec4899',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'monospace',
          }}>
            Time Remaining: {formatTime(remainingTimeSeconds)}
          </span>
        </div>
        {isRecording && (
          <span style={{
            color: '#f87171',
            fontSize: '12px',
            fontWeight: '500',
          }}>
            Recording: {formatTime(currentRecordingSeconds)}
          </span>
        )}
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            disabled={remainingTimeSeconds <= 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: remainingTimeSeconds <= 0 
                ? 'rgba(75, 85, 99, 0.4)' 
                : 'linear-gradient(135deg, #ec4899, #f472b6)',
              color: '#ffffff',
              cursor: remainingTimeSeconds <= 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (remainingTimeSeconds > 0) {
                e.currentTarget.style.transform = 'scale(1.05)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <Mic size={18} />
            Record Answer
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#dc2626',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            <Square size={18} />
            Stop Recording
          </button>
        )}

        {audioUrl && (
          <>
            <button
              onClick={handlePlayPause}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(236, 72, 153, 0.5)',
                background: 'transparent',
                color: '#ec4899',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <span style={{
              color: '#9ca3af',
              fontSize: '12px',
            }}>
              Duration: {formatTime(Math.floor(duration))}
            </span>
          </>
        )}
      </div>

      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={(e) => {
            const target = e.currentTarget
            setCurrentTime(target.currentTime)
            if (target.duration && !isNaN(target.duration)) {
              setDuration(Math.floor(target.duration))
            }
          }}
          onLoadedMetadata={(e) => {
            const target = e.currentTarget
            if (target.duration && !isNaN(target.duration)) {
              setDuration(Math.floor(target.duration))
            }
          }}
          style={{ display: 'none' }}
        />
      )}
    </div>
  )
}

