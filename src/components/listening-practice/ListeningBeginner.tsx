import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Star, Sparkles, Volume2, Music, Bird } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ListeningBeginnerProps {
  onBack: () => void;
}

type BeginnerView = "chapters" | "simple-sounds" | "short-stories" | "everyday-conversations";

type Topic = {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  exercises: string[];
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
    id: "simple-sounds",
    title: "Simple Sounds",
    description: "Identify everyday sounds around you",
    image: "https://images.unsplash.com/photo-1670371089081-862ee22c7d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBzb3VuZHMlMjBmb3Jlc3R8ZW58MXx8fHwxNzY0ODY5NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#3B82F6] to-[#00B9FC]",
    topics: [
      {
        id: "animal-sounds",
        title: "Animal Sounds",
        description: "Listen and identify animal sounds",
        instructions: [
          "Listen carefully to different animal sounds.",
          "Try to identify which animal makes each sound.",
          "Practice saying the name of each animal you hear.",
        ],
        exercises: [
          "🐶 Listen to a dog barking - Can you say 'woof woof'?",
          "🐱 Hear a cat meowing - Practice saying 'meow meow'!",
          "🐦 Identify bird chirping - Listen to the happy birds!",
          "🐄 Recognize a cow mooing - Say 'moo moo' along!",
          "🐴 Listen to a horse neighing - Can you neigh too?",
        ],
      },
      {
        id: "nature-sounds",
        title: "Nature Sounds",
        description: "Recognize sounds from nature",
        instructions: [
          "Close your eyes and listen to nature sounds.",
          "Imagine where each sound comes from.",
          "Describe what you hear using simple words.",
        ],
        exercises: [
          "🌊 Ocean waves - Listen to the gentle water sounds",
          "🌧️ Raindrops falling - Hear the pitter-patter",
          "💨 Wind blowing - Feel the breeze through sound",
          "⚡ Thunder rumbling - Hear the powerful sound",
          "🌳 Leaves rustling - Listen to the trees dancing",
        ],
      },
      {
        id: "home-sounds",
        title: "Sounds at Home",
        description: "Identify common household sounds",
        instructions: [
          "Listen to everyday sounds from around the house.",
          "Name each object that makes the sound.",
          "Think about when you hear these sounds at home.",
        ],
        exercises: [
          "🚪 Door opening and closing - Hear the creak!",
          "🔔 Doorbell ringing - Ding dong!",
          "📞 Phone ringing - Ring ring!",
          "⏰ Alarm clock beeping - Wake up sound!",
          "🚰 Water running from the tap - Splash splash!",
        ],
      },
    ],
  },
  {
    id: "short-stories",
    title: "Short Stories",
    description: "Listen to fun and simple stories",
    image: "https://images.unsplash.com/photo-1612969307625-3e1a6ec6081a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9yeXRlbGxpbmclMjBib29rJTIwY2hpbGRyZW58ZW58MXx8fHwxNzY0ODcyODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#00B9FC] to-[#246BCF]",
    topics: [
      {
        id: "the-happy-cat",
        title: "The Happy Cat",
        description: "A story about a playful kitten",
        instructions: [
          "Listen to the story about a happy cat named Whiskers.",
          "Pay attention to what Whiskers does each day.",
          "Answer simple questions about the story.",
        ],
        exercises: [
          "Listen: Whiskers wakes up and stretches",
          "Listen: She plays with a ball of yarn",
          "Listen: She drinks milk from her bowl",
          "Question: What is the cat's name?",
          "Question: What does Whiskers play with?",
        ],
      },
      {
        id: "rainy-day-fun",
        title: "Rainy Day Fun",
        description: "What to do when it rains",
        instructions: [
          "Listen to ideas for fun activities on a rainy day.",
          "Imagine doing each activity described.",
          "Think about your favorite rainy day activity.",
        ],
        exercises: [
          "Listen: Drawing colorful pictures",
          "Listen: Reading favorite books",
          "Listen: Building with blocks",
          "Listen: Baking cookies with family",
          "Question: What would you do on a rainy day?",
        ],
      },
      {
        id: "the-friendly-dog",
        title: "The Friendly Dog",
        description: "A tale about making new friends",
        instructions: [
          "Listen to the story of Max the friendly dog.",
          "Notice how Max makes friends in the park.",
          "Think about how to be a good friend.",
        ],
        exercises: [
          "Listen: Max goes to the park",
          "Listen: He sees a new puppy",
          "Listen: They play together happily",
          "Listen: They share a toy",
          "Question: How does Max make friends?",
        ],
      },
    ],
  },
  {
    id: "everyday-conversations",
    title: "Everyday Conversations",
    description: "Simple daily conversations",
    image: "https://images.unsplash.com/photo-1732841700668-4eba867c9179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGxpc3RlbmluZyUyMG11c2ljfGVufDF8fHx8MTc2NDg3Mjg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#246BCF] to-[#1E3A8A]",
    topics: [
      {
        id: "greeting-friends",
        title: "Greeting Friends",
        description: "How to say hello and goodbye",
        instructions: [
          "Listen to different ways people greet each other.",
          "Practice saying hello and goodbye.",
          "Learn polite phrases for meeting friends.",
        ],
        exercises: [
          "Listen: 'Good morning! How are you?'",
          "Listen: 'Hello! Nice to see you!'",
          "Listen: 'Hi there! Want to play?'",
          "Listen: 'Goodbye! See you tomorrow!'",
          "Practice: Say hello to a friend",
        ],
      },
      {
        id: "asking-for-help",
        title: "Asking for Help",
        description: "Polite ways to ask for assistance",
        instructions: [
          "Listen to polite ways to ask for help.",
          "Learn to say 'please' and 'thank you'.",
          "Practice asking questions clearly.",
        ],
        exercises: [
          "Listen: 'Can you help me, please?'",
          "Listen: 'May I ask a question?'",
          "Listen: 'Could you show me how?'",
          "Listen: 'Thank you for helping!'",
          "Practice: Ask for help politely",
        ],
      },
      {
        id: "sharing-feelings",
        title: "Sharing Feelings",
        description: "Talk about how you feel",
        instructions: [
          "Listen to people expressing their feelings.",
          "Learn words for different emotions.",
          "Practice talking about your feelings.",
        ],
        exercises: [
          "Listen: 'I feel happy today!'",
          "Listen: 'I am a little sad.'",
          "Listen: 'I feel excited!'",
          "Listen: 'I am tired now.'",
          "Question: How do you feel today?",
        ],
      },
    ],
  },
];

