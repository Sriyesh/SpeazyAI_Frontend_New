"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { ThemeToggle } from "./ThemeToggle"
import { MelloEyes } from "./MelloEyes"
import { Star, Phone, LogOut } from "lucide-react"

export function PageHeader() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            {/* himello start */}
            <div className="flex items-center justify-center">
              <MelloEyes />
            </div>
            {/* himello end */}
            <h1 className="text-lg font-semibold text-white">Speech Skills AI</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-lg border border-white/20">
              <Star className="w-4 h-4 text-[#FFD600] fill-[#FFD600]" />
              <span className="text-sm font-medium text-white">7 day streak</span>
            </div>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/connect-teacher")}
              className="text-white hover:bg-white/10 rounded-2xl"
              title="Connect with Teacher"
            >
              <Phone className="w-4 h-4 mr-2" />
              Connect Teacher
            </Button>

            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="hover:bg-white/10">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white text-xs font-semibold">
                  JS
                </AvatarFallback>
              </Avatar>
            </Button>

            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="hover:bg-white/10 text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

