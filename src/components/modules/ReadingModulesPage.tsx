"use client"

import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowLeft, BookOpen, Library, Video, BookText, BookMarked, BookOpenCheck } from "lucide-react"
import { PageHeader } from "../PageHeader"
import type { CSSProperties } from "react"

const readingModules = [
  {
    id: "my-lessons",
    title: "My Lessons",
    description: "Continue your learning journey",
    icon: BookOpen,
    color: "from-[#246BCF] to-[#1E3A8A]",
  },
  {
    id: "stories",
    title: "Stories",
    description: "Explore engaging stories",
    icon: BookMarked,
    color: "from-[#3B82F6] to-[#00B9FC]",
  },
  {
    id: "novel",
    title: "Novel",
    description: "Read complete novels",
    icon: BookOpenCheck,
    color: "from-[#00B9FC] to-[#246BCF]",
  },
  {
    id: "content-library",
    title: "Content Library",
    description: "Explore reading materials",
    icon: Library,
    color: "from-[#1E3A8A] to-[#3B82F6]",
  },
  {
    id: "phoneme-guide",
    title: "Phoneme Guide",
    description: "Learn pronunciation patterns",
    icon: BookText,
    color: "from-[#3B82F6] to-[#FFD600]",
  },
  {
    id: "sample-videos",
    title: "Sample Videos",
    description: "Watch educational video content",
    icon: Video,
    color: "from-[#246BCF] to-[#1E3A8A]",
  },
]

export function ReadingModulesPage() {
  const navigate = useNavigate()

  const BLUE_BG: CSSProperties = {
    backgroundColor: "#1E3A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  const handleModuleClick = (moduleId: string) => {
    const navigationMap: Record<string, string> = {
      "my-lessons": "/my-lessons",
      "stories": "/stories",
      "novel": "/novel",
      "content-library": "/content-library",
      "phoneme-guide": "/phoneme-guide",
      "sample-videos": "/sample-videos",
    }
    
    const route = navigationMap[moduleId] || `/${moduleId}`
    navigate(route, { state: { backRoute: "/reading-modules" } })
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
              className="text-white hover:bg-white/10 mb-4 rounded-2xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-3xl font-bold text-white mb-2">Reading</h2>
            <p className="text-base text-white/80">Choose your learning path</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readingModules.map((module) => (
              <Card
                key={module.id}
                className="group bg-white border-0 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden rounded-3xl h-full flex flex-col"
                onClick={() => handleModuleClick(module.id)}
              >
                <CardHeader className="pb-4 pt-6 flex flex-col items-center text-center flex-grow">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                  >
                    <module.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-[#1E3A8A] text-xl mb-2">{module.title}</CardTitle>
                  <p className="text-sm text-[#1E3A8A]/70">{module.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

