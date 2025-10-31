"use client"

import type React from "react"

// file: HomePage.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { ThemeToggle } from "./ThemeToggle"
import { MelloAssistant } from "./MelloAssistant"
import {
  Mic2,
  Mail,
  UserPlus,
  Star,
  Users,
  Download,
  Target,
  Zap,
  Shield,
  Quote,
  Sparkles,
  Play,
  BookOpen,
  Award,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Facebook,
} from "lucide-react"

export function HomePage() {
  const navigate = useNavigate()
  const [showMelloMessage, setShowMelloMessage] = useState(true)

  const TEXT_LIGHT = "#F2F6FF"
  const TEXT_MUTED = "rgba(242,246,255,0.78)"
  const CARD_TEXT = "#0F1F47"

  // UPDATED: removed the first white glow gradient. Blues only.
  const BLURRY_BLUE_BG: React.CSSProperties = {
    backgroundColor: "#123A8A",
    backgroundImage: `
      radial-gradient(900px 700px at 78% 28%, rgba(21,86,197,0.75) 0%, rgba(21,86,197,0.10) 55%, rgba(21,86,197,0) 70%),
      radial-gradient(880px 680px at 20% 20%, rgba(18,59,150,0.75) 0%, rgba(18,59,150,0.10) 55%, rgba(18,59,150,0) 70%),
      radial-gradient(900px 700px at 80% 78%, rgba(13,52,152,0.80) 0%, rgba(13,52,152,0.10) 55%, rgba(13,52,152,0) 70%),
      radial-gradient(820px 640px at 18% 82%, rgba(0,185,252,0.35) 0%, rgba(0,185,252,0.06) 55%, rgba(0,185,252,0) 70%),
      radial-gradient(700px 560px at 60% 12%, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0.06) 55%, rgba(59,130,246,0) 72%),
      radial-gradient(900px 700px at 92% 50%, rgba(8,44,132,0.85) 0%, rgba(8,44,132,0.10) 55%, rgba(8,44,132,0) 75%)
    `,
    backgroundBlendMode: "normal",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  const stats = [
    {
      icon: Download,
      value: "500K+",
      label: "Downloads",
      color: "#3B82F6",
    },
    {
      icon: Users,
      value: "50K+",
      label: "Active Students",
      color: "#00B9FC",
    },
    {
      icon: Award,
      value: "10K+",
      label: "Lessons Learned",
      color: "#FFD600",
    },
  ]

  const features = [
    {
      icon: Target,
      title: "AI-Powered Learning",
      description:
        "Advanced speech recognition technology provides instant feedback on pronunciation, pace, and clarity",
      gradient: "from-[#3B82F6] to-[#00B9FC]",
    },
    {
      icon: Users,
      title: "Expert-Designed Curriculum",
      description: "Lessons crafted by professional speech coaches and educators to ensure effective learning outcomes",
      gradient: "from-[#1E3A8A] to-[#3B82F6]",
    },
    {
      icon: Zap,
      title: "Interactive Practice",
      description: "Engaging exercises, real-world scenarios, and gamified learning to keep students motivated",
      gradient: "from-[#00B9FC] to-[#3B82F6]",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Child-safe environment with privacy protection and parental controls built-in",
      gradient: "from-[#246BCF] to-[#3B82F6]",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent",
      avatar: "SJ",
      rating: 5,
      text: "My daughter has gained so much confidence in public speaking! The AI feedback is incredibly helpful and she actually looks forward to practice sessions.",
      gradient: "from-[#3B82F6] to-[#00B9FC]",
    },
    {
      name: "Michael Chen",
      role: "Teacher",
      avatar: "MC",
      rating: 5,
      text: "I recommend Speech Skills AI to all my students. The structured lessons and instant feedback have significantly improved their presentation skills.",
      gradient: "from-[#00B9FC] to-[#246BCF]",
    },
    {
      name: "Emily Rodriguez",
      role: "Parent",
      avatar: "ER",
      rating: 5,
      text: "As a non-native English speaker, this app has been invaluable for my son. His pronunciation and fluency have improved dramatically in just 3 months!",
      gradient: "from-[#246BCF] to-[#3B82F6]",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="absolute inset-0 -z-10" style={BLURRY_BLUE_BG} />

      <nav className="sticky top-0 z-50 backdrop-blur-sm/0 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 linear-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Mic2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg" style={{ color: TEXT_LIGHT }}>
                Speech Skills AI
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {[
                { label: "Home" },
                {
                  label: "About",
                  onClick: () => navigate("/about"),
                },
                { label: "Courses" },
                { label: "Features" },
                {
                  label: "Contact",
                  onClick: () => navigate("/contact"),
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  className="hover:opacity-90 transition"
                  style={{ color: TEXT_LIGHT }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => navigate("/contact")}
                className="hidden sm:block hover:opacity-90 transition"
                style={{ color: TEXT_LIGHT }}
              >
                Contact Us
              </button>
              <Button
                onClick={() => navigate("/signup")}
                className="linear-gradient-primary text-white rounded-xl px-5 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Sign Up
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="border-2 border-white/60 text-white hover:bg-white/10 rounded-xl px-5 transition"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/12 px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-[#CFE2FF]" />
                <span className="text-sm" style={{ color: TEXT_LIGHT }}>
                  AI-Powered Speech Training
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight" style={{ color: TEXT_LIGHT }}>
                Empowering Confident Communication with AI
              </h1>

              <p className="text-xl leading-relaxed" style={{ color: TEXT_MUTED }}>
                Transform your speaking skills with our AI-powered platform. Get instant feedback, personalized
                coaching, and interactive lessons designed by experts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/signup")}
                  className="h-14 px-8 linear-gradient-primary text-white rounded-2xl shadow-xl hover:shadow-2xl transition hover:scale-105 text-lg"
                >
                  <UserPlus className="w-5 h-5 mr-2" /> Get Started for Free
                </Button>
                <Button
                  variant="outline"
                  className="h-14 px-8 border-2 border-white/60 text-white hover:bg-white/10 rounded-2xl transition hover:scale-105 text-lg bg-transparent"
                >
                  <Play className="w-5 h-5 mr-2" /> Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {["#3B82F6", "#00B9FC", "#FFD600", "#246BCF"].map((c, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white/70 shadow-md"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#FFD600] fill-[#FFD600]" />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: TEXT_MUTED }}>
                    Trusted by 50,000+ students worldwide
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center">
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </div>

                <Card className="relative z-10 w-full max-w-md bg-white neumorphic-card border-0 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="w-20 h-20 mx-auto linear-gradient-primary rounded-3xl flex items-center justify-center shadow-xl">
                        <Mic2 className="w-10 h-10 text-white" />
                      </div>

                      <div className="flex items-center justify-center gap-1 h-16">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 rounded-full bg-gradient-to-t from-[#3B82F6] to-[#00B9FC]"
                            style={{
                              height: `${20 + Math.random() * 40}px`,
                              animation: `${1 + Math.random()}s pulse ease-in-out infinite`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 px-4 py-2 rounded-full">
                          <div className="w-2 h-2 bg-[#00B9FC] rounded-full animate-pulse" />
                          <span className="text-sm" style={{ color: CARD_TEXT }}>
                            Recording...
                          </span>
                        </div>
                        <p className="text-2xl" style={{ color: CARD_TEXT }}>
                          "Practice makes perfect!"
                        </p>
                        <p
                          className="text-sm"
                          style={{
                            color: "rgba(15,31,71,0.65)",
                          }}
                        >
                          AI analyzing your speech in real-time
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-4">
                        {[
                          {
                            label: "Clarity",
                            value: "95%",
                            color: "#3B82F6",
                          },
                          {
                            label: "Pace",
                            value: "88%",
                            color: "#00B9FC",
                          },
                          {
                            label: "Tone",
                            value: "92%",
                            color: "#FFD600",
                          },
                        ].map((m, i) => (
                          <div key={i} className="text-center">
                            <div className="text-2xl mb-1" style={{ color: m.color }}>
                              {m.value}
                            </div>
                            <div
                              className="text-xs"
                              style={{
                                color: "rgba(15,31,71,0.65)",
                              }}
                            >
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div
                  className="absolute top-10 left-10 bg-white neumorphic-card border-0 shadow-lg px-4 py-2 rounded-full"
                  style={{
                    animation: "bounce 3s cubic-bezier(0.4,0,0.6,1) infinite",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-sm" style={{ color: CARD_TEXT }}>
                      1000+ Lessons
                    </span>
                  </div>
                </div>

                <div
                  className="absolute bottom-10 right-10 bg-white neumorphic-card border-0 shadow-lg px-4 py-2 rounded-full"
                  style={{
                    animation: "bounce 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
                    animationDelay: "0.5s",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#FFD600] fill-[#FFD600]" />
                    <span className="text-sm" style={{ color: CARD_TEXT }}>
                      4.9 Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other sections unchanged; cards keep white for readability */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: TEXT_LIGHT }}>
              Trusted Worldwide
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, idx) => (
              <Card
                key={idx}
                className="bg-white neumorphic-card border-0 hover:shadow-2xl transition hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`,
                    }}
                  >
                    <s.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-5xl mb-2" style={{ color: CARD_TEXT }}>
                    {s.value}
                  </p>
                  <p className="text-lg" style={{ color: "rgba(15,31,71,0.7)" }}>
                    {s.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: TEXT_LIGHT }}>
              Why Choose Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] mx-auto mb-6 rounded-full" />
            <p className="text-xl mx-auto" style={{ color: TEXT_MUTED }}>
              Cutting-edge technology meets expert pedagogy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <Card
                key={i}
                className="group bg-white neumorphic-card border-0 transition hover:-translate-y-2 hover:shadow-2xl"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 mb-6 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center shadow-lg transition group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <f.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl mb-4" style={{ color: CARD_TEXT }}>
                    {f.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: "rgba(15,31,71,0.75)" }}>
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: TEXT_LIGHT }}>
              What People Say
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] mx-auto mb-6 rounded-full" />
            <p className="text-xl" style={{ color: TEXT_MUTED }}>
              Real stories from real users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card
                key={i}
                className="bg-white neumorphic-card border-0 hover:shadow-2xl transition hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-[#FFD600] mb-4 opacity-60" />
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-[#FFD600] fill-[#FFD600]" />
                    ))}
                  </div>
                  <p className="mb-6 leading-relaxed italic" style={{ color: "rgba(15,31,71,0.75)" }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`bg-gradient-to-br ${t.gradient} text-white`}>
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p style={{ color: CARD_TEXT }}>{t.name}</p>
                      <p className="text-sm" style={{ color: "rgba(15,31,71,0.65)" }}>
                        {t.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="linear-gradient-primary neumorphic-card border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <Sparkles className="w-16 h-16 text-[#FFD600] mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl text-white mb-4">Start Your Journey Today</h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of students improving their speaking skills with AI-powered coaching
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    onClick={() => navigate("/signup")}
                    className="h-14 px-12 bg-white text-[#3B82F6] hover:bg-white/90 rounded-2xl shadow-xl transition hover:scale-105 text-lg"
                  >
                    Get Started for Free
                  </Button>
                  <Button
                    onClick={() => navigate("/about")}
                    variant="outline"
                    className="h-14 px-12 border-2 border-white text-white hover:bg-white/10 rounded-2xl transition hover:scale-105 text-lg"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] rounded-xl flex items-center justify-center">
                  <Mic2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold text-lg">Speech Skills AI</span>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">
                Empowering voices worldwide with AI technology and expert speech training.
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Github, Facebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4 text-lg">Quick Links</h4>
              <div className="space-y-3">
                <button className="block text-white/70 hover:text-white transition-colors">Courses</button>
                <button
                  onClick={() => navigate("/about")}
                  className="block text-white/70 hover:text-white transition-colors"
                >
                  About
                </button>
                <button className="block text-white/70 hover:text-white transition-colors">Blog</button>
                <button className="block text-white/70 hover:text-white transition-colors">Pricing</button>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4 text-lg">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/70">
                  <Mail className="w-4 h-4" />
                  <span>support@speechskills.ai</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <MapPin className="w-4 h-4" />
                  <span>123 Education St, Learning City</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4 text-lg">Get Started</h4>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/signup")}
                  className="w-full bg-white text-[#3B82F6] hover:bg-white/90 rounded-xl"
                >
                  Sign Up
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full border-2 border-white/30 text-white hover:bg-white/10 rounded-xl"
                >
                  Log In
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              © 2025 Speech Skills AI. All rights reserved. Professional Speech Training Platform.
            </p>
          </div>
        </div>
      </footer>

      <MelloAssistant
        state={showMelloMessage ? "waving" : "idle"}
        message="Hi! I'm Mello, your AI learning companion! Ready to start your speaking journey? 🌟"
        showMessage={showMelloMessage}
        onMessageDismiss={() => setShowMelloMessage(false)}
        position="bottom-right"
      />
    </div>
  )
}
