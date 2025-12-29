"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader } from "./ui/card"
import { ThemeToggle } from "./ThemeToggle"
import { MelloAssistant } from "./MelloAssistant"
import { Eye, EyeOff, Check, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function SignUpPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showMelloMessage, setShowMelloMessage] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    if (!agreeTerms) {
      alert("Please accept the terms and conditions")
      return
    }
    navigate("/skills-home")
  }

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: "", color: "" }
    if (password.length < 6) return { strength: 1, label: "Weak", color: "#FF4444" }
    if (password.length < 10) return { strength: 2, label: "Good", color: "#3B82F6" }
    return { strength: 3, label: "Strong", color: "#00B9FC" }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-white radial-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/login")}
        className="absolute top-4 left-4 text-[#1E3A8A] hover:text-[#3B82F6]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl neumorphic-card border-0 overflow-hidden">
          <CardHeader className="text-center pb-6 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white relative">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl text-white mb-2">Join Us Today</h1>
              <p className="text-sm text-white/90">Start your learning journey</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-8 pb-8 pt-8 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#1E3A8A]">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-[#F2F3F4] border-0 text-[#1E3A8A] placeholder:text-[#1E3A8A]/40 focus:ring-2 focus:ring-[#3B82F6] rounded-xl neumorphic-inset"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1E3A8A]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-[#F2F3F4] border-0 text-[#1E3A8A] placeholder:text-[#1E3A8A]/40 focus:ring-2 focus:ring-[#3B82F6] rounded-xl neumorphic-inset"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1E3A8A]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-[#F2F3F4] border-0 text-[#1E3A8A] placeholder:text-[#1E3A8A]/40 focus:ring-2 focus:ring-[#3B82F6] rounded-xl pr-12 neumorphic-inset"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1E3A8A]/60 hover:text-[#3B82F6] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: level <= passwordStrength.strength ? passwordStrength.color : "#E5E7EB",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#1E3A8A]">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-[#F2F3F4] border-0 text-[#1E3A8A] placeholder:text-[#1E3A8A]/40 focus:ring-2 focus:ring-[#3B82F6] rounded-xl pr-12 neumorphic-inset"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1E3A8A]/60 hover:text-[#3B82F6] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-200 ${
                    agreeTerms
                      ? "bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] border-[#3B82F6]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {agreeTerms && <Check className="w-3 h-3 text-white" />}
                </button>
                <label
                  className="text-sm text-[#1E3A8A]/70 leading-tight cursor-pointer"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                >
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={!agreeTerms || password !== confirmPassword || !password}
                className="w-full h-12 linear-gradient-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#1E3A8A]/60">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full h-12 border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/5 rounded-xl transition-all duration-200 neumorphic-button"
            >
              Sign In Instead
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-[#1E3A8A]/60 text-sm mt-6">Secure Registration • Professional Platform</p>
      </div>

      {/* Mello Assistant */}
      <MelloAssistant
        state="celebrating"
        message="Awesome! You're about to join thousands of successful learners! Let's get started! 🎉"
        showMessage={showMelloMessage}
        onMessageDismiss={() => setShowMelloMessage(false)}
        position="bottom-right"
      />
    </div>
  )
}
