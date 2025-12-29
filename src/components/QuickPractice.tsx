"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { ArrowLeft } from "lucide-react"
import { AudioRecorder } from "./audioRecorder"
import { ScrollArea } from "./ui/scroll-area"
import { motion } from "motion/react"

export function QuickPractice() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563eb] to-[#1E3A8A]">
      {/* Header to match ChapterView */}
      <header className="bg-[#1E3A8A]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // QuickPractice can be accessed from speaking or writing modules
                // Default to speaking-modules
                const backRoute = "/speaking-modules"
                navigate(backRoute)
              }}
              className="text-white hover:bg-white/10 hover:text-[#FFD600] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl text-white truncate max-w-md">Quick Practice Session</h1>
            <div className="flex items-center justify-end w-32">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border-0">
              <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">5-Minute Speaking Challenge</h2>
              <p className="text-slate-600 mb-6">Click below to start recording your practice.</p>
              <div className="flex items-center justify-center">
                <AudioRecorder expectedText="Practice makes perfect" lessonColor="from-blue-500 to-cyan-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  )
}
