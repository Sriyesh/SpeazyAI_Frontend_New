"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { SpeechAssessmentResults } from "./SpeechAssessmentResults"
import { PageHeader } from "./PageHeader"
import type { CSSProperties } from "react"

export function SpeechAssessmentResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()

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

