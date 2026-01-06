"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { SpeechAssessmentResults } from "./SpeechAssessmentResults"
import { PageHeader } from "./PageHeader"
import type { CSSProperties } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useEffect, useRef } from "react"

export function SpeechAssessmentResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useAuth()
  const hasSavedRef = useRef(false)

  // Get data from navigation state
  const { apiResponse, chapter, classData, backRoute } = (location.state as any) || {}

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

  // Save result to database when component mounts
  useEffect(() => {
    const saveResultToDatabase = async () => {
      // Prevent duplicate saves
      if (hasSavedRef.current || !apiResponse || apiResponse.error || !token) {
        return
      }

      // Only save if we have chapter data (for academic samples)
      if (!chapter) {
        return
      }

      try {
        hasSavedRef.current = true

        // Extract module_key from chapter.id (e.g., "ch1" -> "chapter_1" or use as-is if already formatted)
        const moduleKey = chapter.id?.startsWith("ch") 
          ? `chapter_${chapter.id.replace("ch", "")}` 
          : chapter.id || "unknown"

        // Map API response to the format expected by save-result API
        // Handle english_proficiency_scores structure - it might be nested or flat
        const englishProficiencyScores = apiResponse.overall?.english_proficiency_scores || {}
        const mockIelts = englishProficiencyScores.mock_ielts || apiResponse.overall?.mock_ielts
        const mockCefr = englishProficiencyScores.mock_cefr || apiResponse.overall?.mock_cefr
        const mockPte = englishProficiencyScores.mock_pte || apiResponse.overall?.mock_pte

        const payload = {
          module_type: "ACADEMIC_SAMPLE",
          module_key: moduleKey,
          module_title: chapter.title || "Test Data",
          result: {
            pronunciation: {
              overall_score: apiResponse.pronunciation?.overall_score ?? 0
            },
            fluency: {
              overall_score: apiResponse.fluency?.overall_score ?? 0
            },
            grammar: {
              overall_score: apiResponse.grammar?.overall_score ?? 0
            },
            overall: {
              overall_score: apiResponse.overall?.overall_score ?? 0,
              english_proficiency_scores: {
                mock_ielts: { 
                  prediction: mockIelts?.prediction ?? null 
                },
                mock_cefr: { 
                  prediction: mockCefr?.prediction ?? null 
                },
                mock_pte: { 
                  prediction: mockPte?.prediction ?? null 
                }
              }
            },
            reading: {
              total_time: apiResponse.reading?.total_time ?? 0,
              words_read: apiResponse.reading?.words_read ?? 0,
              speed_wpm_correct: apiResponse.reading?.speed_wpm_correct ?? 0,
              completion: apiResponse.reading?.completion ?? 0,
              accuracy: apiResponse.reading?.accuracy ?? 0
            },
            metadata: {
              predicted_text: apiResponse.metadata?.predicted_text ?? "",
              content_relevance: apiResponse.metadata?.content_relevance ?? 0
            }
          }
        }

        const response = await fetch("https://api.exeleratetechnology.com/api/speaking/save-result.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          console.error("Failed to save result to database:", response.status, response.statusText)
        } else {
          console.log("Result saved to database successfully")
        }
      } catch (error) {
        console.error("Error saving result to database:", error)
        // Don't show error to user as this is a background operation
      }
    }

    saveResultToDatabase()
  }, [apiResponse, chapter, token])

  const BLUE_BG: CSSProperties = {
    backgroundColor: "#1E3A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -10,
          ...BLUE_BG,
        }}
      />

      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <div
        style={{
          padding: "24px 16px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          style={{
            color: "#FFFFFF",
            marginBottom: "16px",
            borderRadius: "16px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent"
          }}
        >
          <ArrowLeft
            style={{
              width: "16px",
              height: "16px",
              marginRight: "8px",
            }}
          />
          Back
        </Button>

        {/* Speech Assessment Results */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SpeechAssessmentResults data={apiResponse} />
        </div>
      </div>
    </div>
  )
}

