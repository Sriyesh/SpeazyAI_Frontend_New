"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ArrowLeft, User, Mail, Camera } from "lucide-react"
import { motion } from "motion/react"
import { MelloAssistant } from "./MelloAssistant"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { fetchStreakData } from "../utils/streakApi"
import { fetchUsageTime, formatUsageTime } from "../utils/usageTimeApi"
import { fetchImprovementData } from "../utils/improvementApi"

interface ProfileProps {
  onBack: () => void
}

export function Profile() {
  const navigate = useNavigate()
  const { authData, token } = useAuth()
  
  // Get user data from auth context, fallback to empty strings if not available
  const userFullName = authData?.user ? `${authData.user.first_name} ${authData.user.last_name}`.trim() : ""
  const userEmail = authData?.user?.email || ""
  const userInitials = authData?.user 
    ? `${authData.user.first_name?.[0] || ""}${authData.user.last_name?.[0] || ""}`.toUpperCase() || "U"
    : "U"
  
  const [name, setName] = useState(userFullName)
  const [email, setEmail] = useState(userEmail)
  const [showMelloMessage, setShowMelloMessage] = useState(true)
  const [streakDays, setStreakDays] = useState<number>(0)
  const [usageTimeSeconds, setUsageTimeSeconds] = useState<number | null>(null)
  const [improvementDisplay, setImprovementDisplay] = useState<string>("0")
  const [loadingStreak, setLoadingStreak] = useState(true)
  const [loadingUsageTime, setLoadingUsageTime] = useState(true)
  const [loadingImprovement, setLoadingImprovement] = useState(true)
  
  // Update state when authData changes
  useEffect(() => {
    if (authData?.user) {
      const fullName = `${authData.user.first_name} ${authData.user.last_name}`.trim()
      if (fullName) setName(fullName)
      if (authData.user.email) setEmail(authData.user.email)
    }
  }, [authData])

  useEffect(() => {
    const loadStreakData = async () => {
      if (!token) {
        setLoadingStreak(false)
        return
      }
      try {
        setLoadingStreak(true)
        const streakData = await fetchStreakData(token)
        if (streakData) {
          setStreakDays(streakData.current_streak ?? streakData.streak_days ?? 0)
        }
      } catch {
        setLoadingStreak(false)
      } finally {
        setLoadingStreak(false)
      }
    }
    loadStreakData()
  }, [token])

  useEffect(() => {
    const loadUsageTime = async () => {
      if (!token) {
        setLoadingUsageTime(false)
        return
      }
      try {
        setLoadingUsageTime(true)
        const totalSeconds = await fetchUsageTime(token)
        if (totalSeconds !== null) setUsageTimeSeconds(totalSeconds)
      } catch {
        setLoadingUsageTime(false)
      } finally {
        setLoadingUsageTime(false)
      }
    }
    loadUsageTime()
  }, [token])

  useEffect(() => {
    const loadImprovementData = async () => {
      if (!token) {
        setLoadingImprovement(false)
        return
      }
      try {
        setLoadingImprovement(true)
        const display = await fetchImprovementData(token)
        setImprovementDisplay(display)
      } catch {
        setLoadingImprovement(false)
      } finally {
        setLoadingImprovement(false)
      }
    }
    loadImprovementData()
  }, [token])

  return (
    <div className="min-h-screen" style={{ background: "#1E3A8A" }}>
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

      <header
        className="backdrop-blur-lg border-b sticky top-0 z-50"
        style={{
          background: "rgba(30, 58, 138, 0.95)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/skills-home")}
              className="text-[#F2F6FF] hover:text-[#FFD600] hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Skills Home
            </Button>
            <h1 className="text-lg font-semibold" style={{ color: "#F2F6FF" }}>
              Profile & Settings
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card
              className="lg:col-span-1 bg-[#FFFFFF] border-0"
              style={{
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
              }}
            >
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] rounded-full flex items-center justify-center text-2xl font-bold text-white kid-pulse">
                    {userInitials}
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#F2F6FF] hover:bg-[#3B82F6]/20 border-2 border-[#FFFFFF]"
                    style={{ color: "#1E3A8A" }}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle style={{ color: "#1E3A8A" }}>{userFullName || name}</CardTitle>
                <p className="text-sm" style={{ color: "rgba(30, 58, 138, 0.7)" }}>
                  {userEmail || email}
                </p>
                {authData?.user?.role && (
                  <p className="text-xs mt-1 px-2 py-1 inline-block rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                    {authData.user.role.charAt(0).toUpperCase() + authData.user.role.slice(1)}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span style={{ color: "rgba(30, 58, 138, 0.7)" }}>Speaking Time</span>
                    <span className="font-medium" style={{ color: "#1E3A8A" }}>2h 45m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "rgba(30, 58, 138, 0.7)" }}>App Usage Time</span>
                    <span className="font-medium" style={{ color: "#1E3A8A" }}>
                      {loadingUsageTime ? "..." : usageTimeSeconds !== null ? formatUsageTime(usageTimeSeconds) : "0m"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "rgba(30, 58, 138, 0.7)" }}>Streak Days</span>
                    <span className="font-medium" style={{ color: "#FFD600" }}>
                      {loadingStreak ? "..." : streakDays}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "rgba(30, 58, 138, 0.7)" }}>Improvement</span>
                    <span className="font-medium" style={{ color: "#1E3A8A" }}>
                      {loadingImprovement ? "..." : improvementDisplay}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card
                className="bg-[#FFFFFF] border-0"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ color: "#1E3A8A" }}>
                    <User className="w-5 h-5 mr-2" style={{ color: "#FFD600" }} />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ color: "#1E3A8A" }}>Full Name</Label>
                      <Input
                        value={userFullName || name}
                        readOnly
                        disabled
                        className="bg-[#F2F3F4] border-[#3B82F6]/20 text-[#1E3A8A]/70 cursor-not-allowed"
                        style={{ color: "rgba(30, 58, 138, 0.5)" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#1E3A8A" }}>Email Address</Label>
                      <Input
                        value={userEmail || email}
                        readOnly
                        disabled
                        className="bg-[#F2F3F4] border-[#3B82F6]/20 text-[#1E3A8A]/70 cursor-not-allowed"
                        style={{ color: "rgba(30, 58, 138, 0.5)" }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card
                className="bg-[#FFFFFF] border-0"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center" style={{ color: "#1E3A8A" }}>
                    <Mail className="w-5 h-5 mr-2" style={{ color: "#FFD600" }} />
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p style={{ color: "rgba(30, 58, 138, 0.7)" }}>
                    Need help or have feedback? We'd love to hear from you.
                  </p>
                  <div className="flex space-x-3">
                    <Button className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white">
                      Send Feedback
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#3B82F6]/20 text-[#1E3A8A] hover:bg-[#3B82F6]/10 bg-transparent"
                    >
                      Get Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
            message="Update your profile and settings to make it your own! 😄✨"
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
    </div>
  )
}
