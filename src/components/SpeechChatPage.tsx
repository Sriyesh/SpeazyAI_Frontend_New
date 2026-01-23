"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { ArrowLeft, Mic, Square, Bot, User, Volume2, VolumeX } from "lucide-react"
import { motion } from "motion/react"
import { API_URLS } from '@/config/apiConfig';

type Message = {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export function SpeechChatPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { role, title, id } = location.state || {
    role: "You are a helpful AI assistant.",
    title: "AI Assistant",
    id: "assistant"
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm your ${title}. How can I help you today?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null)
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null)

  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isSpeakingRef = useRef<boolean>(false)
  const highlightIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Web Speech API
  useEffect(() => {
    // Check for browser support
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Speech recognition not supported in this browser")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      handleUserMessage(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsRecording(false)
      if (event.error === "no-speech") {
        alert("No speech detected. Please try again.")
      } else if (event.error === "not-allowed") {
        alert("Microphone permission denied. Please enable microphone access.")
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (currentUtteranceRef.current) {
        synthesisRef.current?.cancel()
      }
    }
  }, [])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Read out welcome message when component mounts
  useEffect(() => {
    if (messages.length > 0 && messages[0].sender === "ai") {
      const welcomeMessage = messages[0].text
      // Small delay to ensure speech synthesis is ready
      const timer = setTimeout(() => {
        if (synthesisRef.current) {
          speakWithHighlighting(welcomeMessage, 1) // Pass message ID 1 for welcome message
        }
      }, 500)
      
      return () => {
        clearTimeout(timer)
        if (synthesisRef.current && currentUtteranceRef.current) {
          synthesisRef.current.cancel()
        }
      }
    }
  }, []) // Only run once on mount

  const startRecording = async () => {
    try {
      // Request microphone access
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

      mediaRecorder.start()
      setIsRecording(true)

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Unable to access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      // Stop media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call ChatGPT API
      const proxyUrl = API_URLS.chatgptProxy

      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "chat",
          messages: [
            {
              role: "system",
              content: role,
            },
            ...messages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            {
              role: "user",
              content: text.trim(),
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      const aiResponse = data.response || data.content || data.message || "I'm sorry, I couldn't generate a response."

      // Add AI message
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)

      // Convert to speech and play with highlighting
      speakWithHighlighting(aiResponse, aiMessage.id)
    } catch (error) {
      console.error("Error calling ChatGPT API:", error)
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const speakWithHighlighting = (text: string, messageId?: number) => {
    if (!synthesisRef.current) return

    // Determine which message is being spoken
    const currentMessageId = messageId !== undefined ? messageId : messages.length
    setSpeakingMessageId(currentMessageId)

    // Cancel any ongoing speech and clear intervals
    synthesisRef.current.cancel()
    if (highlightIntervalRef.current) {
      clearInterval(highlightIntervalRef.current)
      highlightIntervalRef.current = null
    }

    // Get only actual words (no spaces) for timing calculation
    const actualWords = text.split(/\s+/).filter(w => w.length > 0)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    // Simplified approach: Use consistent timing per word with character-based adjustment
    // At rate 0.9, speech synthesis typically speaks faster than estimated
    // Making it much faster to match actual speech
    const speechRate = 0.9
    // Much reduced base time per word to match faster speech
    const baseMsPerWord = 250 / speechRate // ~278ms per word at 0.9 rate (much faster)
    const msPerChar = 15 // Much reduced ms per character to speed up highlighting
    
    const wordBoundaries: { wordIndex: number; startTime: number; endTime: number }[] = []
    let currentTime = 0

    actualWords.forEach((word, index) => {
      // Base duration + character-based adjustment
      const wordDuration = baseMsPerWord + (word.length * msPerChar)
      
      wordBoundaries.push({
        wordIndex: index,
        startTime: currentTime,
        endTime: currentTime + wordDuration,
      })
      
      currentTime += wordDuration
      
      // Minimal pause between words to speed up highlighting
      if (index < actualWords.length - 1) {
        currentTime += 20 // 20ms pause (minimal)
      }
    })
    
    const estimatedTotalMs = currentTime

    let speechStartTime = 0
    let actualSpeechDuration = 0
    let scaleFactor = 1

    utterance.onstart = () => {
      isSpeakingRef.current = true
      setIsSpeaking(true)
      setHighlightedWordIndex(0)
      speechStartTime = Date.now()
      
      // Start highlighting interval
      highlightIntervalRef.current = setInterval(() => {
        if (!isSpeakingRef.current) {
          if (highlightIntervalRef.current) {
            clearInterval(highlightIntervalRef.current)
            highlightIntervalRef.current = null
          }
          return
        }

        const elapsed = Date.now() - speechStartTime
        
        // Scale elapsed time if we have actual duration
        const adjustedElapsed = scaleFactor > 1 ? elapsed * scaleFactor : elapsed
        
        // Find the current word being spoken
        let currentWordIndex = null
        for (let i = 0; i < wordBoundaries.length; i++) {
          const boundary = wordBoundaries[i]
          if (adjustedElapsed >= boundary.startTime && adjustedElapsed < boundary.endTime) {
            currentWordIndex = boundary.wordIndex
            break
          }
        }

        // If we've passed all words, highlight the last word and then stop
        if (currentWordIndex === null) {
          // Check if we should highlight the last word
          if (adjustedElapsed >= wordBoundaries[wordBoundaries.length - 1]?.startTime) {
            setHighlightedWordIndex(wordBoundaries.length - 1)
          }
          
          // Only stop if we're well past the estimated end
          const maxTime = scaleFactor > 1 ? estimatedTotalMs * scaleFactor * 1.2 : estimatedTotalMs * 1.2
          if (adjustedElapsed >= maxTime) {
            if (highlightIntervalRef.current) {
              clearInterval(highlightIntervalRef.current)
              highlightIntervalRef.current = null
            }
            setHighlightedWordIndex(null)
            return
          }
        } else {
          // Update highlighted word
          setHighlightedWordIndex(currentWordIndex)
        }
      }, 30) // Check every 30ms for faster, more responsive updates
    }

    utterance.onend = () => {
      actualSpeechDuration = Date.now() - speechStartTime
      // Calculate scale factor for future adjustments
      if (estimatedTotalMs > 0 && actualSpeechDuration > 0) {
        scaleFactor = actualSpeechDuration / estimatedTotalMs
      }
      isSpeakingRef.current = false
      setIsSpeaking(false)
      setHighlightedWordIndex(null)
      setSpeakingMessageId(null)
      if (highlightIntervalRef.current) {
        clearInterval(highlightIntervalRef.current)
        highlightIntervalRef.current = null
      }
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event)
      isSpeakingRef.current = false
      setIsSpeaking(false)
      setHighlightedWordIndex(null)
      setSpeakingMessageId(null)
      if (highlightIntervalRef.current) {
        clearInterval(highlightIntervalRef.current)
        highlightIntervalRef.current = null
      }
    }

    currentUtteranceRef.current = utterance
    synthesisRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      isSpeakingRef.current = false
      setIsSpeaking(false)
      setHighlightedWordIndex(null)
      setSpeakingMessageId(null)
      if (highlightIntervalRef.current) {
        clearInterval(highlightIntervalRef.current)
        highlightIntervalRef.current = null
      }
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #1E3A8A, #2563eb, #1E3A8A)",
    }}>
      {/* Header */}
      <header
        style={{
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(30, 58, 138, 0.95)",
        }}
      >
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Stop any ongoing speech before navigating
                  if (synthesisRef.current) {
                    synthesisRef.current.cancel()
                    isSpeakingRef.current = false
                    setIsSpeaking(false)
                    setHighlightedWordIndex(null)
                    setSpeakingMessageId(null)
                    if (highlightIntervalRef.current) {
                      clearInterval(highlightIntervalRef.current)
                      highlightIntervalRef.current = null
                    }
                  }
                  // Navigate back to chat selection page
                  navigate("/chat")
                }}
                style={{
                  color: "#F2F6FF",
                  transition: "all 0.3s",
                }}
              >
                <ArrowLeft style={{ width: "16px", height: "16px", marginRight: "8px" }} />
                Back
              </Button>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
              <h1 style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: "#F2F6FF",
              }}>
                {title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div style={{
        maxWidth: "896px",
        margin: "0 auto",
        padding: "2rem 1rem",
      }}>
        <Card
          style={{
            height: "calc(100vh - 200px)",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            background: "#FFFFFF",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "24px",
          }}
        >
          {/* Messages Area */}
          <CardContent style={{
            flex: 1,
            overflow: "hidden",
            padding: 0,
          }}>
            <ScrollArea style={{
              height: "100%",
              padding: "1rem 1.5rem",
            }} ref={scrollAreaRef}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}>
                {messages.map((message) => {
                  const words = message.text.split(/(\s+)/)
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        display: "flex",
                        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem",
                          maxWidth: "80%",
                          flexDirection: message.sender === "user" ? "row-reverse" : "row",
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            background: message.sender === "ai"
                              ? "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)"
                              : "#1E3A8A",
                          }}
                        >
                          {message.sender === "ai" ? (
                            <Bot style={{ width: "20px", height: "20px", color: "#FFFFFF" }} />
                          ) : (
                            <User style={{ width: "20px", height: "20px", color: "#FFFFFF" }} />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          style={{
                            borderRadius: "16px",
                            padding: "0.75rem 1rem",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            background: message.sender === "ai" ? "#F2F6FF" : "#3B82F6",
                            border: "1px solid rgba(59, 130, 246, 0.1)",
                            color: message.sender === "ai" ? "#1E3A8A" : "#FFFFFF",
                          }}
                        >
                          {message.sender === "ai" && isSpeaking && message.id === speakingMessageId ? (
                            <p style={{
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              lineHeight: "1.625",
                            }}>
                              {words.map((word, index) => {
                                // Calculate word index (only counting actual words, not spaces)
                                const isWord = word.trim().length > 0
                                
                                if (!isWord) {
                                  // It's a space, don't highlight
                                  return <span key={index}>{word}</span>
                                }
                                
                                // Count how many actual words we've seen before this index
                                let wordCount = 0
                                for (let i = 0; i < index; i++) {
                                  if (words[i].trim().length > 0) {
                                    wordCount++
                                  }
                                }
                                
                                // Current word's index
                                const wordIndex = wordCount
                                const isHighlighted = highlightedWordIndex !== null && highlightedWordIndex === wordIndex
                                
                                return (
                                  <span
                                    key={index}
                                    style={{
                                      backgroundColor: isHighlighted ? "rgba(59, 130, 246, 0.3)" : "transparent",
                                      transition: "background-color 0.15s ease",
                                      padding: isHighlighted ? "2px 4px" : "0",
                                      borderRadius: isHighlighted ? "4px" : "0",
                                      display: "inline",
                                    }}
                                  >
                                    {word}
                                  </span>
                                )
                              })}
                            </p>
                          ) : (
                            <p style={{
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              whiteSpace: "pre-line",
                              lineHeight: "1.625",
                            }}>
                              {message.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Loading Indicator */}
                {isLoading && (
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
                        }}
                      >
                        <Bot style={{ width: "20px", height: "20px", color: "#FFFFFF" }} />
                      </div>
                      <div
                        style={{
                          borderRadius: "16px",
                          padding: "0.75rem 1rem",
                          background: "#F2F6FF",
                          border: "1px solid rgba(59, 130, 246, 0.1)",
                        }}
                      >
                        <div style={{
                          display: "flex",
                          gap: "0.5rem",
                        }}>
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#3B82F6",
                              animation: "bounce 1s infinite",
                            }}
                          />
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#3B82F6",
                              animation: "bounce 1s infinite 0.2s",
                            }}
                          />
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#3B82F6",
                              animation: "bounce 1s infinite 0.4s",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input Area */}
          <div
            style={{
              padding: "1.5rem",
              borderTop: "1px solid rgba(59, 130, 246, 0.1)",
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}>
              {isSpeaking && (
                <Button
                  onClick={stopSpeaking}
                  variant="outline"
                  size="lg"
                  style={{
                    borderRadius: "9999px",
                    borderColor: "#DC2626",
                    color: "#DC2626",
                  }}
                >
                  <VolumeX style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                  Stop Speaking
                </Button>
              )}
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  size="lg"
                  style={{
                    borderRadius: "9999px",
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                    transition: "all 0.3s",
                    background: "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
                    color: "#FFFFFF",
                  }}
                >
                  <Mic style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                  {isLoading ? "Processing..." : "Hold to Speak"}
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  size="lg"
                  style={{
                    borderRadius: "9999px",
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                    transition: "all 0.3s",
                    background: "#DC2626",
                    color: "#FFFFFF",
                  }}
                >
                  <Square style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                  Stop Recording
                </Button>
              )}
            </div>
            <p style={{
              textAlign: "center",
              fontSize: "0.75rem",
              marginTop: "1rem",
              color: "rgba(30, 58, 138, 0.6)",
            }}>
              {isRecording
                ? "Listening... Speak now"
                : isSpeaking
                ? "AI is speaking..."
                : "Click the microphone button and speak your question"}
            </p>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
