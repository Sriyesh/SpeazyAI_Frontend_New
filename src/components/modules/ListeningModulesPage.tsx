"use client"

import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowLeft, MessageCircle, Briefcase, GraduationCap, Volume2, Radio, Music } from "lucide-react"
import { PageHeader } from "../PageHeader"
import type { CSSProperties } from "react"
import { useState } from "react"
import { ListeningBeginner } from "../listening-practice/ListeningBeginner"
import { ListeningIntermediate } from "../listening-practice/ListeningIntermediate"
import { ListeningAdvanced } from "../listening-practice/ListeningAdvanced"

export function ListeningModulesPage() {
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | null>(null)

  const BLUE_BG: CSSProperties = {
    backgroundColor: "#1E3A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  const conversationModules = [
    {
      id: "casual-conversations",
      title: "Casual Conversations",
      description: "Everyday friendly dialogues",
      icon: MessageCircle,
      color: "from-[#3B82F6] to-[#00B9FC]",
      route: "/casual-conversations",
    },
    {
      id: "official-conversations",
      title: "Official Conversations",
      description: "Professional workplace dialogues",
      icon: Briefcase,
      color: "from-[#00B9FC] to-[#246BCF]",
      route: "/official-conversations",
    },
    {
      id: "formal-conversations",
      title: "Formal Interview Conversation",
      description: "Academic and ceremonial dialogues",
      icon: GraduationCap,
      color: "from-[#246BCF] to-[#1E3A8A]",
      route: "/formal-conversations",
    },
  ]

  const levelModules = [
    {
      id: "beginner",
      title: "Beginner",
      description: "Start with simple sounds and stories",
      icon: Volume2,
      color: "from-[#3B82F6] to-[#00B9FC]",
    },
    {
      id: "intermediate",
      title: "Intermediate",
      description: "Engage with stories and dialogues",
      icon: Radio,
      color: "from-[#00B9FC] to-[#246BCF]",
    },
    {
      id: "advanced",
      title: "Advanced",
      description: "Master complex listening skills",
      icon: Music,
      color: "from-[#246BCF] to-[#1E3A8A]",
    },
  ]

  const handleModuleClick = (route: string) => {
    navigate(route, { state: { backRoute: "/listening-modules" } })
  }

  const handleLevelClick = (level: "beginner" | "intermediate" | "advanced") => {
    setSelectedLevel(level)
  }

  const handleBack = () => {
    setSelectedLevel(null)
  }

  // Show level-specific content
  if (selectedLevel === "beginner") {
    return <ListeningBeginner onBack={handleBack} />
  }
  if (selectedLevel === "intermediate") {
    return <ListeningIntermediate onBack={handleBack} />
  }
  if (selectedLevel === "advanced") {
    return <ListeningAdvanced onBack={handleBack} />
  }

  return (
    <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
      {/* Background */}
      <div className="absolute inset-0 -z-10" style={BLUE_BG} />
      
      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/skills-home")}
              className="text-white hover:bg-white/10 mb-8 rounded-2xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-3">Listening</h2>
              <p className="text-base text-white/80">Choose your learning path</p>
            </div>
          </div>

          {/* Level Modules Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-white mb-6">Practice by Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levelModules.map((module) => {
                const Icon = module.icon
                return (
                  <Card
                    key={module.id}
                    className="group bg-white border-0 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden rounded-3xl h-full flex flex-col"
                    onClick={() => handleLevelClick(module.id as "beginner" | "intermediate" | "advanced")}
                  >
                    <CardHeader className="pb-4 pt-6 flex flex-col items-center text-center flex-grow">
                      <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-[#1E3A8A] text-xl mb-2">{module.title}</CardTitle>
                      <p className="text-sm text-[#1E3A8A]/70">{module.description}</p>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Conversation Modules Section */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">Conversation Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversationModules.map((module) => {
                const Icon = module.icon
                return (
                  <Card
                    key={module.id}
                    className="group bg-white border-0 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden rounded-3xl h-full flex flex-col"
                    onClick={() => handleModuleClick(module.route)}
                  >
                    <CardHeader className="pb-4 pt-6 flex flex-col items-center text-center flex-grow">
                      <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-[#1E3A8A] text-xl mb-2">{module.title}</CardTitle>
                      <p className="text-sm text-[#1E3A8A]/70">{module.description}</p>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

