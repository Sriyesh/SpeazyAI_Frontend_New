import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Star, Sparkles, PenTool } from "lucide-react";
import { AboutMe } from "./writing-practice/AboutMe";
import { AboutMyself } from "./writing-practice/AboutMyself";
import { useNavigate, useLocation } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PageHeader } from "./PageHeader";

interface WritingPracticeProps {
  onBack?: () => void;
}

type CombinedView = "topics" | "about-me" | "about-myself" | "adventure-stories" | "favorite-place" | "special-day";

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

// Beginner topics
const beginnerTopics = [
  {
    id: "about-me",
    title: "About Me",
    description: "Tell everyone who you are",
    image: "https://images.unsplash.com/photo-1678822872007-698d622afeb7",
    color: "from-[#3B82F6] to-[#00B9FC]",
    backgroundImage: "/mnt/data/955f16bb-4e9b-45f4-b13f-65430143995e.png",
    type: "beginner" as const,
  },
  {
    id: "about-myself",
    title: "About Myself",
    description: "Share your story",
    image: "https://images.unsplash.com/photo-1704241370920-e67ce744d8cd",
    color: "from-[#00B9FC] to-[#246BCF]",
    backgroundImage: "/mnt/data/f2c4536d-8b89-4763-ba55-302a23efe0b1.png",
    type: "beginner" as const,
  },
];

// Intermediate chapters
const intermediateChapters: (Chapter & { type: "intermediate" })[] = [
  {
    id: "adventure-stories",
    title: "Adventure Stories",
    description: "Write exciting tales of exploration",
    image: "https://images.unsplash.com/photo-1631684181713-e697596d2165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQ3NzMyMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#3B82F6] to-[#00B9FC]",
    type: "intermediate",
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
    type: "intermediate",
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
    type: "intermediate",
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

export function WritingPractice({ onBack }: WritingPracticeProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const backRoute = (location.state as any)?.backRoute || "/writing-modules"
  
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(backRoute)
    }
  }

  const [currentView, setCurrentView] = useState<CombinedView>("topics");
  const [selectedChapter, setSelectedChapter] = useState<typeof intermediateChapters[0] | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleTopicClick = (topicId: string) => {
    setCurrentView(topicId as CombinedView);
  };

  const handleChapterClick = (chapter: typeof intermediateChapters[0]) => {
    setSelectedChapter(chapter);
    setSelectedTopic(null);
    setCurrentView(chapter.id as CombinedView);
  };

  const handleIntermediateTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleBackToTopics = () => {
    setCurrentView("topics");
    setSelectedChapter(null);
    setSelectedTopic(null);
  };

  const handleBackToChapterTopics = () => {
    setSelectedTopic(null);
  };

  // Handle beginner topic views
  if (currentView === "about-me") {
    return <AboutMe onBack={handleBackToTopics} />;
  }
  if (currentView === "about-myself") {
    return <AboutMyself onBack={handleBackToTopics} />;
  }

  // Handle intermediate topic detail view
  if (selectedTopic && selectedChapter) {
    return (
      <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
        <div className="absolute inset-0 -z-10 bg-[#1E3A8A]" />
        <Star className="absolute top-20 right-1/4 w-8 h-8 text-[#FFD600] animate-bounce" />
        <Star className="absolute top-1/3 left-16 w-6 h-6 text-white/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute top-1/4 right-16 w-7 h-7 text-white/70 animate-pulse" />

        {/* Header */}
        <PageHeader />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToChapterTopics}
              className="text-white hover:bg-white/10 hover:text-amber-300 transition-all duration-300 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topics
            </Button>
          </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    );
  }

  // Handle intermediate chapter topics view
  if (selectedChapter && currentView !== "topics") {
    return (
      <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
        <div className="absolute inset-0 -z-10 bg-[#1E3A8A]" />
        <Star className="absolute top-24 right-1/4 w-6 h-6 text-[#FFD600] animate-pulse" />
        <Star className="absolute bottom-32 left-1/3 w-5 h-5 text-white/60 animate-pulse" />
        <Sparkles className="absolute top-1/4 left-12 w-6 h-6 text-white/70 animate-pulse" />

        {/* Header */}
        <PageHeader />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToTopics}
              className="text-white hover:bg-white/10 hover:text-amber-300 transition-all duration-300 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>
          </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <div className="grid md:grid-cols-3 gap-6">
            {selectedChapter.topics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleIntermediateTopicClick(topic)}
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
      </div>
    );
  }

  // Default view: combined beginner topics and intermediate chapters
  return (
    <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
      <div className="absolute inset-0 -z-10 bg-[#1E3A8A]" />
      <Star className="absolute top-24 right-1/4 w-6 h-6 text-[#FFD600] animate-pulse" />
      <Star className="absolute top-1/3 left-20 w-4 h-4 text-white/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
      <Sparkles className="absolute top-1/4 right-12 w-5 h-5 text-white/70 animate-pulse" style={{ animationDelay: "0.7s" }} />
      
      {/* Header */}
      <PageHeader />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:text-[#CFE2FF] hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <PenTool className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl text-white mb-3">Writing Practice</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Choose a writing topic to get started
          </p>
        </div>

        {/* Combined grid: Beginner topics + Intermediate chapters */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Beginner Topics */}
          {beginnerTopics.map((topic, index) => (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <div className="relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-[#FFD600]/40 transition-all h-full">
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    backgroundImage: `url(${topic.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(60%)",
                    borderRadius: "1rem",
                  }}
                ></div>
                <div className="relative mb-6 flex justify-center z-10">
                  <div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${topic.color} shadow-lg flex items-center justify-center group-hover:rotate-6 transition-transform`}
                  >
                    <img src={topic.image} alt={topic.title} className="w-14 h-14 object-cover rounded-full" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#1E3A8A] text-center mb-2 group-hover:text-[#00B9FC] z-10 relative">
                  {topic.title}
                </h3>
                <p className="text-[#1E3A8A]/70 text-center text-lg z-10 relative">
                  {topic.description}
                </p>
                <div className="mt-8 flex justify-center gap-2 z-10 relative">
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6]/40 group-hover:bg-[#3B82F6]" />
                  <div className="w-3 h-3 rounded-full bg-[#00B9FC]/40 group-hover:bg-[#00B9FC]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFD600]/40 group-hover:bg-[#FFD600]" />
                </div>
              </div>
            </div>
          ))}

          {/* Intermediate Chapters */}
          {intermediateChapters.map((chapter, index) => (
            <div
              key={chapter.id}
              onClick={() => handleChapterClick(chapter)}
              className="group cursor-pointer"
              style={{ animationDelay: `${(beginnerTopics.length + index) * 0.1}s` }}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <ImageWithFallback 
                    src={chapter.image}
                    alt={chapter.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Star className="absolute top-4 right-4 w-8 h-8 text-[#FFD600] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl text-[#1E3A8A] mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="text-[#1E3A8A]/70 mb-4 flex-1">
                    {chapter.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
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
            <Star className="w-5 h-5 text-[#FFD600]" />
            <span className="text-white">Let's make writing fun together!</span>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
