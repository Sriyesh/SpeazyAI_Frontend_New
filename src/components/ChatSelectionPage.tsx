"use client"

import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { ArrowLeft, GraduationCap, Briefcase, Users, MessageSquare } from "lucide-react"
import { motion } from "motion/react"

export function ChatSelectionPage() {
  const navigate = useNavigate()

  const chatRoles = [
    {
      id: "english-teacher",
      title: "AI English Teacher",
      description: "Practice English conversation, grammar, and pronunciation with an expert teacher",
      icon: GraduationCap,
      gradientFrom: "#3B82F6",
      gradientTo: "#22D3EE",
      role: "You are a friendly and patient English teacher. Help students improve their English skills through conversation. Provide clear explanations, correct mistakes gently, and encourage practice. Focus on grammar, vocabulary, pronunciation, and conversational fluency."
    },
    {
      id: "politician",
      title: "AI Politician",
      description: "Engage in political discussions and debates on current affairs and policy",
      icon: Users,
      gradientFrom: "#A855F7",
      gradientTo: "#F472B6",
      role: "You are a knowledgeable and articulate politician. Engage in thoughtful political discussions, explain policy positions, debate current affairs, and provide balanced perspectives on complex issues. Be diplomatic, well-informed, and respectful of different viewpoints."
    },
    {
      id: "technical-consultant",
      title: "AI Technical Consultant",
      description: "Get expert technical advice on software, engineering, and technology solutions",
      icon: Briefcase,
      gradientFrom: "#10B981",
      gradientTo: "#34D399",
      role: "You are an experienced technical consultant specializing in software development, engineering, and technology solutions. Provide expert advice, explain complex technical concepts clearly, help solve technical problems, and guide decision-making on technology choices and architecture."
    }
  ]

  const handleRoleSelect = (role: typeof chatRoles[0]) => {
    navigate("/chat/conversation", { state: { role: role.role, title: role.title, id: role.id } })
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #1E3A8A, #2563eb, #1E3A8A)",
    }}>
      {/* Header */}
      <header style={{
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(30, 58, 138, 0.95)",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/skills-home")}
                style={{
                  color: "#F2F6FF",
                  transition: "all 0.3s",
                }}
              >
                <ArrowLeft style={{ width: "16px", height: "16px", marginRight: "8px" }} />
                Back
              </Button>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
              <h1 style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: "#F2F6FF",
              }}>
                <MessageSquare style={{ width: "20px", height: "20px", display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
                Choose Your AI Conversation Partner
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: "1152px",
        margin: "0 auto",
        padding: "3rem 1rem",
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "3rem",
        }}>
          <h2 style={{
            fontSize: "1.875rem",
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: "1rem",
          }}>
            Select an AI Role to Chat With
          </h2>
          <p style={{
            fontSize: "1.125rem",
            color: "rgba(255, 255, 255, 0.8)",
          }}>
            Choose a specialized AI assistant and have natural voice conversations
          </p>
        </div>

        {/* Role Tiles */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {chatRoles.map((role, index) => {
            const IconComponent = role.icon
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  style={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    background: "#FFFFFF",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "24px",
                    boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
                  }}
                  onClick={() => handleRoleSelect(role)}
                >
                  <CardHeader>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}>
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `linear-gradient(135deg, ${role.gradientFrom}, ${role.gradientTo})`,
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <IconComponent style={{ width: "32px", height: "32px", color: "#FFFFFF" }} />
                      </div>
                    </div>
                    <CardTitle style={{
                      textAlign: "center",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#1E3A8A",
                    }}>
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p style={{
                      textAlign: "center",
                      fontSize: "0.875rem",
                      color: "rgba(30, 58, 138, 0.7)",
                    }}>
                      {role.description}
                    </p>
                    <Button
                      style={{
                        width: "100%",
                        marginTop: "1.5rem",
                        borderRadius: "12px",
                        background: `linear-gradient(135deg, ${role.gradientFrom}, ${role.gradientTo})`,
                        color: "#FFFFFF",
                      }}
                    >
                      Start Conversation
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
