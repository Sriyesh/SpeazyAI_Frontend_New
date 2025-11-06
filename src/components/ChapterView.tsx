"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { motion } from "motion/react"
import { ArrowLeft } from "lucide-react"
import { PDFViewer } from "./PDFViewer"
import { AudioRecorder } from "./audioRecorder"
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
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chapter || !classData) {
      navigate("/academic-samples")
    }
  }, [chapter, classData, navigate])

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

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* PDF Viewer */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
          </motion.div>

          {/* Audio Recorder Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 mb-8"
          >
            <div className="bg-white/95 rounded-2xl shadow-2xl p-8 border-0">
              <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6">Practice Your Speaking</h2>
              <AudioRecorder expectedText={chapter.content} lessonColor={classData.gradient} endpoint="https://apis.languageconfidence.ai/speech-assessment/scripted/uk"/>
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  )
}
