import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Star, Sparkles, MapPin, Calendar, Mountain } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface WritingIntermediateProps {
  onBack: () => void;
}

type IntermediateView = "chapters" | "adventure-stories" | "favorite-place" | "special-day";

type Topic = {
  id: string;
  title: string;
  description: string;
  content: string[];
};

type Chapter = {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
  topics: Topic[];
};

const chapters: Chapter[] = [
  {
    id: "adventure-stories",
    title: "Adventure Stories",
    description: "Write exciting tales of exploration",
    image: "https://images.unsplash.com/photo-1631684181713-e697596d2165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQ3NzMyMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#3B82F6] to-[#00B9FC]",
    topics: [
      {
        id: "treasure-hunt",
        title: "The Treasure Hunt",
        description: "Create an exciting treasure hunting adventure",
        content: [
          "Imagine you found an old map in your attic! The map shows the location of a hidden treasure.",
          "Write about your adventure to find it. Where does the map lead you? What challenges do you face? Do you find the treasure?",
          "Think about: Who goes with you on this adventure? What tools do you need? What surprises do you encounter along the way?",
        ],
      },
      {
        id: "lost-forest",
        title: "Lost in the Forest",
        description: "Write about surviving in the wilderness",
        content: [
          "You went on a hiking trip and got separated from your group. Now you're alone in a big forest.",
          "Write about how you survive and find your way back. What do you see and hear? How do you stay safe?",
          "Include details about: The sounds of the forest, how you find food and water, and how you feel during this adventure.",
        ],
      },
      {
        id: "time-machine",
        title: "My Time Machine Adventure",
        description: "Travel through time in your writing",
        content: [
          "You discovered a time machine! You can visit any time period in history or go to the future.",
          "Write about your time-traveling adventure. When do you go? What do you see? Who do you meet?",
          "Describe: What the place looks like, interesting people or things you encounter, and what you learn from your journey.",
        ],
      },
    ],
  },
  {
    id: "favorite-place",
    title: "My Favorite Place",
    description: "Describe places that are special to you",
    image: "https://images.unsplash.com/photo-1565523925028-812f891b0e8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjB0cmF2ZWwlMjBkZXN0aW5hdGlvbnxlbnwxfHx8fDE3NjQ3ODI2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#00B9FC] to-[#246BCF]",
    topics: [
      {
        id: "dream-destination",
        title: "My Dream Destination",
        description: "Write about a place you'd love to visit",
        content: [
          "If you could travel anywhere in the world, where would you go? It could be a real place or even an imaginary one!",
          "Describe this special place in detail. What does it look like? What would you do there?",
          "Think about: The weather, the people, the food, the activities, and why this place is so special to you.",
        ],
      },
      {
        id: "secret-hideout",
        title: "My Secret Hideout",
        description: "Describe your perfect hiding spot",
        content: [
          "Everyone needs a special place where they can relax and be themselves. This could be a real place or one you imagine.",
          "Write about your secret hideout. Where is it? What does it look like? What do you keep there?",
          "Include: How you decorated it, what you do there, and why it's important to you.",
        ],
      },
      {
        id: "neighborhood-walk",
        title: "A Walk Through My Neighborhood",
        description: "Explore your surroundings through writing",
        content: [
          "Take a virtual walk through your neighborhood and describe what you see, hear, and smell.",
          "Write about the interesting things in your area. What makes your neighborhood special?",
          "Describe: Your favorite spots, interesting people you see, shops or parks, and what makes it feel like home.",
        ],
      },
    ],
  },
  {
    id: "special-day",
    title: "A Special Day",
    description: "Write about memorable moments",
    image: "https://images.unsplash.com/photo-1650584997985-e713a869ee77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMGJpcnRoZGF5JTIwcGFydHl8ZW58MXx8fHwxNzY0Nzc5NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#246BCF] to-[#1E3A8A]",
    topics: [
      {
        id: "best-birthday",
        title: "My Best Birthday Ever",
        description: "Share your most memorable birthday",
        content: [
          "Think about your favorite birthday celebration. It could be from the past or one you dream about having!",
          "Write about what made it so special. Who was there? What did you do? What gifts did you receive?",
          "Include details about: The decorations, the cake, fun activities, and the best moments that made you smile.",
        ],
      },
      {
        id: "achievement-day",
        title: "The Day I Achieved Something Great",
        description: "Write about your proudest moment",
        content: [
          "Everyone has moments when they accomplish something they worked hard for. Write about one of your achievements!",
          "What did you achieve? How did you prepare for it? How did you feel when you succeeded?",
          "Describe: The challenge you faced, how you overcame it, who helped you, and what you learned from the experience.",
        ],
      },
      {
        id: "surprise-day",
        title: "An Unexpected Surprise",
        description: "Tell about a day full of surprises",
        content: [
          "Sometimes the best days are the ones we don't plan! Write about a day when something unexpected and wonderful happened.",
          "What was the surprise? Who was involved? How did it make you feel?",
          "Think about: How the day started normally, when things changed, what happened, and why it became so memorable.",
        ],
      },
    ],
  },
];