export function ListeningBeginner({ onBack }: ListeningBeginnerProps) {
  const [currentView, setCurrentView] = useState<BeginnerView>("chapters");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSelectedTopic(null);
    setCurrentView(chapter.id as BeginnerView);
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
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                <ImageWithFallback 
                  src={selectedChapter.image}
                  alt={selectedTopic.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <Volume2 className="absolute -top-2 -right-2 w-5 h-5 text-[#FFD600] animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-white animate-pulse" />
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
              {/* Instructions */}
              <div className="mb-8">
                <h3 className="text-2xl text-[#1E3A8A] mb-4 flex items-center gap-2">
                  <Volume2 className="w-6 h-6 text-[#3B82F6]" />
                  Instructions
                </h3>
                <div className="space-y-3">
                  {selectedTopic.instructions.map((instruction, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] rounded-2xl p-4 border-4 border-[#3B82F6]/20"
                    >
                      <p className="text-lg text-[#1E3A8A]">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercises */}
              <div className="mb-8">
                <h3 className="text-2xl text-[#1E3A8A] mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#FFD600]" />
                  Listening Exercises
                </h3>
                <div className="space-y-4">
                  {selectedTopic.exercises.map((exercise, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-2xl p-5 border-4 border-[#FFD600]/30 hover:scale-102 transition-transform"
                    >
                      <p className="text-lg text-[#1E3A8A]">{exercise}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] px-10 py-5 rounded-full shadow-xl">
                  <Volume2 className="w-8 h-8 text-white animate-pulse" />
                  <span className="text-2xl text-white">Start Listening!</span>
                  <Sparkles className="w-8 h-8 text-[#FFD600]" />
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
                      <Volume2 className="w-8 h-8 text-white" />
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
            <h1 className="text-xl text-white">Beginner Listening</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl text-white mb-4">Choose Your Chapter</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Start your listening journey with fun exercises
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
                  <Volume2 className="absolute top-4 right-4 w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <Volume2 className="w-5 h-5 text-white" />
            <span className="text-white">Listen and have fun learning!</span>
            <Star className="w-5 h-5 text-[#FFD600]" />
          </div>
        </div>
      </div>
    </div>
  );
}
