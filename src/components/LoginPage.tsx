"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader } from "./ui/card"
import { ThemeToggle } from "./ThemeToggle"
import { MelloAssistant } from "./MelloAssistant"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showMelloMessage, setShowMelloMessage] = useState(true)

  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/dashboard")
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#1E3A8A" }}
    >
      <style>
        {`
          .typewriter {
            overflow: hidden;
            white-space: nowrap;
            animation: typing 2s steps(40, end);
          }
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
          .kid-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}
      </style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              background: "#FFD600",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-[#F2F6FF] hover:text-[#FFD600] hover:bg-white/10 transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card
            className="shadow-2xl border-0 overflow-hidden"
            style={{
              borderRadius: "24px",
              background: "#FFFFFF",
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
            }}
          >
            <CardHeader className="text-center pb-6 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3B82F6]/20 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg kid-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl text-white mb-2">Welcome Back</h1>
                <p className="text-sm text-white/90">Sign in to continue your learning journey</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8 pt-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: "#1E3A8A" }}>
                    Email or Username
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-[#F2F6FF] border-0 text-[#1E3A8A] placeholder:text-[#1E3A8A]/40 focus:ring-2 focus:ring-[#3B82F6] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: "#1E3A8A" }}>
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-[#F2F6FF] border-0 text-[#1E3A8A] placeholder:text-[#1E3A8A]/40 focus:ring-2 focus:ring-[#3B82F6] rounded-xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1E3A8A]/60 hover:text-[#3B82F6] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-[#3B82F6] hover:text-[#1E3A8A] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Sign In
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className="w-full border-t"
                    style={{
                      borderColor: "rgba(59, 130, 246, 0.2)",
                    }}
                  />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-[#1E3A8A]/60" style={{ background: "#FFFFFF" }}>
                    New to Speech Skills AI?
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate("/signup")}
                className="w-full h-12 border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-xl transition-all duration-200"
              >
                Create Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <p className="text-center text-[#F2F6FF]/60 text-sm mt-6">Secure Login • Professional Platform</p>
      </div>

      <motion.div
        animate={showMelloMessage ? { y: [0, -15, 0], scale: [1, 1.1, 1] } : { x: [0, 10, -10, 0] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          times: showMelloMessage ? [0, 0.5, 1] : [0, 0.33, 0.66, 1],
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 100,
        }}
      >
        <MelloAssistant
          state={showMelloMessage ? "celebrating" : "idle"}
          message="Welcome back! Ready to continue improving your speaking skills? 🎯😄"
          showMessage={showMelloMessage}
          onMessageDismiss={() => setShowMelloMessage(false)}
          position="bottom-right"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
            padding: "12px",
            maxWidth: "300px",
          }}
          messageClassName="typewriter"
        />
      </motion.div>
    </div>
  )
}
