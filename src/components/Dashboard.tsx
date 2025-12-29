"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { ThemeToggle } from "./ThemeToggle"
import { MelloAssistant } from "./MelloAssistant"
import { BookOpen, GraduationCap, PenTool, Mic2, MessageCircle, Star, TrendingUp, Award, LogOut, Sparkles, Library, Users, LucideBrackets as FileBracket, Zap, Video } from 'lucide-react'
import { useAuth } from "../contexts/AuthContext"

/**
 * Module interface for type safety
 * Each module can optionally specify which roles can see it
 */
interface DashboardModule {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  progress: number
  lessons: number
  isNew?: boolean
  roles?: string[] // Array of role names that can see this module. Empty or undefined = visible to all
}

/**
 * Dashboard Modules Configuration
 * 
 * ROLE-BASED VISIBILITY:
 * Each module has a 'roles' property that defines which user roles can see this tile.
 * 
 * To customize module visibility:
 * 1. Add or modify the 'roles' array in any module object
 * 2. Supported roles: "student", "teacher", "administrator", "principal", etc.
 * 3. Use an empty array [] or omit 'roles' to make it visible to all roles
 * 4. To add a new role, simply use the role name from the API response (data.user.role)
 * 5. Note: "principal" and "administrator" roles automatically see ALL tiles (full access)
 * 
 * Examples:
 * - roles: ["student", "teacher"] - visible to both students and teachers
 * - roles: ["teacher"] - only visible to teachers
 * - roles: ["student"] - only visible to students
 * - roles: [] or no roles property - visible to everyone (except principal/admin see everything anyway)
 */
