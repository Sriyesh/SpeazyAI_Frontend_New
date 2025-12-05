import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Headphones, Star, Sparkles, Volume2, Radio, Podcast } from "lucide-react";
import { ListeningBeginner } from "./listening-practice/ListeningBeginner";
import { ListeningIntermediate } from "./listening-practice/ListeningIntermediate";
import { ListeningAdvanced } from "./listening-practice/ListeningAdvanced";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";


interface ListeningPracticeProps {
  onBack: () => void;
}

type ListeningView = "levels" | "beginner" | "intermediate" | "advanced";

export function ListeningPractice({ onBack }: ListeningPracticeProps) {
        const navigate = useNavigate();   // <-- add this

  const [currentView, setCurrentView] = useState<ListeningView>("levels");

  const handleLevelClick = (level: ListeningView) => {
    setCurrentView(level);
  };

  const handleBackToLevels = () => {
    setCurrentView("levels");
  };

  if (currentView === "beginner") {
    return <ListeningBeginner onBack={handleBackToLevels} />;
  }

  if (currentView === "intermediate") {
    return <ListeningIntermediate onBack={handleBackToLevels} />;
  }

  if (currentView === "advanced") {
    return <ListeningAdvanced onBack={handleBackToLevels} />;
  }

  // Default levels view
  return (
    <div className="min-h-screen relative bg-[#1E3A8A]">
      <Star className="absolute top-24 right-1/4 w-6 h-6 text-[#FFD600] animate-pulse" />
      <Star className="absolute top-1/3 left-20 w-4 h-4 text-white/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
      <Sparkles className="absolute bottom-1/4 right-12 w-5 h-5 text-white/70 animate-pulse" />

      <header className="bg-[#1E3A8A]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:text-[#CFE2FF] hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl text-white">Listening Practice</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] rounded-full mb-6 shadow-2xl">
            <Headphones className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl text-white mb-4">Choose Your Level</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Improve your listening skills with engaging audio exercises
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Beginner Level */}
          <div
            onClick={() => handleLevelClick("beginner")}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Volume2 className="w-24 h-24 text-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Volume2 className="w-16 h-16 text-white" />
                  </div>
                </div>
                <Star className="absolute top-4 right-4 w-8 h-8 text-[#FFD600] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl text-[#1E3A8A] mb-2 group-hover:text-[#3B82F6] transition-colors">
                  Beginner
                </h3>
                <p className="text-[#1E3A8A]/70 mb-4">
                  Start with simple sounds and short conversations
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]/30 group-hover:bg-[#3B82F6] transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#00B9FC]/30 group-hover:bg-[#00B9FC] transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#FFD600]/30 group-hover:bg-[#FFD600] transition-colors" />
                  </div>
                  <span className="text-sm text-[#1E3A8A]/60">3 Chapters</span>
                </div>
              </div>
            </div>
          </div>

          {/* Intermediate Level */}
          <div
            onClick={() => handleLevelClick("intermediate")}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#00B9FC] to-[#246BCF] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Radio className="w-24 h-24 text-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Radio className="w-16 h-16 text-white" />
                  </div>
                </div>
                <Star className="absolute top-4 right-4 w-8 h-8 text-[#FFD600] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl text-[#1E3A8A] mb-2 group-hover:text-[#3B82F6] transition-colors">
                  Intermediate
                </h3>
                <p className="text-[#1E3A8A]/70 mb-4">
                  Practice with stories and detailed dialogues
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]/30 group-hover:bg-[#3B82F6] transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#00B9FC]/30 group-hover:bg-[#00B9FC] transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#FFD600]/30 group-hover:bg-[#FFD600] transition-colors" />
                  </div>
                  <span className="text-sm text-[#1E3A8A]/60">3 Chapters</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Level */}
          <div
            onClick={() => handleLevelClick("advanced")}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#246BCF] to-[#1E3A8A] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Podcast className="w-24 h-24 text-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Podcast className="w-16 h-16 text-white" />
                  </div>
                </div>
                <Star className="absolute top-4 right-4 w-8 h-8 text-[#FFD600] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl text-[#1E3A8A] mb-2 group-hover:text-[#3B82F6] transition-colors">
                  Advanced
                </h3>
                <p className="text-[#1E3A8A]/70 mb-4">
                  Master complex audio and academic content
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]/30 group-hover:bg-[#3B82F6] transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#00B9FC]/30 group-hover:bg-[#00B9FC] transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#FFD600]/30 group-hover:bg-[#FFD600] transition-colors" />
                  </div>
                  <span className="text-sm text-[#1E3A8A]/60">3 Chapters</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <Headphones className="w-5 h-5 text-white" />
            <span className="text-white">Listen carefully and learn!</span>
            <Star className="w-5 h-5 text-[#FFD600]" />
          </div>
        </div>
      </div>
    </div>
  );
}
