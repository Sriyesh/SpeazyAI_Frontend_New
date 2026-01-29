"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "./PageHeader"
import { BarChart3, Users, GraduationCap, TrendingUp } from "lucide-react"

const CARD_STYLE_BASE: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  cursor: "pointer",
  transition: "background-color 0.15s ease, border-color 0.15s ease",
}

/**
 * Progress Dashboard page — recreated from dashboard folder reference.
 * Entry point for Teachers, Students, and Principals to view their progress.
 */
export function ProgressDashboardPage() {
  const navigate = useNavigate()

  const cards = [
    {
      title: "Overview",
      description: "Progress analytics and reports.",
      icon: BarChart3,
      path: "/progress-dashboard/overview",
    },
    {
      title: "Students",
      description: "Student progress and performance.",
      icon: Users,
      path: "/progress-dashboard/students",
    },
    {
      title: "Classes",
      description: "Class management and insights.",
      icon: GraduationCap,
      path: "/progress-dashboard/classes",
    },
    {
      title: "Trends",
      description: "Learning trends over time.",
      icon: TrendingUp,
      path: "/progress-dashboard/trends",
    },
  ]

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
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            Progress Dashboard
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: "4px",
            }}
          >
            Track progress for Teachers, Students, and Principals.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {cards.map(({ title, description, icon: Icon, path }) => (
            <div
              key={title}
              role="button"
              tabIndex={0}
              style={CARD_STYLE_BASE}
              onClick={() => navigate(path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  navigate(path)
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#FFFFFF",
                  }}
                >
                  {title}
                </span>
                <Icon
                  style={{
                    width: "18px",
                    height: "18px",
                    color: "rgba(255, 255, 255, 0.5)",
                    flexShrink: 0,
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
