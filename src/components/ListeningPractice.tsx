import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Headphones, Star, Sparkles, Volume2, Radio } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "./PageHeader";
import type { CSSProperties } from "react";

// Import chapter types from ListeningBeginner and ListeningIntermediate
type Topic = {
  id: string;
  title: string;
  description: string;
  instructions?: string[];
  exercises?: string[];
  content?: string[];
  questions?: string[];
};

type Chapter = {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
  topics: Topic[];
  type: "beginner" | "intermediate";
};

// Beginner chapters
const beginnerChapters: Chapter[] = [
  {
    id: "simple-sounds",
    title: "Simple Sounds",
    description: "Identify everyday sounds around you",
    image: "https://images.unsplash.com/photo-1670371089081-862ee22c7d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBzb3VuZHMlMjBmb3Jlc3R8ZW58MXx8fHwxNzY0ODY5NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#3B82F6] to-[#00B9FC]",
    type: "beginner",
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
    ],
  },
  {
    id: "short-stories",
    title: "Short Stories",
    description: "Listen to fun and simple stories",
    image: "https://images.unsplash.com/photo-1612969307625-3e1a6ec6081a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9yeXRlbGxpbmclMjBib29rJTIwY2hpbGRyZW58ZW58MXx8fHwxNzY0ODcyODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#00B9FC] to-[#246BCF]",
    type: "beginner",
    topics: [
      {
        id: "the-happy-cat",
        title: "The Happy Cat",
        description: "A story about a playful kitten",
        instructions: [
          "Listen to the story carefully.",
          "Try to remember the main character.",
          "Think about what happens in the story.",
        ],
        exercises: [
          "Listen: 'Once upon a time, there was a happy cat named Fluffy.'",
          "Listen: 'Fluffy loved to play in the garden every day.'",
          "Listen: 'One sunny morning, Fluffy found a shiny red ball.'",
          "Question: What was the cat's name?",
        ],
      },
    ],
  },
  {
    id: "everyday-conversations",
    title: "Everyday Conversations",
    description: "Practice listening to daily dialogues",
    image: "https://images.unsplash.com/photo-1657819466043-2a4ae992f03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZXJzYXRpb24lMjBwZW9wbGUlMjB0YWxraW5nfGVufDF8fHx8MTc2NDg0MTU5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#246BCF] to-[#1E3A8A]",
    type: "beginner",
    topics: [
      {
        id: "greetings",
        title: "Greetings",
        description: "Learn common greetings",
        instructions: [
          "Listen to how people greet each other.",
          "Practice saying the greetings out loud.",
          "Try using them in conversations.",
        ],
        exercises: [
          "Listen: 'Hello! How are you today?'",
          "Listen: 'I feel happy today!'",
          "Listen: 'I am a little sad.'",
          "Question: How do you feel today?",
        ],
      },
    ],
  },
];

// Intermediate chapters
const intermediateChapters: Chapter[] = [
  {
    id: "story-time",
    title: "Story Time",
    description: "Listen to engaging narratives",
    image: "https://images.unsplash.com/photo-1612969307625-3e1a6ec6081a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9yeXRlbGxpbmclMjBib29rJTIwY2hpbGRyZW58ZW58MXx8fHwxNzY0ODcyODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#3B82F6] to-[#00B9FC]",
    type: "intermediate",
    topics: [
      {
        id: "the-magical-garden",
        title: "The Magical Garden",
        description: "A story about a secret garden",
        content: [
          "Listen to the story of Emma who discovers a hidden garden behind her school. In this garden, flowers bloom in every color of the rainbow, and the trees whisper ancient secrets.",
          "Emma visits the garden every day after class. She learns that the garden has been there for hundreds of years, protected by a friendly old oak tree.",
          "One day, Emma brings her best friend to see the magical place. Together, they plant new flowers and promise to keep the garden's secret safe.",
        ],
        questions: [
          "What did Emma discover behind her school?",
          "Who protected the garden?",
          "What did Emma and her friend plant together?",
          "Why was the garden special?",
        ],
      },
      {
        id: "the-brave-explorer",
        title: "The Brave Explorer",
        description: "An adventure across mountains",
        content: [
          "Join Alex on an exciting mountain adventure. Alex is a young explorer who loves discovering new places and learning about nature.",
          "During the journey, Alex encounters various wildlife, crosses sparkling streams, and climbs rocky paths. Each step brings a new discovery.",
          "At the mountain's peak, Alex finds a beautiful valley filled with wildflowers. The view is breathtaking, and Alex realizes that the journey was just as important as the destination.",
        ],
        questions: [
          "Who is the main character in this story?",
          "What does Alex love to do?",
          "What did Alex find at the mountain's peak?",
          "What lesson did Alex learn?",
        ],
      },
    ],
  },
  {
    id: "dialogues",
    title: "Conversations",
    description: "Real-life dialogue practice",
    image: "https://images.unsplash.com/photo-1657819466043-2a4ae992f03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZXJzYXRpb24lMjBwZW9wbGUlMjB0YWxraW5nfGVufDF8fHx8MTc2NDg0MTU5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#00B9FC] to-[#246BCF]",
    type: "intermediate",
    topics: [
      {
        id: "at-the-library",
        title: "At the Library",
        description: "Borrowing books conversation",
        content: [
          "Student: 'Excuse me, I'm looking for books about space.'",
          "Librarian: 'Wonderful! The space books are in the science section. Let me show you where that is.'",
          "Student: 'Thank you so much! How long can I keep the books?'",
          "Librarian: 'You can borrow them for two weeks. If you need more time, just come back and we can extend the loan period.'",
        ],
        questions: [
          "What is the student looking for?",
          "Where are the books located?",
          "How long can books be borrowed?",
          "What can the student do if they need more time?",
        ],
      },
      {
        id: "ordering-food",
        title: "Ordering Food",
        description: "Restaurant conversation practice",
        content: [
          "Waiter: 'Good evening! Have you decided what you'd like to order?'",
          "Customer: 'Yes, I'll have the grilled chicken with vegetables, please.'",
          "Waiter: 'Excellent choice! Would you like anything to drink?'",
          "Customer: 'A glass of water would be great, thank you.'",
          "Waiter: 'Perfect! Your order will be ready in about 15 minutes.'",
        ],
        questions: [
          "What did the customer order?",
          "What drink did the customer ask for?",
          "How long will the order take?",
        ],
      },
    ],
  },
];

