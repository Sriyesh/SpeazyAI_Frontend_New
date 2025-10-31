"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { ThemeToggle } from "./ThemeToggle"
import { MelloAssistant } from "./MelloAssistant"
import { motion } from "motion/react"
import { ArrowLeft, Send, Mic, Bot, User, Sparkles, Heart, Star, ThumbsUp, Lightbulb } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ChatWithAIProps {
  onBack: () => void
}

type Message = {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
  melloTip?: string
}

export function ChatWithAI() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello, young speaker! 👋 I'm your AI Coach! Let's have fun learning English together! 🎉 What do you want to practice today? 🗣️",
      sender: "ai",
      timestamp: new Date(),
      melloTip: "Try asking about a fun word or story! I'm here to cheer you on! 😄✨",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [starCount, setStarCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const quickQuestions = [
    { icon: "🎤", text: "How can I speak more clearly?" },
    {
      icon: "📖",
      text: "Can you give me a fun story to read?",
    },
    { icon: "💪", text: "Tips to be a confident speaker!" },
    { icon: "🎯", text: "Help me pronounce words better!" },
  ]

  const aiResponses = {
    clear: {
      response:
        "Awesome question! 🌟 To speak clearly:\n\n1. 🗣️ Talk slowly and smile! 😊\n2. 💨 Take big breaths before you speak.\n3. 👄 Say words like you're singing! 🎵\n4. 📚 Read a fun book out loud every day!\n\nWant to try a clear-speaking game? 🎲",
      melloTip: "Say each word slowly like you're telling a secret! 🤫 Try 'sunshine' now! ☀️",
    },
    story: {
      response:
        "Yay, story time! 📖✨\n\nOnce upon a time, a tiny star named Twinkle wanted to shine super bright! 🌟 Every night, Twinkle practiced glowing until she lit up the whole sky! 🌌\n\nWant to read this story out loud with me? 🗣️",
      melloTip: "Read the story with a big smile! 😄 Try saying 'Twinkle' clearly! 🌟",
    },
    confident: {
      response:
        "You’re a superstar! 💪✨ Try these for confidence:\n\n1. 🦸 Stand tall like a hero!\n2. 👀 Smile at your friends when you talk.\n3. 🎵 Use your happy voice!\n4. ❤️ Be yourself—you’re awesome! 😎\n\nReady to practice being confident? 🚀",
      melloTip: "Stand up straight and say 'I’m awesome!' loudly! 🦸 You’ve got this! 💥",
    },
    pronunciation: {
      response:
        "Pronouncing words is fun! 🎯 Let’s do it:\n\n1. 👂 Listen to the word carefully.\n2. 🔄 Break it into small pieces.\n3. 🎬 Say it slowly, like a movie star!\n4. 🎤 Record yourself and listen! 😄\n\nWant to try some cool words? 🌈",
      melloTip: "Try saying 'butterfly' slowly: but-ter-fly! 🦋 You’re doing great! 🎉",
    },
    default: {
      response:
        "Wow, great question! 🌈 I can help you with:\n\n✨ Speaking clearly\n📚 Fun stories\n🎤 Pronunciation games\n💪 Being super confident\n🎯 Awesome presentations\n\nWhat’s your next adventure? 🚀",
      melloTip: "Ask me anything you’re curious about! I’m your English buddy! 😄✨",
    },
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      melloTip: "Wow, great question! Keep chatting to learn more! 🌟",
    }

    setMessages([...messages, userMessage])
    setInputMessage("")
    setIsTyping(true)
    setStarCount((prev) => prev + 1)
    setShowConfetti(true)

    setTimeout(() => {
      const input = inputMessage.toLowerCase()
      let responseData = aiResponses.default

      if (input.includes("clear") || input.includes("clarity")) {
        responseData = aiResponses.clear
      } else if (input.includes("story") || input.includes("read")) {
        responseData = aiResponses.story
      } else if (input.includes("confident") || input.includes("confidence")) {
        responseData = aiResponses.confident
      } else if (input.includes("pronunciation") || input.includes("pronounce")) {
        responseData = aiResponses.pronunciation
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        text: responseData.response,
        sender: "ai",
        timestamp: new Date(),
        melloTip: responseData.melloTip,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      setShowConfetti(false)
    }, 1500)
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  // Confetti animation effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#1E3A8A" }}>
      {/* CSS for Typewriter Effect */}
      <style>
        {`
          .typewriter {
            overflow: hidden;
            white-space: nowrap;
            animation: typing 2s steps(40, end);
          }
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
        `}
      </style>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <Star
          className="absolute top-10 left-10 w-5 h-5 animate-pulse"
          style={{ color: "#FFD600", animationDelay: "0s" }}
        />
        <Heart
          className="absolute top-40 right-20 w-6 h-6 animate-pulse"
          style={{ color: "#FFD600", animationDelay: "0.5s" }}
        />
        <Sparkles
          className="absolute bottom-40 left-40 w-5 h-5 animate-pulse"
          style={{ color: "#FFD600", animationDelay: "1s" }}
        />
        <Star
          className="absolute bottom-20 right-40 w-6 h-6 animate-pulse"
          style={{ color: "#FFD600", animationDelay: "1.5s" }}
        />
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ["#FFD600", "#3B82F6", "#00B9FC"][Math.floor(Math.random() * 3)],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -1000],
                opacity: [1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header
        className="backdrop-blur-lg border-b sticky top-0 z-50"
        style={{
          background: "rgba(30, 58, 138, 0.95)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="transition-all duration-300 hover:bg-white/10 hover:text-amber-300"
                style={{ color: "#F2F6FF" }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold tracking-tight" style={{ color: "#F2F6FF" }}>
                Chat with AI Coach 🤖✨
              </h1>
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 text-[#FFD600] fill-[#FFD600]" />
                <span className="text-sm text-[#F2F6FF]">{starCount} Stars Earned</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Main Chat Card */}
        <Card
          className="h-[calc(100vh-300px)] flex flex-col shadow-2xl"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
          }}
        >
          {/* Chat Header */}
          <CardHeader
            className="pb-4"
            style={{
              borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
            }}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                }}
                animate={{ scale: [1, 1.1, 1], y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: "#1E3A8A" }}>
                  AI Speaking Coach
                </h2>
                <p className="text-sm" style={{ color: "rgba(30, 58, 138, 0.7)" }}>
                  Your fun learning buddy! 🌟
                </p>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-6 py-4">
              <div className="space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
                        style={{
                          background:
                            message.sender === "ai" ? "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)" : "#1E3A8A",
                        }}
                      >
                        {message.sender === "ai" ? (
                          <Bot className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className="rounded-2xl px-4 py-3 shadow-sm"
                        style={{
                          background: message.sender === "ai" ? "#F2F6FF" : "#3B82F6",
                          border: "1px solid rgba(59, 130, 246, 0.1)",
                          color: message.sender === "ai" ? "#1E3A8A" : "#FFFFFF",
                        }}
                      >
                        <p className="text-sm font-medium whitespace-pre-line leading-relaxed">{message.text}</p>
                        {message.melloTip && (
                          <p className="text-xs mt-2 italic text-[#FFD600] bg-[#1E3A8A]/10 rounded-lg p-2 typewriter">
                            ✨ Mello’s Tip: {message.melloTip}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
                        }}
                      >
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div
                        className="rounded-2xl px-4 py-3"
                        style={{
                          background: "#F2F6FF",
                          border: "1px solid rgba(59, 130, 246, 0.1)",
                        }}
                      >
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#3B82F6" }} />
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                              background: "#3B82F6",
                              animationDelay: "0.2s",
                            }}
                          />
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                              background: "#3B82F6",
                              animationDelay: "0.4s",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div
              className="px-6 py-4"
              style={{
                borderTop: "1px solid rgba(59, 130, 246, 0.1)",
              }}
            >
              <p className="text-xs mb-3 font-semibold" style={{ color: "rgba(30, 58, 138, 0.7)" }}>
                💡 Fun Questions to Try:
              </p>
              <div className="flex flex-wrap gap-3">
                {quickQuestions.map((q, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(q.text)}
                    className="text-xs transition-all duration-300 hover:scale-105 rounded-xl"
                    style={{
                      background: "#F2F6FF",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      color: "#1E3A8A",
                    }}
                  >
                    <span className="mr-2">{q.icon}</span>
                    {q.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div
            className="p-4"
            style={{
              borderTop: "1px solid rgba(59, 130, 246, 0.1)",
            }}
          >
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="hover:bg-white/10" style={{ color: "#F2F6FF" }}>
                <Mic className="w-6 h-6" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your question here... 💬"
                className="flex-1 rounded-xl text-base"
                style={{
                  background: "#F2F6FF",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  color: "#1E3A8A",
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
                  color: "#FFFFFF",
                }}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Fun Word of the Day */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <Card
            className="mt-6 shadow-xl"
            style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
              border: "none",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">Fun Word of the Day</h3>
              </div>
              <p className="text-2xl font-semibold text-white mb-2">Sparkle ✨</p>
              <p className="text-sm text-white/90 mb-4">
                A word that means to shine brightly, like a star! Try saying it!
              </p>
              <Button
                size="sm"
                className="bg-white text-[#1E3A8A] hover:bg-white/90 rounded-xl px-6 transition-all duration-300 hover:scale-105"
              >
                Practice Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Helper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            {
              icon: Lightbulb,
              title: "Get Tips",
              desc: "Ask for fun speaking tricks",
              color: "#FFD600",
            },
            {
              icon: Star,
              title: "Practice",
              desc: "Try exciting word games",
              color: "#FFD600",
            },
            {
              icon: ThumbsUp,
              title: "Feedback",
              desc: "Hear how awesome you are",
              color: "#FFD600",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
            >
              <Card
                className="p-4 text-center transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  borderRadius: "16px",
                }}
              >
                <item.icon className="w-8 h-8 mx-auto mb-2" style={{ color: item.color }} />
                <h3 className="font-bold mb-1" style={{ color: "#1E3A8A" }}>
                  {item.title}
                </h3>
                <p className="text-xs" style={{ color: "rgba(30, 58, 138, 0.7)" }}>
                  {item.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mello Assistant */}
      <motion.div
        animate={
          messages[messages.length - 1]?.melloTip?.includes("great") ||
          messages[messages.length - 1]?.melloTip?.includes("awesome")
            ? { y: [0, -15, 0], scale: [1, 1.1, 1] }
            : { x: [0, 10, -10, 0] }
        }
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          times:
            messages[messages.length - 1]?.melloTip?.includes("great") ||
            messages[messages.length - 1]?.melloTip?.includes("awesome")
              ? [0, 0.5, 1]
              : [0, 0.33, 0.66, 1],
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 100,
        }}
      >
        <MelloAssistant
          state={
            messages[messages.length - 1]?.melloTip?.includes("great") ||
            messages[messages.length - 1]?.melloTip?.includes("awesome")
              ? "celebrating"
              : "idle"
          }
          message={
            (messages[messages.length - 1]?.melloTip ||
              "Hey there! I'm Mello, your cheerful buddy! 😄 Ask me anything to make your English sparkle! ✨") +
            (messages[messages.length - 1]?.melloTip?.includes("great") ||
            messages[messages.length - 1]?.melloTip?.includes("awesome")
              ? " 🎉"
              : " 😊")
          }
          showMessage={true}
          onMessageDismiss={() => {}}
          position="bottom-right"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
            padding: "12px",
            maxWidth: "300px",
          }}
          messageClassName="typewriter"
        />
      </motion.div>
    </div>
  )
}
