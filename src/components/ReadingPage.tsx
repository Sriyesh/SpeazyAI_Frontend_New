"use client";

import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { BookOpen, Layers, Lightbulb } from "lucide-react";

export default function ReadingPage() {
  const BLUE_BG: React.CSSProperties = {
    backgroundColor: "#123A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  return (
    <div className="min-h-screen relative font-[Fredoka]">
      <div className="absolute inset-0 -z-10" style={BLUE_BG} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-8 h-16">
          <h1 className="text-white text-lg font-semibold flex gap-2 items-center">
            <BookOpen className="w-5 h-5 text-white" />
            Reading Skills
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center justify-center px-6 py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl text-white font-extrabold mb-10">
          Dive into Reading 📖
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {/* My Lessons */}
          <Card className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0F1F47] mb-2">My Lessons</h3>
            <p className="text-sm text-[#0F1F47]/70">Track, continue, or revise lessons at your pace.</p>
          </Card>

          {/* Custom Content */}
          <Card className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0F1F47] mb-2">Custom Content</h3>
            <p className="text-sm text-[#0F1F47]/70">Access personalized reading materials and uploads.</p>
          </Card>

          {/* Learn Your Own Way */}
          <Card className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0F1F47] mb-2">Learn Your Own Way</h3>
            <p className="text-sm text-[#0F1F47]/70">Explore flexible content designed around your learning style.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
