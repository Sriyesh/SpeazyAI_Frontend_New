"use client"

import React, { useState, useEffect } from "react"
import type { CSSProperties } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { MelloAssistant } from "./MelloAssistant"
import { PageHeader } from "./PageHeader"
import {
  BookOpen,
  PenTool,
  Mic2,
  MessageCircle,
  Star,
  TrendingUp,
  Headphones,
  Award,
} from "lucide-react"

export function NewDashboard() {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMelloMessage, setShowMelloMessage] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  // Main learning modules (6 tiles in order: Speaking, Writing, Reading, Listening, IELTS, AI Tutor)
  const modules = [
    {
      id: "speaking",
      title: "Speaking",
      description: "Practice speaking with confidence",
      icon: Mic2,
      color: "from-[#3B82F6] to-[#00B9FC]",
      progress: 60,
    },
    {
      id: "writing",
      title: "Writing",
      description: "Improve your writing skills",
      icon: PenTool,
      color: "from-[#00B9FC] to-[#246BCF]",
      progress: 45,
    },
    {
      id: "reading",
      title: "Reading",
      description: "Enhance reading comprehension",
      icon: BookOpen,
      color: "from-[#246BCF] to-[#1E3A8A]",
      progress: 75,
    },
    {
      id: "listening-practice",
      title: "Listening",
      description: "Develop listening skills",
      icon: Headphones,
      color: "from-[#1E3A8A] to-[#3B82F6]",
      progress: 30,
    },
    {
      id: "ielts",
      title: "IELTS Preparation",
      description: "Complete IELTS test preparation",
      icon: Award,
      color: "from-[#00B9FC] to-[#246BCF]",
      progress: 0,
    },
    {
      id: "chat",
      title: "AI Tutor",
      description: "Get personalized coaching",
      icon: MessageCircle,
      color: "from-[#3B82F6] to-[#FFD600]",
      progress: 0,
    },
  ]


  const handleModuleClick = (moduleId: string) => {
    // Handle navigation based on module ID
    const navigationMap: Record<string, string> = {
      "reading": "/reading-modules",
      "speaking": "/speaking-modules",
      "writing": "/writing-modules",
      "listening-practice": "/listening-modules",
      "ielts": "/ielts",
      "chat": "/chat",
      "connect-teacher": "/connect-teacher",
    }
    
    const route = navigationMap[moduleId]
    if (route) {
      navigate(route)
    }
  }


  // Stats cards from old dashboard
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

  const renderMainDashboard = () => (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, John! 👋</h2>
        <p className="text-base text-white/80">Ready to practice your speaking skills today?</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-white border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-3xl"
          >
            <CardContent className="p-4 text-center">
              <div
                className="w-10 h-10 mx-auto mb-2 rounded-2xl flex items-center justify-center shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                }}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xl font-bold text-[#1E3A8A] mb-1">{stat.value}</p>
              <p className="text-sm text-[#1E3A8A]/70">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Modules - 6 Tiles */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-6">Your Learning Modules</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-0 lg:pr-4">
        {modules.map((module) => (
          <Card
            key={module.id}
            className="group bg-white border-0 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden rounded-3xl"
            onClick={() => handleModuleClick(module.id)}
          >
            <CardHeader className="pb-4 pt-6">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
              >
                <module.icon className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <CardTitle className="text-[#1E3A8A] text-xl mb-2">{module.title}</CardTitle>
              <p className="text-sm text-[#1E3A8A]/70">{module.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  )


  const BLUE_BG: CSSProperties = {
    backgroundColor: "#1E3A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  return (
    <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
      {/* Background */}
      <div className="absolute inset-0 -z-10" style={BLUE_BG} />
      
      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
          {renderMainDashboard()}
        </div>
      </div>

      <MelloAssistant
        state="waving"
        message="Hi! Welcome back, John! You're on a 7-day streak! Keep it up! 👋🎉"
        showMessage={showMelloMessage}
        onMessageDismiss={() => setShowMelloMessage(false)}
        position="bottom-right"
      />
    </div>
  )
}
