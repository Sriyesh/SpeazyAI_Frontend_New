"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { ArrowLeft, BookText } from "lucide-react"
import type { CSSProperties } from "react"

const BLUE_BG: CSSProperties = {
  backgroundColor: "#1E3A8A",
  backgroundAttachment: "fixed",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
}

export function PhonemeGuide() {
  const navigate = useNavigate()
  const location = useLocation()
  const backRoute = (location.state as any)?.backRoute || "/reading-modules"

  return (
    <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
      <div className="absolute inset-0 -z-10" style={BLUE_BG} />

      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/10 border-b border-white/10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(backRoute)}
              className="text-white hover:bg-white/10 rounded-2xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-white">Phoneme Guide</h1>
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <BookText className="w-24 h-24 text-white/50 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Phoneme Guide</h2>
            <p className="text-base text-white/80">Learn pronunciation patterns and phonemes to improve your reading skills.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

