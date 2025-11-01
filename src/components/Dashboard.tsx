"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { ThemeToggle } from "./ThemeToggle"
import { MelloAssistant } from "./MelloAssistant"
import {
  BookOpen,
  GraduationCap,
  PenTool,
  Mic2,
  MessageCircle,
  Star,
  TrendingUp,
  Award,
  LogOut,
  Sparkles,
  Library,
} from "lucide-react"

// export function Dashboard({ onLogout }: DashboardProps) {
export function Dashboard() {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMelloMessage, setShowMelloMessage] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const TEXT_LIGHT = "#F2F6FF";
  const TEXT_MUTED = "rgba(242,246,255,0.78)";

  // Dark blue background
  const BLUE_BG: React.CSSProperties = {
    backgroundColor: "#123A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  const modules = [
    {
      id: "my-lessons",
      title: "My Lessons",
      description: "Continue your speaking journey",
      icon: BookOpen,
      color: "from-[#3B82F6] to-[#00B9FC]",
      progress: 75,
      lessons: 12,
    },
    {
      id: "academic-samples",
      title: "Speaking Practice",
      description: "Practice with school presentations",
      icon: GraduationCap,
      color: "from-[#1E3A8A] to-[#3B82F6]",
      progress: 60,
      lessons: 8,
    },
    {
      id: "custom-content",
      title: "Custom Content",
      description: "Create your own speaking exercises",
      icon: PenTool,
      color: "from-[#00B9FC] to-[#246BCF]",
      progress: 40,
      lessons: 5,
    },
    {
      id: "famous-speeches",
      title: "Famous Speeches",
      description: "Learn from the greatest speakers",
      icon: Mic2,
      color: "from-[#246BCF] to-[#3B82F6]",
      progress: 30,
      lessons: 15,
    },
    {
      id: "chat",
      title: "AI Tutor Chat",
      description: "Get personalized speaking tips",
      icon: MessageCircle,
      color: "from-[#3B82F6] to-[#00B9FC]",
      progress: 0,
      lessons: 0,
      isNew: true,
    },
    {
      id: "content-library",
      title: "Content Library",
      description: "Manage your uploaded materials",
      icon: Library,
      color: "from-[#246BCF] to-[#00B9FC]",
      progress: 0,
      lessons: 0,
      isNew: true,
    },
  ];

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
  ];

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
                    JS
                  </AvatarFallback>
                </Avatar>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
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
            Welcome back, John! 👋
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card
              key={module.id}
              className="group bg-white border-0 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden"
              onClick={() => navigate(`/${module.id}`)}
            >
              {module.isNew && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white px-2 py-1 rounded-full text-xs shadow-lg">
                    NEW
                  </div>
                </div>
              )}

              <CardHeader className="pb-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                >
                  <module.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-[#0F1F47]">{module.title}</CardTitle>
                <p className="text-sm text-[#0F1F47]/70">{module.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                {module.progress > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#0F1F47]/60">Progress</span>
                      <span className="text-[#0F1F47]">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-[#F2F3F4] rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 bg-gradient-to-r ${module.color} transition-all duration-300 shadow-md`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#0F1F47]/50">{module.lessons} lessons available</p>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-[#0F1F47]/70 mb-3">Get started with your first lesson</p>
                    <Button
                      size="sm"
                      className="bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white rounded-xl px-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      Start Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Practice CTA */}
        <Card className="mt-8 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-[#FFD600]" />
                  <h3 className="text-2xl text-white">Quick Practice Session</h3>
                </div>
                <p className="text-white/90">Take a 5-minute speaking challenge and boost your confidence</p>
              </div>
              <Button
                size="lg"
                className="bg-white text-[#3B82F6] hover:bg-white/90 rounded-2xl px-6 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
              >
                Start Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <MelloAssistant
        state="celebrating"
        message="Great to see you back, John! You're on a 7-day streak! Keep it up! 🎉"
        showMessage={showMelloMessage}
        onMessageDismiss={() => setShowMelloMessage(false)}
        position="bottom-right"
      />
    </div>
  );
}