export function WritingIntermediate({ onBack }: WritingIntermediateProps) {
  const [currentView, setCurrentView] = useState<IntermediateView>("chapters");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSelectedTopic(null);
    setCurrentView(chapter.id as IntermediateView);
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleBackToChapters = () => {
    setCurrentView("chapters");
    setSelectedChapter(null);
    setSelectedTopic(null);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  // If a specific topic is selected, render its content
  if (selectedTopic && selectedChapter) {
    return (
      <div className="min-h-screen relative bg-[#1E3A8A]">
        <Star className="absolute top-20 right-1/4 w-8 h-8 text-[#FFD600] animate-bounce" />
        <Star className="absolute top-1/3 left-16 w-6 h-6 text-white/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute top-1/4 right-16 w-7 h-7 text-white/70 animate-pulse" />

        <header className="bg-[#1E3A8A]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToTopics}
                className="text-white hover:bg-white/10 hover:text-amber-300 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Topics
              </Button>
              <h1 className="text-xl text-white">{selectedChapter.title}</h1>
              <div className="w-32" />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Topic header with image */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
<div className="w-16 h-16 mx-auto rounded-full overflow-hidden shadow-lg border-2 border-white">
                <ImageWithFallback 
                  src={selectedChapter.image}
                  alt={selectedTopic.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
            </div>

            <h2 className="text-5xl text-white mb-4">{selectedTopic.title}</h2>
            <p className="text-xl text-white/70">{selectedTopic.description}</p>
          </div>

          {/* Content card */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="h-6 bg-gradient-to-r from-[#3B82F6] via-[#00B9FC] to-[#FFD600] relative">
              <div className="absolute inset-0 flex justify-around items-center">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full" />
                ))}
              </div>
            </div>

            <div className="p-10 md:p-14">
              <div className="space-y-6">
                {selectedTopic.content.map((paragraph, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] rounded-2xl p-6 border-4 border-[#3B82F6]/20"
                  >
                    <p className="text-lg text-[#1E3A8A] leading-relaxed">{paragraph}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] px-10 py-5 rounded-full shadow-xl">
                  <Star className="w-8 h-8 text-[#FFD600] animate-spin" style={{ animationDuration: "3s" }} />
                  <span className="text-2xl text-white">Start Writing Your Story!</span>
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
            </div>

            <div className="h-6 bg-gradient-to-r from-[#FFD600] via-[#00B9FC] to-[#3B82F6]" />
          </div>
        </div>
      </div>
    );
  }

  // If a chapter is selected, show its topics
  if (selectedChapter && currentView !== "chapters") {
    return (
      <div className="min-h-screen relative bg-[#1E3A8A]">
        <Star className="absolute top-24 right-1/4 w-6 h-6 text-[#FFD600] animate-pulse" />
        <Star className="absolute bottom-32 left-1/3 w-5 h-5 text-white/60 animate-pulse" />
        <Sparkles className="absolute top-1/4 left-12 w-6 h-6 text-white/70 animate-pulse" />

        <header className="bg-[#1E3A8A]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToChapters}
                className="text-white hover:bg-white/10 hover:text-amber-300 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chapters
              </Button>
              <h1 className="text-xl text-white">{selectedChapter.title}</h1>
              <div className="w-32" />
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Chapter header with image */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl border-8 border-white">
                <ImageWithFallback 
                  src={selectedChapter.image}
                  alt={selectedChapter.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <Star className="absolute -top-4 -right-4 w-12 h-12 text-[#FFD600] animate-spin" style={{ animationDuration: "4s" }} />
              <Sparkles className="absolute -bottom-3 -left-3 w-10 h-10 text-white animate-bounce" />
            </div>

            <h2 className="text-5xl text-white mb-4">{selectedChapter.title}</h2>
            <p className="text-xl text-white/70">{selectedChapter.description}</p>
          </div>

          {/* Topic tiles */}
          <div className="grid md:grid-cols-3 gap-6">
            {selectedChapter.topics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${selectedChapter.color}`} />
                  
                  <div className="mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${selectedChapter.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-3xl text-white">{index + 1}</span>
                    </div>
                  </div>

                  <h3 className="text-xl text-[#1E3A8A] text-center mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-[#1E3A8A]/70 text-center">
                    {topic.description}
                  </p>

                  <div className="mt-4 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6]/30 group-hover:bg-[#3B82F6] transition-colors" />
                    <div className="w-2 h-2 rounded-full bg-[#00B9FC]/30 group-hover:bg-[#00B9FC] transition-colors" />
                    <div className="w-2 h-2 rounded-full bg-[#FFD600]/30 group-hover:bg-[#FFD600] transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default view: chapters selection
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
              onClick={onBack}
              className="text-white hover:bg-white/10 hover:text-amber-300 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Levels
            </Button>
            <h1 className="text-xl text-white">Intermediate Writing</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl text-white mb-4">Choose Your Writing Topic</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Select a chapter to start your creative writing journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              onClick={() => handleChapterClick(chapter)}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-48 overflow-hidden relative">
                  <ImageWithFallback 
                    src={chapter.image}
                    alt={chapter.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Star className="absolute top-4 right-4 w-8 h-8 text-[#FFD600] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl text-[#1E3A8A] mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="text-[#1E3A8A]/70 mb-4">
                    {chapter.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#3B82F6]/30 group-hover:bg-[#3B82F6] transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-[#00B9FC]/30 group-hover:bg-[#00B9FC] transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-[#FFD600]/30 group-hover:bg-[#FFD600] transition-colors" />
                    </div>
                    <span className="text-sm text-[#1E3A8A]/60">{chapter.topics.length} Topics</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white">Let your creativity shine!</span>
            <Star className="w-5 h-5 text-[#FFD600]" />
          </div>
        </div>
      </div>
    </div>
  );
}
