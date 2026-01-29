"use client"

import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PageHeader } from "./PageHeader"
import { Button } from "./ui/button"
import { ChevronLeft } from "lucide-react"

const SECTION_TITLES: Record<string, string> = {
  overview: "Overview",
  students: "Students",
  classes: "Classes",
  trends: "Trends",
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  overview: "Progress analytics and reports.",
  students: "Student progress and performance.",
  classes: "Class management and insights.",
  trends: "Learning trends over time.",
}

export function ProgressDashboardSectionPage() {
  const navigate = useNavigate()
  const { section } = useParams<{ section: string }>()
  const title = section ? SECTION_TITLES[section] ?? section : "Dashboard"
  const description = section ? SECTION_DESCRIPTIONS[section] ?? "" : ""

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <PageHeader />
      <main
        style={{
          flex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 16px",
          width: "100%",
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/progress-dashboard")}
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            marginBottom: "20px",
            paddingLeft: 0,
          }}
        >
          <ChevronLeft style={{ width: "18px", height: "18px", marginRight: "4px" }} />
          Back to Progress Dashboard
        </Button>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#FFFFFF",
            marginBottom: "8px",
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "24px",
            }}
          >
            {description}
          </p>
        )}
        <div
          style={{
            padding: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "14px",
          }}
        >
          Content for {title} will appear here. You can replace this with the full dashboard components from the dashboard folder when ready.
        </div>
      </main>
    </div>
  )
}
