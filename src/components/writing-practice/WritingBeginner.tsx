import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Star, Sparkles } from "lucide-react";
import { AboutMe } from "./AboutMe";
import { AboutMyself } from "./AboutMyself";

interface WritingBeginnerProps {
  onBack: () => void;
}

type BeginnerView = "topics" | "about-me" | "about-myself";

export function WritingBeginner({ onBack }: WritingBeginnerProps) {
  const [currentView, setCurrentView] = useState<BeginnerView>("topics");

  const topics = [
   {
  id: "about-me",
  title: "About Me",
  description: "Tell everyone who you are",
  image: "https://images.unsplash.com/photo-1678822872007-698d622afeb7", // Corrected this line
  color: "from-[#3B82F6] to-[#00B9FC]",
  backgroundImage: "/mnt/data/955f16bb-4e9b-45f4-b13f-65430143995e.png", // Use image uploaded by the user
},

    {
      id: "about-myself",
      title: "About Myself",
      description: "Share your story",
      image:  "https://images.unsplash.com/photo-1704241370920-e67ce744d8cd", 
      color: "from-[#00B9FC] to-[#246BCF]",
      backgroundImage: "/mnt/data/f2c4536d-8b89-4763-ba55-302a23efe0b1.png", // Use image uploaded by the user
    },
  ];

  const handleTopicClick = (topicId: string) => {
    setCurrentView(topicId as BeginnerView);
  };

  const handleBackToTopics = () => {
    setCurrentView("topics");
  };

  if (currentView === "about-me") return <AboutMe onBack={handleBackToTopics} />;
  if (currentView === "about-myself") return <AboutMyself onBack={handleBackToTopics} />;

  return (
    <div className="min-h-screen relative bg-[#1E3A8A]">
      {/* Small decorative stars only */}
      <Star className="absolute top-24 right-1/4 w-6 h-6 text-[#FFD600] animate-pulse" />
      <Star className="absolute top-1/3 left-20 w-4 h-4 text-white/60 animate-pulse" />
      <Sparkles className="absolute top-1/4 right-12 w-5 h-5 text-white/70 animate-pulse" />

      <header className="bg-[#1E3A8A]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 hover:text-yellow-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Levels
            </Button>
            <h1 className="text-xl text-white font-bold">Beginner Writing</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-5xl font-extrabold text-white drop-shadow-md mb-4">
            Let's Write Together!
          </h2>
          <p className="text-xl text-white/80">
            Choose a fun writing topic to get started
          </p>
        </div>

        {/* Topic Cards */}
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto"> {/* Increased gap from 10 to 12 */}
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <div className="relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-[#FFD600]/40 transition-all">

                {/* Background Image */}
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

                {/* Image as Icon */}
                <div className="relative mb-6 flex justify-center z-10">
                  <div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${topic.color} shadow-lg flex items-center justify-center group-hover:rotate-6 transition-transform`}
                  >
                    <img src={topic.image} alt={topic.title} className="w-14 h-14 object-cover rounded-full" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-[#1E3A8A] text-center mb-2 group-hover:text-[#00B9FC] z-10">
                  {topic.title}
                </h3>
                <p className="text-[#1E3A8A]/70 text-center text-lg z-10">
                  {topic.description}
                </p>

                {/* Decorative bullets */}
                <div className="mt-8 flex justify-center gap-2 z-10">
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6]/40 group-hover:bg-[#3B82F6]" />
                  <div className="w-3 h-3 rounded-full bg-[#00B9FC]/40 group-hover:bg-[#00B9FC]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFD600]/40 group-hover:bg-[#FFD600]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Encouragement message */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 px-8 py-4 rounded-full border border-white/30 backdrop-blur-sm">
            <Star className="w-6 h-6 text-[#FFD600] animate-spin" />
            <span className="text-lg text-white font-semibold">You're going to do great!</span>
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
