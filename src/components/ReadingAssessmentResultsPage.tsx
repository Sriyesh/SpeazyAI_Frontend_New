"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { ReadingAssessmentResults } from "./ReadingAssessmentResults"
import { PageHeader } from "./PageHeader"
import type { CSSProperties } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useEffect, useRef } from "react"

export function ReadingAssessmentResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, authData } = useAuth()
  const hasSavedRef = useRef(false)
  
  // Get token from authData if token is null, and ensure it's a valid string
  const rawToken = token || authData?.token
  const authToken = rawToken && typeof rawToken === 'string' ? rawToken.trim() : null

  // Get data from navigation state
  const { apiResponse, chapter, classData, backRoute, lessonTitle, lessonId, speech, story, novel, audioUrl, moduleType, moduleKey, moduleTitle } = (location.state as any) || {}
  
  // Also handle cases where audioUrl might be passed through different state structures
  const finalAudioUrl = audioUrl || (apiResponse?.audioUrl)
  
  // Debug: Log audio URL to verify it's being passed
  useEffect(() => {
    if (finalAudioUrl) {
      console.log("Audio URL found in ReadingAssessmentResultsPage:", finalAudioUrl.substring(0, 50) + "...")
    } else {
      console.log("No audio URL found in ReadingAssessmentResultsPage")
      console.log("Location state:", location.state)
    }
  }, [finalAudioUrl, location.state])

  const handleBack = () => {
    if (backRoute) {
      if (speech || story || novel) {
        // Famous speeches, stories, or novels
        navigate(backRoute)
      } else {
        navigate(backRoute, { state: { classData, chapter } })
      }
    } else {
      navigate("/reading-modules")
    }
  }

  // If no data, redirect back
  if (!apiResponse || apiResponse.error) {
    if (backRoute) {
      if (speech || story || novel) {
        // Famous speeches, stories, or novels
        navigate(backRoute)
      } else {
        navigate(backRoute, { state: { classData, chapter } })
      }
    } else {
      navigate("/reading-modules")
    }
    return null
  }

  // Save result to database when component mounts
  useEffect(() => {
    const saveResultToDatabase = async () => {
      // Prevent duplicate saves
      if (hasSavedRef.current || !apiResponse || apiResponse.error || !authToken) {
        console.warn("Cannot save result: missing token or invalid response", { 
          hasToken: !!authToken, 
          hasResponse: !!apiResponse, 
          hasError: !!apiResponse?.error 
        })
        return
      }

      // Determine if this is from custom-content, academic-samples, famous-speeches, stories, novels, or reading-modules
      const isCustomContent = backRoute?.includes("/custom-content") || lessonId
      const hasChapter = chapter && chapter.id
      const isFamousSpeech = speech && speech.id
      const isStory = story && story.id
      const isNovel = novel && novel.id
      const isReadingModule = moduleType && moduleKey

      // Only save if we have chapter data, lesson data, speech data, story data, novel data, or module data
      if (!hasChapter && !isCustomContent && !isFamousSpeech && !isStory && !isNovel && !isReadingModule) {
        return
      }

      try {
        hasSavedRef.current = true

        let finalModuleType: string
        let finalModuleKey: string
        let finalModuleTitle: string

        if (isStory && story.id) {
          // Story - use story data
          finalModuleType = "STORIES"
          finalModuleKey = story.id.replace("-", "_") // story-1 -> story_1
          finalModuleTitle = story.title || ""
        } else if (isNovel && novel.id) {
          // Novel - use novel data
          finalModuleType = "NOVEL"
          finalModuleKey = novel.id.replace("-", "_") // novel-1 -> novel_1
          finalModuleTitle = novel.title || ""
        } else if (isReadingModule && moduleType && moduleKey) {
          // Reading module - use provided module data
          finalModuleType = moduleType
          finalModuleKey = moduleKey
          finalModuleTitle = moduleTitle || ""
        } else if (isFamousSpeech) {
          // Famous speech - use speech data
          finalModuleType = "FAMOUS_SPEECH"
          finalModuleKey = speech.id || "unknown"
          finalModuleTitle = speech.title || ""
        } else if (isCustomContent && lessonId) {
          // Custom content - use lessonId and lessonTitle
          finalModuleType = "CUSTOM_CONTENT"
          finalModuleKey = lessonId.toString()
          finalModuleTitle = lessonTitle || ""
        } else if (hasChapter) {
          // Academic sample - use chapter data
          finalModuleType = "ACADEMIC_SAMPLE"
          finalModuleKey = chapter.id?.startsWith("ch") 
            ? `chapter_${chapter.id.replace("ch", "")}` 
            : chapter.id || "unknown"
          finalModuleTitle = chapter.title || ""
        } else {
          // Fallback - shouldn't reach here but just in case
          return
        }

        // Get user data from auth context
        const user = authData?.user || {}
        
        // Map API response to the exact format specified by the user
        // Handle english_proficiency_scores structure - it might be nested or flat
        const englishProficiencyScores = apiResponse.overall?.english_proficiency_scores || {}
        const mockIelts = englishProficiencyScores.mock_ielts || apiResponse.overall?.mock_ielts
        const mockCefr = englishProficiencyScores.mock_cefr || apiResponse.overall?.mock_cefr
        const mockPte = englishProficiencyScores.mock_pte || apiResponse.overall?.mock_pte

        // Extract scores from API response
        const overallScore = apiResponse.overall?.overall_score ?? 0
        const pronunciationScore = apiResponse.pronunciation?.overall_score ?? 0
        const fluencyScore = apiResponse.fluency?.overall_score ?? 0
        const grammarScore = apiResponse.grammar?.overall_score ?? 0
        
        // Extract IELTS, CEFR, and PTE scores
        const ieltsScore = mockIelts?.prediction ?? null
        const cefrLevel = mockCefr?.prediction ?? null
        const pteScore = mockPte?.prediction ?? null
        
        // Extract reading metrics
        const totalTime = apiResponse.reading?.total_time ?? apiResponse.reading?.reading_time ?? 0
        const wordsRead = apiResponse.reading?.words_read ?? 0
        const wordsPerMinute = apiResponse.reading?.speed_wpm_correct ?? apiResponse.reading?.speed_wpm ?? 0
        const completionPercent = apiResponse.reading?.completion 
          ? (apiResponse.reading.completion * 100) 
          : 0
        const accuracyPercent = apiResponse.reading?.accuracy 
          ? (apiResponse.reading.accuracy * 100) 
          : 0

        // Format timestamp for created_at (MySQL datetime format)
        const now = new Date()
        const created_at = now.toISOString().slice(0, 19).replace('T', ' ')

        // Build payload in the exact format specified
        const payload = {
          organisation_id: user.organisation_id ?? null,
          user_id: user.id ?? null,
          module_type: finalModuleType,
          module_key: finalModuleKey,
          module_title: finalModuleTitle,
          overall_score: overallScore.toFixed(2),
          pronunciation_score: pronunciationScore.toFixed(2),
          fluency_score: fluencyScore.toFixed(2),
          grammar_score: grammarScore.toFixed(2),
          ielts_score: ieltsScore ? ieltsScore.toString() : null,
          cefr_level: cefrLevel || null,
          pte_score: pteScore ? (typeof pteScore === 'number' ? pteScore : parseFloat(pteScore)) : null,
          total_time: totalTime ? totalTime.toString() : "0.00",
          words_read: wordsRead || 0,
          words_per_minute: wordsPerMinute ? wordsPerMinute.toFixed(2) : "0.00",
          completion_percent: completionPercent.toFixed(2),
          accuracy_percent: accuracyPercent.toFixed(2),
          created_at: created_at,
          first_name: user.first_name || null,
          last_name: user.last_name || null,
          email: user.email || null,
          user_role: user.role || null,
          user_class: Array.isArray(user.class) ? user.class.join(',') : (user.class || null)
        }

        console.log("Saving result to database with payload:", JSON.stringify(payload, null, 2))

        // Use the reading API endpoint as specified by the user
        const response = await fetch("https://api.exeleratetechnology.com/api/reading/save-result.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Failed to save result to database:", response.status, response.statusText, errorText)
          
          // Handle 401 Unauthorized specifically
          if (response.status === 401) {
            console.error("Authentication failed. Token may be invalid or expired:", {
              hasToken: !!authToken,
              tokenLength: authToken?.length,
              tokenPreview: authToken ? `${authToken.substring(0, 20)}...` : "null"
            })
          }
        } else {
          const responseData = await response.json()
          console.log("Result saved to database successfully:", responseData)
        }
      } catch (error) {
        console.error("Error saving result to database:", error)
        // Don't show error to user as this is a background operation
      }
    }

    saveResultToDatabase()
  }, [apiResponse, chapter, authToken, backRoute, lessonId, lessonTitle, speech, story, novel, moduleType, moduleKey, moduleTitle, authData])

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

        {/* Reading Assessment Results */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ReadingAssessmentResults data={apiResponse} audioUrl={finalAudioUrl} />
        </div>
      </div>
    </div>
  )
}

