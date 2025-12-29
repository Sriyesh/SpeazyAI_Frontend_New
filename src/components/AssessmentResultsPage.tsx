"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { ArrowLeft, Mic, BookOpen, Award, Brain, Home, Menu, Maximize2, X, Volume2 } from "lucide-react"
import type { CSSProperties } from "react"
import { useState } from "react"

type NavigationItem = "pronunciation" | "practice-words" | "grammar" | "disfluency" | "fluency"

export function AssessmentResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get data from navigation state
  const { apiResponse, chapter, classData, backRoute } = (location.state as any) || {}
  const [activeSection, setActiveSection] = useState<NavigationItem>("pronunciation")
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute, { state: { classData, chapter } })
    } else {
      navigate("/academic-samples")
    }
  }

  // If no data, redirect back
  if (!apiResponse || apiResponse.error) {
    if (backRoute) {
      navigate(backRoute, { state: { classData, chapter } })
    } else {
      navigate("/academic-samples")
    }
    return null
  }

  const pronunciation = apiResponse?.pronunciation || {}
  const fluency = apiResponse?.fluency || {}
  const overall = apiResponse?.overall || {}
  const vocabulary = apiResponse?.vocabulary || {}
  const grammar = apiResponse?.grammar || {}

  const overallScore = Math.round(overall.overall_score || 0)
  const accuracyScore = Math.round(pronunciation.overall_score || 0)
  const fluencyScore = Math.round(fluency.overall_score || 0)
  const pronunciationScore = Math.round(pronunciation.overall_score || 0)

  // Get words with their scores for color coding
  const words = (pronunciation.words || []).map((w: any) => ({
    text: w.word_text,
    score: w.word_score || 0,
    phonemes: w.phonemes || [],
  }))

  // Get unique phonemes with scores (first 2 for display)
  const phonemeMap = new Map<string, any>()
  words.forEach((word: any) => {
    if (word.phonemes && Array.isArray(word.phonemes)) {
      word.phonemes.forEach((phoneme: any) => {
        const phonemeKey = phoneme.phoneme || phoneme.phoneme_text || ""
        if (phonemeKey && !phonemeMap.has(phonemeKey)) {
          phonemeMap.set(phonemeKey, {
            phoneme: phonemeKey,
            score: phoneme.score || phoneme.phoneme_score || 0,
            word: word.text,
          })
        }
      })
    }
  })
  const phonemes = Array.from(phonemeMap.values()).slice(0, 2) // Show first 2 phonemes

  // If we don't have phonemes from the API structure, create some placeholder based on words
  if (phonemes.length === 0 && words.length > 0) {
    // Try to get phonemes from a different structure or create placeholders
    const firstWord = words[0]
    if (firstWord) {
      phonemes.push({
        phoneme: "ə",
        score: firstWord.score || 86,
        word: firstWord.text,
      })
      if (words.length > 1) {
        phonemes.push({
          phoneme: "ð",
          score: words[1].score || 80,
          word: words[1].text,
        })
      }
    }
  }

  const getWordColor = (score: number) => {
    if (score >= 70) return "text-gray-800" // Good - no highlight
    if (score >= 50) return "bg-yellow-200 text-yellow-900" // Yellow - needs improvement
    return "bg-orange-200 text-orange-900" // Red/Orange - incorrect
  }

  const navigationItems = [
    { id: "pronunciation" as NavigationItem, label: "Pronunciation", icon: Mic },
    { id: "practice-words" as NavigationItem, label: "Practice Words", icon: BookOpen },
    { id: "grammar" as NavigationItem, label: "Grammar", icon: Award },
    { id: "disfluency" as NavigationItem, label: "Disfluency", icon: Brain },
    { id: "fluency" as NavigationItem, label: "Fluency", icon: Brain },
  ]

  // Calculate circle circumference for progress
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const progress = (overallScore / 100) * circumference

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <div className="w-64 bg-gray-800 flex flex-col items-center py-8 space-y-4 flex-shrink-0">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-48 px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  isActive
                    ? "bg-pink-600 text-white"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
          
          <button
            onClick={handleBack}
            className="w-48 px-4 py-3 rounded-lg flex items-center justify-center space-x-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors mt-auto"
          >
            <X className="w-5 h-5" />
            <span className="font-medium">Close</span>
          </button>
          
          <div className="mt-auto space-y-4">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              SS
            </div>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
          {/* Top Bar */}
          <div className="bg-gray-900 border-b border-gray-700 px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Pronunciation Analysis</h1>
            <div className="flex items-center space-x-4">
              <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 text-sm">
                <option>British English</option>
              </select>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-8 py-8">
              {/* Description */}
              <div className="bg-gray-800 rounded-xl p-6 mb-6">
                <p className="text-gray-300 leading-relaxed">
                  This tool evaluates the accuracy of your pronunciation. Use the provided guide audio to listen to individual phonemes, guide words, and sentences. Red indicates incorrect pronunciation that needs improvement. Yellow indicates a somewhat accurate pronunciation that could be improved.
                </p>
              </div>

              {/* Scores Section */}
              <div className="flex items-start gap-8 mb-8">
                {/* Overall Score Circle */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${progress} ${circumference}`}
                        className="text-pink-500 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{overallScore}</span>
                    </div>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Accuracy Score</span>
                      <span className="text-white font-semibold">{accuracyScore}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${accuracyScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Fluency Score</span>
                      <span className="text-white font-semibold">{fluencyScore}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${fluencyScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Pronunciation Score</span>
                      <span className="text-white font-semibold">{pronunciationScore}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phoneme Analysis Cards */}
              {phonemes.length > 0 && (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {phonemes.map((ph: any, index: number) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-4xl font-bold text-white mb-2">{ph.phoneme}</div>
                          <div className="text-2xl font-semibold text-white">{Math.round(ph.score)}</div>
                        </div>
                        {index === 1 && (
                          <div className="text-sm text-gray-400">də (85/100)</div>
                        )}
                      </div>
                      <div className="text-xl text-gray-300 mb-4">{ph.word}</div>
                      <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        {index === 0 ? "Guide Word" : "Guide Phoneme"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive Text Area */}
              <div className="bg-gray-800 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                  <p className="text-gray-300">Click the highlighted word for more info:</p>
                  <div className="flex gap-2 flex-wrap">
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Download Audio
                    </button>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      User Speech
                    </button>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                      Guide Speech
                      <span className="text-lg">⏸</span>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 text-lg">
                    {words.length > 0 ? (
                      words.map((word: any, index: number) => (
                        <span
                          key={index}
                          onClick={() => setSelectedWord(word.text)}
                          className={`px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getWordColor(word.score)}`}
                        >
                          {word.text}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-300">No words available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 px-8 py-4 flex justify-between items-center flex-wrap gap-4">
        <div className="text-gray-400 text-sm">
          © 2025 Xelerate Learning. All rights reserved.
        </div>
        <div className="flex items-center space-x-6 flex-wrap">
          <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Support</a>
          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-gray-400" />
            <input type="range" min="0" max="100" defaultValue="50" className="w-20 accent-pink-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
