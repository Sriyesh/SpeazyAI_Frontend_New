"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Dialog, DialogContent } from "./ui/dialog"
import { MelloAssistant } from "./MelloAssistant"
import {
  ArrowLeft,
  Pause,
  BookOpen,
  Star,
  Trophy,
  Clock,
  Mic,
  Volume2,
  CheckCircle,
  Sparkles,
  Square,
} from "lucide-react"
import { AudioRecorder } from "./audioRecorder"
import { useNavigate } from "react-router-dom"

interface MyLessonsProps {
  onBack: () => void
}

type View = "lesson-list" | "lesson-detail"

const lessons = [
  {
    id: "adventure-tale",
    title: "The Great Adventure",
    description: "A magical story about friendship and courage",
    difficulty: "Beginner",
    duration: "5 min",
    illustration: "castle", // castle
    color: "from-[#3B82F6] to-[#00B9FC]",
    completed: true,
    content: `Once upon a time, in a land far away, there lived a young explorer named Alex. Alex had always dreamed of going on a great adventure to discover magical treasures hidden in the enchanted forest.`,
    practiceWords: ["adventure", "explorer", "magical", "friendship", "treasure", "courage"],
  },
  {
    id: "space-journey",
    title: "Journey to the Stars",
    description: "An exciting trip through space and planets",
    difficulty: "Intermediate",
    duration: "7 min",
    illustration: "rocket", // rocket
    color: "from-[#1E3A8A] to-[#3B82F6]",
    completed: false,
    content: `Captain Luna was the youngest astronaut ever chosen for the Mars mission. Her spacecraft, called the Stellar Wind, was equipped with the most advanced technology in the galaxy.
As Luna launched into space, she watched Earth become smaller and smaller until it looked like a beautiful blue marble floating in the darkness. The journey through space was filled with amazing sights: colorful nebulae, spinning asteroids, and distant planets.
On her way to Mars, Luna encountered a space station where friendly alien scientists were conducting research. They shared their knowledge about the universe and taught Luna about different star systems and galaxies.
When Luna finally reached Mars, she planted a flag and collected samples of the red soil. She discovered evidence of ancient rivers and realized that Mars once had water flowing on its surface.
The return journey was just as exciting. Luna brought back valuable information that helped scientists on Earth learn more about space exploration and the possibility of life on other planets.`,
    practiceWords: ["astronaut", "spacecraft", "galaxy", "nebulae", "exploration", "planets"],
  },
  {
    id: "underwater-world",
    title: "Secrets of the Ocean",
    description: "Dive deep into the underwater kingdom",
    difficulty: "Advanced",
    duration: "10 min",
    illustration: "wave", // wave
    color: "from-[#00B9FC] to-[#3B82F6]",
    completed: false,
    content: `Marine biologist Dr. Maya had always been fascinated by the mysteries hidden beneath the ocean waves. Armed with her advanced diving equipment and underwater camera, she embarked on an expedition to explore the deepest parts of the Pacific Ocean.
As Maya descended into the abyss, she discovered a vibrant coral reef teeming with colorful fish, sea turtles, and exotic marine life. The reef was like an underwater rainbow, with corals of every imaginable color creating a living work of art.
Deep in the ocean depths, Maya encountered a family of whales who seemed to communicate through beautiful songs that echoed through the water. She recorded their melodies, hoping to understand their complex language and social behaviors.
Her most incredible discovery was an underwater cave system filled with bioluminescent creatures that glowed like living stars. These organisms created their own light through chemical reactions, illuminating the dark ocean depths with natural beauty.
Maya's research helped protect marine ecosystems and educated people about the importance of preserving our oceans for future generations.`,
    practiceWords: ["biologist", "expedition", "bioluminescent", "ecosystems", "preservation", "organisms"],
  },
]