type CombinedView = "chapters" | string;

interface ListeningPracticeProps {
  onBack?: () => void;
}

export function ListeningPractice({ onBack }: ListeningPracticeProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const backRoute = (location.state as any)?.backRoute || "/listening-modules"
  
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(backRoute)
    }
  }

  const [currentView, setCurrentView] = useState<CombinedView>("chapters");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSelectedTopic(null);
    setCurrentView(chapter.id);
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

  const BLUE_BG: CSSProperties = {
    backgroundColor: "#1E3A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  // Topic detail view
  if (selectedTopic && selectedChapter) {
    return (
      <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
        <div className="absolute inset-0 -z-10" style={BLUE_BG} />
        <PageHeader />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToTopics}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topics
            </Button>

            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <ImageWithFallback 
                    src={selectedChapter.image}
                    alt={selectedTopic.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Volume2 className="absolute -top-2 -right-2 w-5 h-5 text-[#FFD600] animate-pulse" />
              </div>
              <h2 className="text-4xl text-white mb-4">{selectedTopic.title}</h2>
              <p className="text-xl text-white/70">{selectedTopic.description}</p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
              {selectedTopic.instructions && (
                <div className="mb-8">
                  <h3 className="text-2xl text-[#1E3A8A] mb-4 flex items-center gap-2">
                    <Volume2 className="w-6 h-6 text-[#3B82F6]" />
                    Instructions
                  </h3>
                  <div className="space-y-3">
                    {selectedTopic.instructions.map((instruction, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                        <p className="text-lg text-[#1E3A8A]">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTopic.exercises && (
                <div className="mb-8">
                  <h3 className="text-2xl text-[#1E3A8A] mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-[#FFD600]" />
                    Listening Exercises
                  </h3>
                  <div className="space-y-4">
                    {selectedTopic.exercises.map((exercise, idx) => (
                      <div key={idx} className="bg-yellow-50 rounded-2xl p-5 border-2 border-yellow-200">
                        <p className="text-lg text-[#1E3A8A]">{exercise}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTopic.content && (
                <div className="space-y-6 mb-8">
                  {selectedTopic.content.map((paragraph, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                      <p className="text-lg text-[#1E3A8A] leading-relaxed">{paragraph}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedTopic.questions && (
                <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                  <h4 className="text-xl text-[#1E3A8A] mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-[#FFD600]" />
                    Comprehension Questions
                  </h4>
                  <ul className="space-y-3">
                    {selectedTopic.questions.map((question, idx) => (
                      <li key={idx} className="flex gap-3 text-[#1E3A8A]">
                        <span className="text-[#3B82F6] flex-shrink-0 font-semibold">{idx + 1}.</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chapter topics view
  if (selectedChapter && currentView !== "chapters") {
    return (
      <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
        <div className="absolute inset-0 -z-10" style={BLUE_BG} />
        <PageHeader />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToChapters}
              className="text-white hover:bg-white/10 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>

            <h2 className="text-3xl font-bold text-white mb-8">{selectedChapter.title}</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedChapter.topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => handleTopicClick(topic)}
                  className="bg-white rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">{topic.title}</h3>
                  <p className="text-[#1E3A8A]/70">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main chapters view - showing both beginner and intermediate
  return (
    <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
      <div className="absolute inset-0 -z-10" style={BLUE_BG} />
      <PageHeader />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h2 className="text-3xl font-bold text-white mb-8">Listening Practice</h2>

          {/* Beginner Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-white mb-6">Beginner</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beginnerChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter)}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className={`h-32 bg-gradient-to-br ${chapter.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Volume2 className="w-16 h-16 text-white/30" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-[#1E3A8A] mb-2">{chapter.title}</h4>
                    <p className="text-[#1E3A8A]/70 text-sm">{chapter.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Intermediate Section */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">Intermediate</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {intermediateChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter)}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className={`h-32 bg-gradient-to-br ${chapter.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Radio className="w-16 h-16 text-white/30" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-[#1E3A8A] mb-2">{chapter.title}</h4>
                    <p className="text-[#1E3A8A]/70 text-sm">{chapter.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
