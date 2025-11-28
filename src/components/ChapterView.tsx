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
      <style>{`
        @media (max-width: 768px) {
          .chapter-content-wrapper {
            flex-direction: column !important;
            gap: 1rem !important;
            padding-bottom: 120px !important;
          }
          .chapter-sidebar {
            display: none !important;
          }
          .pdf-viewer-wrapper {
            padding-right: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            overflow: visible !important; /* Allow content to be seen if slightly overflows, or handle scrolling */
          }
          
          /* Hide desktop recorder */
          .desktop-audio-recorder {
            display: none !important;
          }

          /* Mobile Recorder Styles */
          .mobile-audio-recorder-container {
            position: fixed !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: auto !important;
            z-index: 9999 !important;
            pointer-events: auto !important;
            display: flex !important;
            justify-content: center !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          /* Expanded Sheet Mode - Triggered when active content (cards) is present */
          .mobile-audio-recorder-container:has(.rounded-xl),
          .mobile-audio-recorder-container:has(.rounded-2xl) {
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important; /* Force right edge */
            transform: none !important;
            width: 100% !important;
            max-width: 100vw !important; /* Hard limit to viewport width */
            background: white !important;
            border-radius: 24px 24px 0 0 !important;
            padding: 24px 24px 34px !important;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.15) !important;
            flex-direction: column !important;
            align-items: stretch !important;
            white-space: normal !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important; /* Prevent horizontal scroll */
            margin: 0 !important; /* Remove any margins */
          }

          /* Hide controls when loading assessment */
          .mobile-audio-recorder-container:has(.animate-spin) .rounded-xl,
          .mobile-audio-recorder-container:has(.animate-spin) button,
          .mobile-audio-recorder-container:has(.animate-spin) audio {
             display: none !important;
          }
          
          /* Ensure the loading component is visible and centered */
          .mobile-audio-recorder-container:has(.animate-spin) > div {
             width: 100% !important;
             display: flex !important;
             justify-content: center !important;
          }

          /* Dark Mode Sheet (Recording State) - Targeted via the Red Stop Button or Dark Background */
          .mobile-audio-recorder-container:has(button[style*="#DC2626"]),
          .mobile-audio-recorder-container:has(div[style*="#1F2937"]) {
            background: #1F2937 !important;
            border-top: 1px solid #374151 !important;
            color: white !important;
          }

          /* Reset internal card styles when in sheet mode to avoid double-boxing */
          .mobile-audio-recorder-container:has(.rounded-xl) .rounded-xl,
          .mobile-audio-recorder-container:has(.rounded-2xl) .rounded-2xl {
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }

          /* Ensure buttons are full width and spaced in sheet mode */
          .mobile-audio-recorder-container:has(.rounded-xl) button,
          .mobile-audio-recorder-container:has(.rounded-2xl) button {
             width: 100% !important;
             margin-left: 0 !important;
             margin-right: 0 !important;
          }
          
          /* Ensure audio player is visible */
          .mobile-audio-recorder-container audio {
             display: block !important;
             width: 100% !important;
             height: 54px !important; /* Increased height slightly */
             margin-bottom: 12px !important;
             margin-top: 8px !important;
             opacity: 1 !important;
             visibility: visible !important;
             z-index: 10000 !important;
             background-color: #f1f5f9 !important; /* Light gray background to visualize footprint */
             border-radius: 8px !important;
          }

          /* Specific margin for the 'Record Again' button which sits above the player */
          .mobile-audio-recorder-container:has(.rounded-xl) > div > button {
             margin-bottom: 8px !important;
          }

          /* When expanded (recording), center it or keep it floating? 
             User asked for "floaty". Let's keep it floating but ensure it fits. 
          */
          
          .mobile-audio-recorder-container .audio-recorder-card {
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            border: none !important;
          }
          
          .mobile-audio-recorder-container .audio-recorder-title {
            display: none !important;
          }

          /* Adjust the recorder internals for mobile FAB look */
          .mobile-audio-recorder-container .w-full {
            width: auto !important;
          }
          
          /* When recording, we might want a background */
          .mobile-audio-recorder-container:has(button[data-recording="true"]) {
             /* Can't easily target internal state from here without data attributes. 
                But the recorder component changes UI when recording. 
             */
          }
        }
      `}</style>
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
          <div className="flex gap-12 items-start chapter-content-wrapper">
            {/* Left Sidebar - Green box area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="w-16 flex-shrink-0 pt-8 chapter-sidebar"
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
              className="flex-1 min-w-0 pr-4 pdf-viewer-wrapper"
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

            {/* Audio Recorder - Desktop (hidden on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-[400px] flex-shrink-0 pt-24 desktop-audio-recorder"
            >
              <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border-0 audio-recorder-card">
                <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 text-center audio-recorder-title">Practice Your Speaking</h2>
                <AudioRecorder 
                  expectedText={chapter.content} 
                  lessonColor={classData.gradient} 
                  endpoint="https://apis.languageconfidence.ai/speech-assessment/unscripted/uk"
                  onApiResponse={setApiResponse as any}
                />
              </div>
            </motion.div>
          </div>
        </div>
        </ScrollArea>
      </div>

      {/* Mobile Floating Audio Recorder (Outside ScrollArea) */}
      <div className="hidden md:hidden mobile-audio-recorder-container" style={{ display: 'none' }}> 
        {/* Note: The inline style display:none will be overridden by the media query !important if we used that, 
            but better to rely on class logic. 
            Actually, using a class that defaults to hidden on desktop.
        */}
        <div className="mobile-block audio-recorder-card">
           <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 text-center audio-recorder-title">Practice Your Speaking</h2>
            <AudioRecorder 
              expectedText={chapter.content} 
              lessonColor={classData.gradient} 
              endpoint="https://apis.languageconfidence.ai/speech-assessment/unscripted/uk"
              onApiResponse={setApiResponse as any}
            />
        </div>
      </div>
      <style>{`
        @media (min-width: 769px) {
          .mobile-audio-recorder-container { display: none !important; }
        }
        @media (max-width: 768px) {
          .mobile-audio-recorder-container { display: block !important; }
        }
      `}</style>

      {/* Scroll to Top Button */}
      <ScrollToTop 
        scrollContainerRef={scrollAreaRef}
        alwaysShow={!!apiResponse}
        showWhenScrolled={200}
      />
    </div>
  )
}
