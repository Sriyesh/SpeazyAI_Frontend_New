"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Separator } from "./ui/separator"
import { ArrowLeft, User, Settings, Mail, Bell, Volume2, VolumeX, Moon, Sun, Save, Camera } from "lucide-react"
import { motion } from "motion/react"
import { MelloAssistant } from "./MelloAssistant"
import { useNavigate } from "react-router-dom"

interface ProfileProps {
  onBack: () => void
}

export function Profile() {
  const navigate = useNavigate()
  const [name, setName] = useState("John Smith")
  const [email, setEmail] = useState("john.smith@email.com")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [showMelloMessage, setShowMelloMessage] = useState(true)

  const handleSave = () => {
    alert("Settings saved successfully!")
  }

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
              onClick={() => navigate("/dashboard")}
              className="text-[#F2F6FF] hover:text-[#FFD600] hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
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
                    JS
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#F2F6FF] hover:bg-[#3B82F6]/20 border-2 border-[#FFFFFF]"
                    style={{ color: "#1E3A8A" }}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle style={{ color: "#1E3A8A" }}>{name}</CardTitle>
                <p className="text-sm" style={{ color: "rgba(30, 58, 138, 0.7)" }}>
                  {email}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span
                      style={{
                        color: "rgba(30, 58, 138, 0.7)",
                      }}
                    >
                      Lessons Completed
                    </span>
                    <span className="font-medium" style={{ color: "#1E3A8A" }}>
                      24
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      style={{
                        color: "rgba(30, 58, 138, 0.7)",
                      }}
                    >
                      Speaking Accuracy
                    </span>
                    <span className="font-medium" style={{ color: "#FFD600" }}>
                      87%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      style={{
                        color: "rgba(30, 58, 138, 0.7)",
                      }}
                    >
                      Current Streak
                    </span>
                    <span className="font-medium" style={{ color: "#FFD600" }}>
                      7 days
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#F2F6FF] border-[#3B82F6]/20 text-[#1E3A8A] focus:border-[#3B82F6]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: "#1E3A8A" }}>Email Address</Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#F2F6FF] border-[#3B82F6]/20 text-[#1E3A8A] focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
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
                    <Settings className="w-5 h-5 mr-2" style={{ color: "#FFD600" }} />
                    App Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {soundEnabled ? (
                        <Volume2 className="w-5 h-5" style={{ color: "#1E3A8A" }} />
                      ) : (
                        <VolumeX className="w-5 h-5" style={{ color: "#1E3A8A" }} />
                      )}
                      <div>
                        <p className="font-medium" style={{ color: "#1E3A8A" }}>
                          Sound Effects
                        </p>
                        <p
                          className="text-sm"
                          style={{
                            color: "rgba(30, 58, 138, 0.7)",
                          }}
                        >
                          Enable audio feedback and sounds
                        </p>
                      </div>
                    </div>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>

                  <Separator
                    style={{
                      background: "rgba(59, 130, 246, 0.2)",
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] rounded" />
                      <div>
                        <p className="font-medium" style={{ color: "#1E3A8A" }}>
                          Animations
                        </p>
                        <p
                          className="text-sm"
                          style={{
                            color: "rgba(30, 58, 138, 0.7)",
                          }}
                        >
                          Enable visual animations in modules
                        </p>
                      </div>
                    </div>
                    <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                  </div>

                  <Separator
                    style={{
                      background: "rgba(59, 130, 246, 0.2)",
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {darkMode ? (
                        <Moon className="w-5 h-5" style={{ color: "#1E3A8A" }} />
                      ) : (
                        <Sun className="w-5 h-5" style={{ color: "#1E3A8A" }} />
                      )}
                      <div>
                        <p className="font-medium" style={{ color: "#1E3A8A" }}>
                          Theme
                        </p>
                        <p
                          className="text-sm"
                          style={{
                            color: "rgba(30, 58, 138, 0.7)",
                          }}
                        >
                          Dark mode interface
                        </p>
                      </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <Separator
                    style={{
                      background: "rgba(59, 130, 246, 0.2)",
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5" style={{ color: "#1E3A8A" }} />
                      <div>
                        <p className="font-medium" style={{ color: "#1E3A8A" }}>
                          Notifications
                        </p>
                        <p
                          className="text-sm"
                          style={{
                            color: "rgba(30, 58, 138, 0.7)",
                          }}
                        >
                          Daily practice reminders
                        </p>
                      </div>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
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

            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white font-medium"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
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
