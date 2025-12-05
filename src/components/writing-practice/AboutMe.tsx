import { Button } from "../ui/button";
import { ArrowLeft, Star, Sparkles, Heart, Smile, Home } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface AboutMeProps {
  onBack: () => void;
}

export function AboutMe({ onBack }: AboutMeProps) {
  const cards = [
    {
      title: "My Name",
      text: "Start by writing your name! Tell us what you like to be called.",
      example: "My name is Emma, and everyone calls me Em!",
      image: "https://cdn-icons-png.flaticon.com/512/2922/2922561.png",
      bg: "from-[#DBEAFE] to-[#BFDBFE]",
    },
    {
      title: "How Old Am I?",
      text: "Share your age and when your birthday is!",
      example: "I am 8 years old and I love summer birthdays!",
      image: "https://cdn-icons-png.flaticon.com/512/3082/3082031.png",
      bg: "from-[#FEF3C7] to-[#FDE68A]",
    },
    {
      title: "My Family",
      text: "Tell us about the people and pets in your family!",
      example: "I live with my mom, dad, little brother and a puppy named Coco!",
      image: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
      bg: "from-[#FECACA] to-[#FCA5A5]",
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#1E3A8A] overflow-x-hidden">

      {/* Floating decorative stars */}
      <Star className="absolute top-20 right-24 w-6 h-6 text-[#FFD600] animate-pulse opacity-80" />
      <Star className="absolute top-1/3 left-10 w-5 h-5 text-white/60 animate-bounce" />
      <Sparkles className="absolute top-1/4 right-10 w-6 h-6 text-white/80 animate-pulse" />
      <Sparkles className="absolute bottom-1/3 left-14 w-6 h-6 text-white/80 animate-bounce" />

      {/* Header */}
      <header className="bg-[#1E3A8A]/90 backdrop-blur-xl sticky top-0 z-50 shadow-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 hover:text-amber-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topics
            </Button>

            <h1 className="text-xl font-bold text-white tracking-wide">About Me</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Top Title Section */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white ring-4 ring-[#FFD600] animate-[float_3s_ease-in-out_infinite]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1704241370920-e67ce744d8cd"
                alt="Happy child reading"
                className="w-full h-full object-cover"
              />
            </div>

            <Star className="absolute -top-2 -right-3 w-6 h-6 text-[#FFD600] animate-spin" />
            <Heart className="absolute -bottom-2 -left-3 w-6 h-6 text-pink-400 animate-pulse" />
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            All About Me
          </h2>
          <p className="text-lg text-white/80 mt-2">
            A wonderful writing adventure all about YOU!
          </p>
        </div>

        {/* Cards Container */}
        <div className="bg-white rounded-[2rem] shadow-2xl relative overflow-hidden">

          {/* Decorative Top Bar */}
          <div className="h-6 bg-gradient-to-r from-[#3B82F6] via-[#00B9FC] to-[#FFD600] flex justify-around items-center px-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full" />
            ))}
          </div>

          {/* Cards */}
          <div className="p-10 space-y-6">
            {cards.map((item, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white py-6 px-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-6"
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center shadow-md overflow-hidden`}
                >
                  <img src={item.image} className="object-cover w-14 h-14" />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1E3A8A]">{item.title}</h3>
                  <p className="text-lg text-[#1E3A8A] mt-1">{item.text}</p>

                  <div className="mt-2 flex gap-2 items-center">
                    <Star className="w-4 h-4 text-[#FFD600]" />
                    <span className="text-sm italic text-[#1E3A8A]/80">{item.example}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Star Reward Footer */}
        <div className="mt-12 text-center">
          <p className="text-lg text-white/70 mb-4">You’re a shining writer!</p>

          <div className="flex justify-center gap-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-[#FFD600] animate-bounce" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
