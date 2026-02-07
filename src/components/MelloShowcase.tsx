import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface MelloShowcaseProps {
  onBack: () => void;
}

export function MelloShowcase({ onBack }: MelloShowcaseProps) {
  const [currentState, setCurrentState] = useState<
    "idle" | "talking" | "waving" | "celebrating" | "thinking"
  >("idle");
  const [showMessage, setShowMessage] = useState(true);

  const states = [
    {
      state: "idle" as const,
      name: "Idle",
      description: "Mello at rest, gently floating",
      message: "Hi! I'm Mello, your AI learning companion!",
    },
    {
      state: "talking" as const,
      name: "Talking",
      description: "Animated mouth for conversations",
      message:
        "Let me help you learn! I can provide tips and encouragement!",
    },
    {
      state: "waving" as const,
      name: "Waving",
      description: "Friendly greeting animation",
      message: "Welcome back! Ready to practice today? 👋",
    },
    {
      state: "celebrating" as const,
      name: "Celebrating",
      description: "Happy state with sparkles",
      message: "Amazing job! You completed another lesson! 🎉",
    },
    {
      state: "thinking" as const,
      name: "Thinking",
      description: "Processing with animated dots",
      message:
        "Hmm, let me think about the best way to help you...",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#7A3CF4] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-[#4B8BFF] to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#273043] bg-[#0B0F19]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-[#B9C2D0] hover:text-[#7A3CF4]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-white">
              Mello Showcase
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            Meet Mello
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#7A3CF4] to-[#4B8BFF] mx-auto mb-6 rounded-full shadow-lg shadow-[#7A3CF4]/50" />
          <p className="text-xl text-[#B9C2D0] max-w-2xl mx-auto">
            Your friendly AI cloud companion that makes learning
            fun and engaging
          </p>
        </div>

        {/* Current State Display */}
        <Card className="bg-[#141A2A] border-[#273043] mb-12">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Current State:{" "}
              {
                states.find((s) => s.state === currentState)
                  ?.name
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-12">
            <p className="text-[#B9C2D0] text-sm text-center">
              Mello is only available on the Skills Home page.
            </p>
          </CardContent>
        </Card>

        {/* State Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {states.map((stateConfig, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-300 ${
                currentState === stateConfig.state
                  ? "bg-gradient-to-br from-[#7A3CF4]/20 to-[#4B8BFF]/20 border-[#7A3CF4]"
                  : "bg-[#141A2A] border-[#273043] hover:border-[#7A3CF4]/50"
              } hover:scale-105`}
              onClick={() => {
                setCurrentState(stateConfig.state);
                setShowMessage(true);
              }}
            >
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                  {stateConfig.name}
                </h3>
                <p className="text-[#B9C2D0] text-sm mb-4">
                  {stateConfig.description}
                </p>
                <Button className="bg-gradient-to-r from-[#7A3CF4] to-[#4B8BFF] text-white rounded-lg px-4 py-2 text-sm">
                  Try This State
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-[#141A2A] border-[#273043]">
            <CardHeader>
              <CardTitle className="text-white">
                ✨ Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[#B9C2D0]">
              <p>• Smooth floating animation</p>
              <p>• Realistic blinking eyes</p>
              <p>• Sparkle effects in eye shine</p>
              <p>• Glowing neon outline</p>
              <p>• Contextual messages</p>
              <p>• Multiple emotional states</p>
              <p>• Soft pink cheeks for warmth</p>
              <p>• Pulsing ring effect</p>
              <p>• SVG-based cloud character</p>
            </CardContent>
          </Card>

          <Card className="bg-[#141A2A] border-[#273043]">
            <CardHeader>
              <CardTitle className="text-white">
                🎨 Design Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[#B9C2D0]">
              <p>• Cloud-inspired fluffy body</p>
              <p>• Light blue & white gradients</p>
              <p>• Teal-blue expressive eyes</p>
              <p>• Violet/blue neon glow</p>
              <p>• Motion blur effects</p>
              <p>• Spotlight background glow</p>
              <p>• Dark theme optimized</p>
              <p>• Pixar/Duolingo style</p>
              <p>• SVG animation support</p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Info */}
        <Card className="mt-8 bg-gradient-to-br from-[#141A2A] to-[#273043] border-[#7A3CF4]/30">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4 text-center uppercase tracking-wider">
              Mello is Your Learning Companion
            </h3>
            <p className="text-[#B9C2D0] text-center max-w-3xl mx-auto leading-relaxed">
              Mello appears throughout the app to provide
              encouragement, tips, and guidance. With multiple
              emotional states and contextual messages, Mello
              makes learning more engaging and fun for students
              aged 8-18. Click on different states above to see
              Mello in action!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}