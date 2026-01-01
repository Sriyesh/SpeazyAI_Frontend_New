"use client"

import type React from "react"

// file: HomePage.tsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { MelloAssistant } from "./MelloAssistant"
import { motion } from "motion/react"
import {
  Mic2,
  UserPlus,
  Star,
  Sparkles,
  Play,
  BookOpen,
} from "lucide-react"

export function HomePage() {
  const navigate = useNavigate()
  const [showMelloMessage, setShowMelloMessage] = useState(true)
  const [isBlinking, setIsBlinking] = useState(false)
  const [eyeScale, setEyeScale] = useState(1)

  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      },
      3000 + Math.random() * 2000,
    )
    return () => clearInterval(blinkInterval)
  }, [])

  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      setEyeScale(1.1)
      setTimeout(() => setEyeScale(1), 200)
    }, 4000)
    return () => clearInterval(sparkleInterval)
  }, [])

  const TEXT_LIGHT = "#F2F6FF"
  const TEXT_MUTED = "rgba(242,246,255,0.78)"
  const CARD_TEXT = "#0F1F47"

  // UPDATED: removed the first white glow gradient. Blues only.
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

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 -z-10" style={BLURRY_BLUE_BG} />

      <nav className="sticky top-0 z-50 backdrop-blur-sm/0 border-b border-white/10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-8">
              {[
                { label: "Home" },
                {
                  label: "About",
                  onClick: () => navigate("/about"),
                },
                { label: "Courses" },
                { label: "Features" },
                {
                  label: "Contact",
                  onClick: () => navigate("/contact"),
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  className="hover:opacity-90 transition"
                  style={{ color: "#3B82F6" }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/contact")}
                className="hidden sm:block hover:opacity-90 transition"
                style={{ color: TEXT_LIGHT }}
              >
                Contact Us
              </button>
              <Button
                onClick={() => navigate("/signup")}
                className="linear-gradient-primary text-white rounded-xl px-5 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Sign Up
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="border-2 border-white/60 text-white hover:bg-white/10 rounded-xl px-5 transition"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative flex-1 flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-40 md:pt-48 lg:pt-56 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
            <div className="space-y-4 flex flex-col justify-center h-full">
              {/* Mello Logo and English Skill AI */}
              <div className="flex items-center space-x-4 mb-4">
                <motion.div
                  animate={{
                    y: [0, -12, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] rounded-full blur-3xl scale-150"
                  />
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    className="relative z-10"
                  >
                    <defs>
                      <radialGradient id="logoBodyGradient" cx="50%" cy="40%">
                        <stop offset="0%" stopColor="#E0F2FE" />
                        <stop offset="50%" stopColor="#BAE6FD" />
                        <stop offset="100%" stopColor="#7DD3FC" />
                      </radialGradient>
                    </defs>
                    {/* Cloud Body */}
                    <g>
                      <ellipse cx="60" cy="65" rx="45" ry="40" fill="url(#logoBodyGradient)" />
                      <circle cx="35" cy="55" r="20" fill="url(#logoBodyGradient)" />
                      <circle cx="85" cy="55" r="20" fill="url(#logoBodyGradient)" />
                      <circle cx="60" cy="45" r="22" fill="url(#logoBodyGradient)" />
                      <circle cx="45" cy="75" r="18" fill="url(#logoBodyGradient)" />
                      <circle cx="75" cy="75" r="18" fill="url(#logoBodyGradient)" />
                    </g>
                    {/* Eyes */}
                    <ellipse
                      cx="48"
                      cy="58"
                      rx="8"
                      ry={isBlinking ? "1" : "10"}
                      fill="#1E3A8A"
                      style={{
                        transform: `scale(${eyeScale})`,
                        transformOrigin: "48px 58px",
                        transition: "all 0.15s ease",
                      }}
                    />
                    {!isBlinking && (
                      <>
                        <circle cx="50" cy="55" r="3" fill="white" opacity="0.9" />
                        <circle cx="46" cy="60" r="1.5" fill="white" opacity="0.6" />
                      </>
                    )}
                    <ellipse
                      cx="72"
                      cy="58"
                      rx="8"
                      ry={isBlinking ? "1" : "10"}
                      fill="#1E3A8A"
                      style={{
                        transform: `scale(${eyeScale})`,
                        transformOrigin: "72px 58px",
                        transition: "all 0.15s ease",
                      }}
                    />
                    {!isBlinking && (
                      <>
                        <circle cx="74" cy="55" r="3" fill="white" opacity="0.9" />
                        <circle cx="70" cy="60" r="1.5" fill="white" opacity="0.6" />
                      </>
                    )}
                    {/* Smile */}
                    <path
                      d="M 45 75 Q 60 85 75 75"
                      stroke="#1E3A8A"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Blush - Left cheek */}
                    <ellipse
                      cx="40"
                      cy="72"
                      rx="8"
                      ry="6"
                      fill="#FFB6C1"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.7;0.4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </ellipse>
                    {/* Blush - Right cheek */}
                    <ellipse
                      cx="80"
                      cy="72"
                      rx="8"
                      ry="6"
                      fill="#FFB6C1"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.7;0.4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </ellipse>
                  </svg>
                </motion.div>
                <span
                  className="font-normal text-4xl md:text-5xl lg:text-6xl"
                  style={{ 
                    color: TEXT_LIGHT,
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  English Skill AI
                </span>
              </div>

              <div id="heading-section">
                <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-normal" style={{ color: TEXT_LIGHT, fontFamily: "'DM Sans', sans-serif" }}>
                  Empowering Confident Communication with AI
                </h1>

                <p className="text-lg leading-relaxed mt-4 font-normal" style={{ color: TEXT_MUTED, fontFamily: "'DM Sans', sans-serif" }}>
                  Transform your speaking skills with our AI-powered platform. Get instant feedback, personalized
                  coaching, and interactive lessons designed by experts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={() => navigate("/signup")}
                  className="h-12 px-6 linear-gradient-primary text-white rounded-2xl shadow-xl hover:shadow-2xl transition hover:scale-105 text-base"
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Get Started for Free
                </Button>
                <Button
                  variant="outline"
                  className="h-12 px-6 border-2 border-white/60 text-white hover:bg-white/10 rounded-2xl transition hover:scale-105 text-base bg-transparent"
                >
                  <Play className="w-4 h-4 mr-2" /> Watch Demo
                </Button>
              </div>
            </div>

            <div className="relative flex items-center justify-center h-full">
              <div className="relative w-full flex items-center justify-center">
                <Card className="relative z-10 w-full max-w-sm bg-white border-0 shadow-2xl" style={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="w-16 h-16 mx-auto linear-gradient-primary rounded-3xl flex items-center justify-center shadow-xl">
                        <Mic2 className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex items-center justify-center gap-1 h-12">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 rounded-full bg-gradient-to-t from-[#3B82F6] to-[#00B9FC]"
                            style={{
                              height: `${20 + Math.random() * 40}px`,
                              animation: `${1 + Math.random()}s pulse ease-in-out infinite`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 text-sm" style={{ color: "#3B82F6" }}>
                          <div className="w-2 h-2 bg-[#00B9FC] rounded-full animate-pulse" />
                          <span>Recording...</span>
                        </div>
                        <p className="text-xl font-semibold" style={{ color: CARD_TEXT }}>
                          "Practice makes perfect!"
                        </p>
                        <p
                          className="text-sm"
                          style={{
                            color: "rgba(15,31,71,0.65)",
                          }}
                        >
                          AI analyzing your speech in real-time
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-4">
                        {[
                          {
                            label: "Clarity",
                            value: "95%",
                            color: "#3B82F6",
                          },
                          {
                            label: "Pace",
                            value: "88%",
                            color: "#3B82F6",
                          },
                          {
                            label: "Tone",
                            value: "92%",
                            color: "#FFD600",
                          },
                        ].map((m, i) => (
                          <div key={i} className="text-center">
                            <div className="text-2xl mb-1 font-semibold" style={{ color: m.color }}>
                              {m.value}
                            </div>
                            <div
                              className="text-xs"
                              style={{
                                color: "rgba(15,31,71,0.65)",
                              }}
                            >
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div
                  className="absolute -top-12 right-0 bg-white border border-[#3B82F6]/20 shadow-lg px-4 py-2 rounded-full"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-sm" style={{ color: CARD_TEXT }}>
                      1000+ Lessons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MelloAssistant
        state={showMelloMessage ? "waving" : "idle"}
        message="Hi! I'm Mello, your AI learning companion! Ready to start your speaking journey? 🌟"
        showMessage={showMelloMessage}
        onMessageDismiss={() => setShowMelloMessage(false)}
        position="bottom-right"
      />
    </div>
  )
}
