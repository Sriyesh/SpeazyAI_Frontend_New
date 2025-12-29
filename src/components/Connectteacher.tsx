"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { ArrowLeft, Phone, Globe } from "lucide-react"
import { PageHeader } from "./PageHeader"
import { MelloAssistant } from "./MelloAssistant"
import type { CSSProperties } from "react"

const teacherTypes = [
  {
    id: "connect-your-teacher",
    title: "Connect Your Teacher",
    description: "Connect and learn from your class teacher",
    icon: Phone,
    color: "from-[#3B82F6] to-[#00B9FC]",
  },
  {
    id: "connect-foreign-teacher",
    title: "Connect with Foreign Teacher",
    description: "Learn from native speakers worldwide",
    icon: Globe,
    color: "from-[#00B9FC] to-[#246BCF]",
  },
]

export function Connectteacher() {
  const navigate = useNavigate()
  const [showMelloMessage, setShowMelloMessage] = useState(true)
  const [melloState, setMelloState] = useState<"idle" | "talking" | "waving" | "celebrating" | "thinking">("waving")

  const BLUE_BG: CSSProperties = {
    backgroundColor: "#1E3A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  const handleTeacherTypeClick = (teacherTypeId: string) => {
    // Change Mello state to celebrating when user clicks
    setMelloState("celebrating")
    setShowMelloMessage(true)
    
    // Handle navigation based on teacher type
    // You can add specific routes or actions here
    if (teacherTypeId === "connect-your-teacher") {
      alert("Connecting to your teacher...")
      // navigate("/connect-your-teacher", { state: { backRoute: "/connect-teacher" } })
    } else if (teacherTypeId === "connect-foreign-teacher") {
      alert("Connecting to foreign teacher...")
      // navigate("/connect-foreign-teacher", { state: { backRoute: "/connect-teacher" } })
    }
    
    // Reset state after a moment
    setTimeout(() => {
      setMelloState("waving")
    }, 2000)
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
            <h2 className="text-3xl font-bold text-white mb-2">Connect with Teacher</h2>
            <p className="text-base text-white/80">Choose your preferred connection type</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {teacherTypes.map((teacherType, index) => {
              const IconComponent = teacherType.icon
              return (
                <Card
                  key={teacherType.id}
                  className="group cursor-pointer bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                  onClick={() => handleTeacherTypeClick(teacherType.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient accent on top */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${teacherType.color}`}
                  />

                  <CardHeader className="p-8">
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div
                        className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${teacherType.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Title and Description */}
                    <CardTitle className="text-2xl text-[#1E3A8A] text-center mb-3">
                      {teacherType.title}
                    </CardTitle>
                    <p className="text-[#1E3A8A]/70 text-center text-sm mb-6">
                      {teacherType.description}
                    </p>

                    {/* Bottom decoration */}
                    <div className="flex justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#3B82F6]/30" />
                      <div className="w-2 h-2 rounded-full bg-[#3B82F6]/50" />
                      <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* MelloAssistant */}
      <MelloAssistant
        state={melloState}
        message="Ready to connect with a teacher? Choose an option below and let's start learning together! 🎓✨"
        showMessage={showMelloMessage}
        onMessageDismiss={() => setShowMelloMessage(false)}
        position="bottom-right"
      />
    </div>
  )
}
