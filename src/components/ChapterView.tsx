"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { motion } from "motion/react"
import { ArrowLeft } from 'lucide-react'
import { PDFViewer } from "./PDFViewer"
import { AudioRecorder } from "./audioRecorder"
import { SpeechAssessmentResults } from "./SpeechAssessmentResults"
import { ScrollToTop } from "./ScrollToTop"
import { useNavigate, useParams } from "react-router-dom"
import { useLocation } from "react-router-dom"

export function ChapterView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { chapterId } = useParams()

  const { classData, chapter } = location.state || {}

  const [currentPage, setCurrentPage] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [recordingScore, setRecordingScore] = useState<number | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chapter || !classData) {
      navigate("/academic-samples")
    }
  }, [chapter, classData, navigate])

  // Auto-scroll to results when API response arrives
  useEffect(() => {
    if (!apiResponse) {
      return
    }

    // Use IntersectionObserver to detect when element is rendered
    const scrollToResults = () => {
      const resultElement = resultRef.current || document.getElementById('assessment-results')
      if (!resultElement) {
        return
      }

      // Use scrollIntoView - this works with any scroll container including Radix ScrollArea
      resultElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })

      // Also try to focus the element for accessibility
      resultElement.focus({ preventScroll: true })
    }

    // Wait for element to be in DOM and rendered
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.target === resultRef.current) {
            // Element is visible, scroll to it
            setTimeout(() => {
              scrollToResults()
            }, 100)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    // Try multiple times with delays
    let attempts = 0
    const maxAttempts = 10
    
    const tryScroll = () => {
      const resultElement = resultRef.current || document.getElementById('assessment-results')
      if (resultElement) {
        observer.observe(resultElement)
        // Also try direct scroll after a delay
        setTimeout(() => {
          scrollToResults()
        }, 500)
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(tryScroll, 200)
      }
    }

    // Start after animation delay
    const timeout = setTimeout(() => {
      tryScroll()
    }, 600)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [apiResponse])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 70))
  }

  const handleResetZoom = () => {
    setZoomLevel(100)
  }

  const handleNextPage = () => {
    if (chapter && currentPage < chapter.pages.length - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleBackToClasses = () => {
    navigate("/academic-samples")
  }

  if (!chapter || !classData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563eb] to-[#1E3A8A]">
      <header className="bg-[#1E3A8A]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToClasses}
              className="text-white hover:bg-white/10 hover:text-[#FFD600] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Classes
            </Button>
            <h1 className="text-xl text-white truncate max-w-md">{chapter.title}</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div ref={scrollAreaRef}>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex gap-12 items-start">
            {/* Left Sidebar - Green box area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="w-16 flex-shrink-0 pt-8"
            >
              <div className="hidden bg-white/5 backdrop-blur-sm rounded-lg p-4 h-fit border border-white/10">
                {/* Sidebar content like bookmark icon */}
                <div className="flex flex-col items-center gap-4">
                  {/* Add any sidebar icons here */}
                </div>
              </div>
            </motion.div>

            {/* PDF Viewer - Left side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-0 pr-4"
            >
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
                  <PDFViewer
                    classData={classData}
                    chapter={chapter}
                    currentPage={currentPage}
                    zoomLevel={zoomLevel}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onResetZoom={handleResetZoom}
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                    onPageSelect={setCurrentPage}
                  />
                </div>
                
                {/* Assessment Results - Green box underneath PDFViewer */}
                {apiResponse && (
                  <motion.div
                    id="assessment-results"
                    ref={resultRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/95 rounded-2xl shadow-2xl p-8 border-0"
                  >
                    <SpeechAssessmentResults data={apiResponse} />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Audio Recorder - Right side, moved down to red box position */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-[400px] flex-shrink-0 pt-24"
            >
              <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border-0">
                <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 text-center">Practice Your Speaking</h2>
                <AudioRecorder 
                  expectedText={chapter.content} 
                  lessonColor={classData.gradient} 
                  endpoint="https://apis.languageconfidence.ai/speech-assessment/scripted/uk"
                  onApiResponse={setApiResponse as any}
                />
              </div>
            </motion.div>
          </div>
        </div>
        </ScrollArea>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop 
        scrollContainerRef={scrollAreaRef}
        alwaysShow={!!apiResponse}
        showWhenScrolled={200}
      />
    </div>
  )
}