export function MyLessons() {
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState<View>("lesson-list")
  const [selectedLesson, setSelectedLesson] = useState<(typeof lessons)[0] | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [melloMessage, setMelloMessage] = useState(true)
  const [melloState, setMelloState] = useState<
    "idle" | "talking" | "excited" | "encouraging" | "thinking" | "celebrating"
  >("encouraging")
  const [showFloatingMic, setShowFloatingMic] = useState(false)

  const resultRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)
  const audioDataRef = useRef<number[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleLessonSelect = (lesson: (typeof lessons)[0]) => {
    setSelectedLesson(lesson)
    setCurrentView("lesson-detail")
    setReadingProgress(0)
    setIsRecording(false)
    setShowRecordingModal(false)
    setShowFloatingMic(false)
  }

  const startRecording = () => {
    setShowRecordingModal(true)
    setIsRecording(true)
    setMelloState("encouraging")
    setMelloMessage(false)
    audioDataRef.current = []
    startWaveformAnimation() // Waveform starts
  }

  const stopRecording = () => {
    setIsRecording(false)
    setShowRecordingModal(false)
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
    setTimeout(() => {
      setReadingProgress(100)
      setMelloState("celebrating")
      scrollToResult()
    }, 800)
  }

  // Fixed Waveform Animation
  const startWaveformAnimation = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 300
    canvas.height = 100

    const barWidth = 4
    const barGap = 2
    const bars = Math.floor(canvas.width / (barWidth + barGap))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Simulate audio input
      if (Math.random() > 0.3) {
        const level = Math.random() * 0.8 + 0.2
        audioDataRef.current.push(level)
      }

      if (audioDataRef.current.length > bars) {
        audioDataRef.current.shift()
      }

      const data = audioDataRef.current

      data.forEach((level, i) => {
        const height = level * canvas.height * 0.8
        const x = i * (barWidth + barGap)
        const y = (canvas.height - height) / 2

        const gradient = ctx.createLinearGradient(x, y, x, y + height)
        gradient.addColorStop(0, "#3B82F6")
        gradient.addColorStop(1, "#00B9FC")

        ctx.fillStyle = gradient
        ctx.shadowBlur = 12
        ctx.shadowColor = "#3B82F6"
        ctx.fillRect(x, y, barWidth, height)
      })

      // Center line
      ctx.shadowBlur = 0
      ctx.strokeStyle = "#BFDBFE"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  const scrollToResult = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      setShowFloatingMic(true)
    }, 100)
  }

  const handleListen = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTimeout(() => setIsListening(false), 5000)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || readingProgress !== 100) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const resultTop = resultRef.current?.offsetTop || 0
      const viewportHeight = container.clientHeight

      if (scrollTop + viewportHeight > resultTop + 100) {
        setShowFloatingMic(true)
      } else if (scrollTop < resultTop - viewportHeight) {
        setShowFloatingMic(false)
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [readingProgress])

  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  const BLURRY_BLUE_BG: React.CSSProperties = {
    backgroundColor: "#123A8A",
    backgroundImage: `
      radial-gradient(900px 700px at 78% 28%, rgba(21,86,197,0.75) 0%, rgba(21,86,197,0.10) 55%, rgba(21,86,197,0) 70%),
      radial-gradient(880px 680px at 20% 20%, rgba(18,59,150,0.75) 0%, rgba(18,59,150,0.10) 55%, rgba(18,59,150,0) 70%),
      radial-gradient(900px 700px at 80% 78%, rgba(13,52,152,0.80) 0%, rgba(13,52,152,0.10) 55%, rgba(13,52,152,0) 70%),
      radial-gradient(820px 640px at 18% 82%, rgba(0,185,252,0.35) 0%, rgba(0,185,252,0.06) 55%, rgba(0,185,252,0) 70%),
      radial-gradient(700px 560px at 60% 12%, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0.06) 55%, rgba(59,130,246,0) 72%),
      radial-gradient(900px 700px at 92% 50%, rgba(8,44,132,0.85) 0%, rgba(8,44,132,0.10) 55%, rgba(8,44,132,0) 75%)
    `,
    backgroundBlendMode: "normal",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  const TEXT_LIGHT = "#F2F6FF"
  const TEXT_MUTED = "rgba(242,246,255,0.78)"
  const CARD_TEXT = "#0F1F47"

  const renderLessonList = () => (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={BLURRY_BLUE_BG} />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
          }
        }
        .animated-star {
          animation: float 3s ease-in-out infinite;
        }
        .glow-blue {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-3 h-3 bg-[#3B82F6] rounded-full opacity-70 animated-star glow-blue" />
        <div className="absolute top-32 right-20 w-2 h-2 bg-[#00B9FC] rounded-full opacity-60 animated-star" />
        <Sparkles className="absolute top-20 left-1/3 w-6 h-6 text-[#00B9FC] opacity-70 animated-star" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:text-[#CFE2FF] hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-white">My Lessons Book</h1>
            <div />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            Practice Stories & Lessons
            <BookOpen className="w-10 h-10 text-[#00B9FC] animated-star" />
          </h2>
          <p className="text-xl" style={{ color: TEXT_MUTED }}>
            Read amazing stories and improve your speaking skills!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson) => (
            <Card
              key={lesson.id}
              className="group bg-white neumorphic-card border-0 shadow-lg hover:shadow-2xl hover:glow-blue transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 cursor-pointer overflow-hidden relative"
              onClick={() => handleLessonSelect(lesson)}
            >
              {lesson.completed && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>COMPLETED</span>
                  </div>
                </div>
              )}
              <CardHeader className="pb-4">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${lesson.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg glow-blue animated-star mx-auto text-4xl`}
                >
                  {lesson.illustration === "castle" && "castle"}
                  {lesson.illustration === "rocket" && "rocket"}
                  {lesson.illustration === "wave" && "wave"}
                </div>
                <CardTitle
                  className="text-xl text-center group-hover:text-[#3B82F6] transition-colors"
                  style={{ color: CARD_TEXT }}
                >
                  {lesson.title}
                </CardTitle>
                <p className="text-sm text-center" style={{ color: "rgba(15,31,71,0.75)" }}>
                  {lesson.description}
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="flex items-center" style={{ color: "#3B82F6" }}>
                    <Star className="w-4 h-4 mr-1" />
                    {lesson.difficulty}
                  </div>
                  <div className="flex items-center" style={{ color: "#3B82F6" }}>
                    <Clock className="w-4 h-4 mr-1" />
                    {lesson.duration}
                  </div>
                </div>
                <Button
                  size="sm"
                  className={`bg-gradient-to-r ${lesson.color} hover:opacity-90 hover:scale-110 text-white border-0 rounded-full px-6 glow-blue transform transition-all duration-200`}
                >
                  {lesson.completed ? "Read Again!" : "Start Reading!"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderLessonDetail = () => {
    if (!selectedLesson) return null

    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={BLURRY_BLUE_BG} />

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          @keyframes glow {
            0%,
            100% {
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
            }
            50% {
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
            }
          }
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.3);
            }
          }
          .animated-star {
            animation: float 3s ease-in-out infinite;
          }
          .glow-blue {
            animation: glow 2s ease-in-out infinite;
          }
          .recording-dot {
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}</style>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-3 h-3 bg-[#3B82F6] rounded-full opacity-70 animated-star" />
          <Sparkles className="absolute top-20 left-1/3 w-6 h-6 text-[#00B9FC] opacity-70 animated-star" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("lesson-list")}
                className="text-white hover:text-[#CFE2FF]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lessons
              </Button>
              <h1 className="text-xl font-bold text-white">{selectedLesson.title}</h1>
              <div />
            </div>
          </div>
        </header>

        <ScrollArea ref={scrollContainerRef} className="h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            <Card className="mb-8 bg-white neumorphic-card border-0 shadow-xl glow-blue">
              <CardHeader className="text-center">
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${selectedLesson.color} rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg glow-blue animated-star text-5xl`}
                >
                  {selectedLesson.illustration === "castle" && "castle"}
                  {selectedLesson.illustration === "rocket" && "rocket"}
                  {selectedLesson.illustration === "wave" && "wave"}
                </div>
                <CardTitle className="text-3xl mb-2" style={{ color: CARD_TEXT }}>
                  {selectedLesson.title}
                </CardTitle>
                <p style={{ color: "rgba(15,31,71,0.75)" }}>{selectedLesson.description}</p>
                <div className="flex justify-center space-x-6 mt-4 text-sm">
                  <div className="flex items-center" style={{ color: "#3B82F6" }}>
                    <Star className="w-4 h-4 mr-1" />
                    {selectedLesson.difficulty}
                  </div>
                  <div className="flex items-center" style={{ color: "#3B82F6" }}>
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedLesson.duration}
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="mb-8 bg-white neumorphic-card border-0 shadow-xl">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-xl font-bold mb-4" style={{ color: CARD_TEXT }}>
                  Listen to the Story
                </h3>
                <Button
                  size="lg"
                  onClick={handleListen}
                  className="bg-gradient-to-r from-[#00B9FC] to-[#3B82F6] hover:opacity-90 text-white border-0 rounded-full px-8 shadow-lg transform hover:scale-105 transition-all duration-200 glow-blue"
                >
                  {isListening ? (
                    <>
                      <Pause className="w-6 h-6 mr-2" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-6 h-6 mr-2" />
                      Listen to Story
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="mb-8 bg-white neumorphic-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center mb-4" style={{ color: CARD_TEXT }}>
                  Read Along Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg leading-relaxed space-y-4 mb-6" style={{ color: "rgba(15,31,71,0.85)" }}>
                  {selectedLesson.content.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="text-center">
                  {!isRecording && readingProgress < 100 ? (
                    <AudioRecorder lessonColor="from-[#3B82F6] to-[#00B9FC]" />
                  ) : readingProgress === 100 ? null : (
                    <div className="text-center" style={{ color: "#3B82F6" }}>
                      <p>Recording in progress...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white neumorphic-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center" style={{ color: CARD_TEXT }}>
                  Practice Words
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedLesson.practiceWords.map((word, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-[#3B82F6]/10 to-[#00B9FC]/10 border border-[#3B82F6]/30 rounded-xl p-4 text-center hover:glow-blue transition-all duration-200 transform hover:scale-105"
                      style={{ color: "#3B82F6" }}
                    >
                      <span className="font-medium">{word}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {readingProgress === 100 && (
              <div ref={resultRef}>
                <Card className="mt-8 bg-gradient-to-r from-green-400 to-emerald-500 border-0 text-white glow-blue">
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4 animate-bounce">party-popper</div>
                    <h3 className="text-3xl font-bold mb-4">Fantastic Reading! You completed the story!</h3>
                    <p className="text-xl mb-6">Your speaking skills are getting better every day!</p>
                    <Button
                      size="lg"
                      onClick={() => setCurrentView("lesson-list")}
                      className="bg-white text-green-600 hover:bg-green-50 border-0 rounded-full px-8"
                    >
                      <Trophy className="w-6 h-6 mr-2" />
                      Choose Next Story!
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Floating Mic Button */}
        {showFloatingMic && readingProgress === 100 && (
          <Button
            size="lg"
            onClick={startRecording}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-full p-4 shadow-2xl glow-blue transform hover:scale-110 transition-all duration-200"
          >
            <Mic className="w-8 h-8" />
          </Button>
        )}

        {/* Recording Modal with Working Waveform */}
        <Dialog open={showRecordingModal} onOpenChange={setShowRecordingModal}>
          <DialogContent className="sm:max-w-md bg-white neumorphic-card border-0 text-gray-800">
            <div className="flex flex-col items-center space-y-6 p-6">
              <div className="relative">
                <div className="w-5 h-5 bg-red-500 rounded-full recording-dot"></div>
                <div className="absolute inset-0 w-5 h-5 bg-red-500 rounded-full animate-ping"></div>
              </div>

              <h3 className="text-2xl font-bold text-center" style={{ color: CARD_TEXT }}>
                Recording Your Voice...
              </h3>
              <p className="text-center text-sm" style={{ color: "#3B82F6" }}>
                Speak clearly — your voice is being captured!
              </p>

              {/* Working Waveform */}
              <canvas
                ref={canvasRef}
                width={300}
                height={100}
                className="w-full h-24 rounded-lg bg-gradient-to-r from-[#3B82F6]/5 to-[#00B9FC]/5 border border-[#3B82F6]/20 shadow-inner"
                style={{ imageRendering: "crisp-edges" }}
              />

              <Button
                size="lg"
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 shadow-lg flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop Recording
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const getMelloMessage = () => {
    if (readingProgress === 100) return "Great job reading! That was impressive!"
    if (showRecordingModal) return "Speak clearly and have fun!"
    if (currentView === "lesson-detail") return "Ready to read aloud? Let's go!"
    return "Pick a story and start practicing!"
  }

  return (
    <>
      {currentView === "lesson-list" ? renderLessonList() : renderLessonDetail()}
      <MelloAssistant
        state={melloState}
        message={getMelloMessage()}
        showMessage={melloMessage || readingProgress === 100 || showRecordingModal}
        onMessageDismiss={() => setMelloMessage(false)}
      />
    </>
  )
}