const modules: DashboardModule[] = [
    {
      id: "my-lessons",
      title: "My Lessons",
      description: "Continue your speaking journey",
      icon: BookOpen,
      color: "from-[#3B82F6] to-[#00B9FC]",
      progress: 75,
      lessons: 12,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "speaking-practice",
      title: "Speaking Practice",
      description: "Practice with various speech scenarios",
      icon: GraduationCap,
      color: "from-[#1E3A8A] to-[#3B82F6]",
      progress: 60,
      lessons: 8,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "writing-practice",
      title: "Writing Practice",
      description: "Improve your written communication",
      icon: PenTool,
      color: "from-[#00B9FC] to-[#246BCF]",
      progress: 40,
      lessons: 5,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "listening-practice",
      title: "Listening Practice",
      description: "Enhance your listening comprehension",
      icon: Mic2,
      color: "from-[#246BCF] to-[#3B82F6]",
      progress: 30,
      lessons: 15,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "ai-tutor",
      title: "AI Tutor",
      description: "Get personalized guidance from AI",
      icon: MessageCircle,
      color: "from-[#3B82F6] to-[#00B9FC]",
      progress: 0,
      lessons: 0,
      isNew: true,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "content-library",
      title: "Content Library",
      description: "Access curated learning materials",
      icon: Library,
      color: "from-[#246BCF] to-[#3B82F6]",
      progress: 0,
      lessons: 0,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "custom-content",
      title: "Custom Content",
      description: "Create and manage custom materials",
      icon: FileBracket,
      color: "from-[#3B82F6] to-[#00B9FC]",
      progress: 0,
      lessons: 0,
      roles: ["teacher"], // Only visible to teachers
    },
    {
      id: "learn-own-way",
      title: "Learn Your Own Way",
      description: "Self-paced learning at your pace",
      icon: Sparkles,
      color: "from-[#00B9FC] to-[#246BCF]",
      progress: 0,
      lessons: 0,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "ielts",
      title: "IELTS",
      description: "Prepare for IELTS examination",
      icon: Zap,
      color: "from-[#246BCF] to-[#3B82F6]",
      progress: 0,
      lessons: 0,
      isNew: true,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "connect-teacher",
      title: "Connect to Teacher",
      description: "Get live help from instructors",
      icon: Users,
      color: "from-[#3B82F6] to-[#246BCF]",
      progress: 0,
      lessons: 0,
      isNew: true,
      roles: ["student"], // Only visible to students
    },
    {
      id: "Phoneme Guide",
      title: "Phoneme Guide",
      description: "Get live help from instructors",
      icon: Users,
      color: "from-[#3B82F6] to-[#246BCF]",
      progress: 0,
      lessons: 0,
      isNew: true,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "Sample Video Module",
      title: "samplle Video Module",
      description: "Get live help from instructors",
      icon: Users,
      color: "from-[#3B82F6] to-[#246BCF]",
      progress: 0,
      lessons: 0,
      isNew: true,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
    {
      id: "video-content",
      title: "Video Content",
      description: "Watch educational videos and tutorials",
      icon: Video,
      color: "from-[#246BCF] to-[#3B82F6]",
      progress: 0,
      lessons: 0,
      roles: ["student", "teacher"], // Visible to both students and teachers
    },
  ]

export function Dashboard() {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMelloMessage, setShowMelloMessage] = useState(true)
  const { userRole, authData, logout } = useAuth()

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const TEXT_LIGHT = "#F2F6FF"
  const TEXT_MUTED = "rgba(242,246,255,0.78)"

  // Dark blue background
  const BLUE_BG: React.CSSProperties = {
    backgroundColor: "#123A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  /**
   * Filter modules based on user role
   * 
   * This function filters the modules array to show only tiles that the current user's role can access.
   * 
   * How it works:
   * - Principal and Administrator roles see ALL tiles (full access)
   * - If a module has a 'roles' property, it checks if the current userRole is in that array
   * - If a module has no 'roles' property or an empty array, it's visible to everyone
   * - The filtering is case-insensitive and handles role variations
   * 
   * To customize:
   * - Modify the 'roles' array in each module object above
   * - Add new roles as needed (e.g., "administrator", "parent", "guest")
   */
  const filteredModules = useMemo(() => {
    if (!userRole) {
      // If no role is set, show all modules (fallback)
      return modules
    }

    const normalizedUserRole = userRole.toLowerCase()
    
    // Principal and Administrator roles have full access - show all modules
    if (normalizedUserRole === "principal" || normalizedUserRole === "administrator") {
      return modules
    }

    return modules.filter(module => {
      // If module has no roles property or empty roles array, show to everyone
      if (!module.roles || module.roles.length === 0) {
        return true
      }
      
      // Check if current user's role matches any of the module's allowed roles
      // Convert to lowercase for case-insensitive comparison
      return module.roles.some(role => role.toLowerCase() === normalizedUserRole)
    })
  }, [userRole])

  const stats = [
    {
      label: "Speaking Time",
      value: "2h 45m",
      icon: Mic2,
      color: "#3B82F6",
    },
    {
      label: "Lessons Completed",
      value: "25",
      icon: Award,
      color: "#00B9FC",
    },
    {
      label: "Streak Days",
      value: "7",
      icon: Star,
      color: "#FFD600",
    },
    {
      label: "Improvement",
      value: "+23%",
      icon: TrendingUp,
      color: "#246BCF",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10" style={BLUE_BG} />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "#3B82F6" }}
              >
                <Mic2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg text-[#F2F6FF]">Speech Skills AI</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-lg border border-white/20">
                <Star className="w-4 h-4 text-[#FFD600] fill-[#FFD600]" />
                <span className="text-sm" style={{ color: TEXT_LIGHT }}>
                  7 day streak
                </span>
              </div>

              <ThemeToggle />

              <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="hover:bg-white/10">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white text-xs">
                    {authData?.user?.first_name?.[0] || "U"}
                    {authData?.user?.last_name?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout()
                  navigate("/")
                }}
                className="hover:bg-white/10"
                style={{ color: TEXT_LIGHT }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl mb-2" style={{ color: TEXT_LIGHT }}>
            Welcome back, {authData?.user?.first_name || "User"}! 👋
          </h2>
          <p style={{ color: TEXT_MUTED }}>Ready to practice your speaking skills today?</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <CardContent className="p-4 text-center">
                <div
                  className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                  }}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xl text-[#0F1F47] mb-1">{stat.value}</p>
                <p className="text-sm text-[#0F1F47]/70">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredModules.map((module) => (
            <Card
              key={module.id}
              className="group bg-white border-0 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
              onClick={() => {
                const navigationMap: Record<string, string> = {
                  "my-lessons": "/my-lessons",
                  "speaking-practice": "/academic-samples",
                  "writing-practice": "/writing-practice",
                  "listening-practice": "/listening-practice",
                  "ai-tutor": "/chat",
                  "content-library": "/content-library",
                  "custom-content": "/custom-content",
                  "learn-own-way": "/quick-practice",
                  "ielts": "/ielts",
                  "connect-teacher": "/connect-teacher",
                  "video-content": "/video-content",
                }
                navigate(navigationMap[module.id] || `/${module.id}`)
              }}
            >
              {module.isNew && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white px-2 py-1 rounded-full text-xs shadow-lg">
                    NEW
                  </div>
                </div>
              )}

              <CardHeader className="pb-2">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}
                >
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-sm text-[#0F1F47]">{module.title}</CardTitle>
                <p className="text-xs text-[#0F1F47]/70 line-clamp-2">{module.description}</p>
              </CardHeader>

              <CardContent className="pt-0 pb-3">
                {module.progress > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#0F1F47]/60">Progress</span>
                      <span className="text-[#0F1F47]">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-[#F2F3F4] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 bg-gradient-to-r ${module.color} transition-all duration-300 shadow-md`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#0F1F47]/50">{module.lessons} lessons</p>
                  </div>
                ) : (
                  <div className="text-center py-1">
                    <p className="text-xs text-[#0F1F47]/70 mb-2">Get started</p>
                    <Button
                      size="sm"
                      className="bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white rounded-lg px-3 py-1 text-xs shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      Start
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <MelloAssistant
        state="celebrating"
        message="Great to see you back, John! You're on a 7-day streak! Keep it up! 🎉"
        showMessage={showMelloMessage}
        onMessageDismiss={() => setShowMelloMessage(false)}
        position="bottom-right"
      />
    </div>
  )
}
