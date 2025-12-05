import { Button } from "../ui/button";
import { ArrowLeft, Star, Award } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface AboutMyselfProps {
  onBack: () => void;
}

export function AboutMyself({ onBack }: AboutMyselfProps) {
  return (
    <div className="min-h-screen relative bg-[#1E3A8A]">
      
      {/* Header */}
      <header className="bg-[#1E3A8A]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 hover:text-amber-300 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topics
            </Button>
            <h1 className="text-xl text-white">About Myself</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Small Coin Image */}
        <div className="relative flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-white">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1678822872007-698d622afeb7"
              alt="Child writing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Main Title */}
        <h2 className="text-4xl text-white font-bold text-center mb-2">Discover Myself</h2>
        <p className="text-lg text-white/90 text-center mb-10">
          Share your unique story with the world
        </p>

        {/* Section Cards */}
        <div className="space-y-8">

          {/* SECTION 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md ring-4 ring-blue-100 bg-blue-50 flex items-center justify-center">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1613002864483-7464b6bd442e"
                  alt="Smiling child"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-[#1E3A8A]">What Kind of Person Am I?</h3>
                <p className="text-lg text-[#1E3A8A]/90 mt-1">
                  Are you funny, shy, brave, or helpful? Tell about YOU!
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2 ml-20 text-[#1E3A8A]/70 italic">
              <Star className="w-5 h-5 text-[#FFD600]" />
              Example: "I am friendly and curious. I love making new friends!"
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-yellow-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center shadow-md ring-4 ring-yellow-200">
                <Award className="w-10 h-10 text-yellow-600" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-[#1E3A8A]">What Am I Good At?</h3>
                <p className="text-lg text-[#1E3A8A]/90 mt-1">
                  Everyone has amazing abilities. What is yours?
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2 ml-20 text-[#1E3A8A]/70 italic">
              <Star className="w-5 h-5 text-[#FFD600]" />
              Example: "I’m great at drawing and solving puzzles!"
            </div>
          </div>

          {/* SECTION 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md ring-4 ring-purple-200 bg-purple-50 flex items-center justify-center">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759678444893-9c1762e022fd"
                  alt="Child learning"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-[#1E3A8A]">What I Want to Learn</h3>
                <p className="text-lg text-[#1E3A8A]/90 mt-1">
                  What new skills would you love to learn next?
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2 ml-20 text-[#1E3A8A]/70 italic">
              <Star className="w-5 h-5 text-[#FFD600]" />
              Example: "I want to learn guitar and space science!"
            </div>
          </div>
        </div>

        {/* Bottom encouragement */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500 px-8 py-4 rounded-full shadow-lg">
            <Star className="w-6 h-6 text-[#FFD600]" />
            <span className="text-xl text-white font-bold">You are unique and wonderful!</span>
          </div>
        </div>

      </div>
    </div>
  );
}
