"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { MelloEyes } from "./MelloEyes"
import { Star, LogOut } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { fetchStreakData } from "../utils/streakApi"

export function PageHeader() {
  const navigate = useNavigate()
  const { authData, logout, token } = useAuth()
  const [streakDays, setStreakDays] = useState<number>(0)
  const [loadingStreak, setLoadingStreak] = useState(true)

  // Get user initials from auth data
  const userInitials = authData?.user
    ? `${authData.user.first_name?.[0] || ""}${authData.user.last_name?.[0] || ""}`.toUpperCase() || "U"
    : "U"

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  // Fetch streak data on mount and when token changes
  useEffect(() => {
    const loadStreakData = async () => {
      if (!token) {
        setLoadingStreak(false)
        return
      }

      try {
        setLoadingStreak(true)
        const streakData = await fetchStreakData(token)
        if (streakData) {
          setStreakDays(streakData.current_streak || streakData.streak_days || 0)
        }
      } catch (error) {
        console.error('Error loading streak data:', error)
      } finally {
        setLoadingStreak(false)
      }
    }

    loadStreakData()
  }, [token])

  return (
    <>
      <style>
        {`
          @media (max-width: 640px) {
            .streak-badge {
              display: none !important;
            }
          }
        `}
      </style>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(4px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          flexShrink: 0,
        }}
      >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ animation: "none" }}>
                <MelloEyes />
              </div>
            </div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              English Skill AI
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              className="streak-badge"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "4px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Star
                style={{
                  width: "16px",
                  height: "16px",
                  color: "#FFD600",
                  fill: "#FFD600",
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#FFFFFF",
                }}
              >
                {loadingStreak ? "..." : `${streakDays} day${streakDays !== 1 ? 's' : ''} streak`}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#3B82F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {userInitials}
              </div>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              style={{
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <LogOut
                style={{
                  width: "16px",
                  height: "16px",
                }}
              />
            </Button>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}

