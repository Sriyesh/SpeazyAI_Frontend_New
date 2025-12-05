import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Star, Sparkles, Radio, BookOpen, Users } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ListeningIntermediateProps {
  onBack: () => void;
}

type IntermediateView = "chapters" | "story-time" | "dialogues" | "instructions";

type Topic = {
  id: string;
  title: string;
  description: string;
  content: string[];
  questions: string[];
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
    id: "story-time",
    title: "Story Time",
    description: "Listen to engaging narratives",
    image: "https://images.unsplash.com/photo-1612969307625-3e1a6ec6081a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9yeXRlbGxpbmclMjBib29rJTIwY2hpbGRyZW58ZW58MXx8fHwxNzY0ODcyODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#3B82F6] to-[#00B9FC]",
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
      {
        id: "the-time-capsule",
        title: "The Time Capsule",
        description: "Discovering treasures from the past",
        content: [
          "Listen as Sarah and her classmates bury a time capsule in their school yard. They fill it with photos, drawings, letters, and small treasures that represent their lives today.",
          "Each student writes a letter to their future self, sharing their dreams and wishes. They carefully seal the capsule and mark the spot with a special stone.",
          "The principal announces that the capsule will be opened in twenty years. The students can't wait to see how much they will have changed and grown.",
        ],
        questions: [
          "What did the students put in the time capsule?",
          "What did each student write?",
          "When will the capsule be opened?",
          "Why did they mark the spot with a stone?",
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
    topics: [
      {
        id: "at-the-library",
        title: "At the Library",
        description: "Borrowing books conversation",
        content: [
          "Student: 'Excuse me, I'm looking for books about space.'",
          "Librarian: 'Wonderful! The space books are in the science section. Let me show you where that is.'",
          "Student: 'Thank you! Can I borrow three books?'",
          "Librarian: 'Yes, you can borrow up to five books for two weeks. Would you like a library card if you don't have one?'",
          "Student: 'Yes, please! How do I get one?'",
        ],
        questions: [
          "What kind of books was the student looking for?",
          "How many books can students borrow?",
          "For how long can books be borrowed?",
          "What did the librarian offer the student?",
        ],
      },
      {
        id: "planning-a-party",
        title: "Planning a Party",
        description: "Friends organize a celebration",
        content: [
          "Maya: 'Let's plan a surprise party for Tom's birthday!'",
          "Jake: 'Great idea! When is his birthday?'",
          "Maya: 'It's next Saturday. We should have it at the park.'",
          "Jake: 'Perfect! I'll bring decorations and we can organize games.'",
          "Maya: 'I'll make invitations and ask everyone to bring food to share. This will be so much fun!'",
        ],
        questions: [
          "Who are they planning a party for?",
          "When is the birthday?",
          "Where will the party be?",
          "What will Jake bring?",
        ],
      },
      {
        id: "at-the-store",
        title: "At the Store",
        description: "Shopping conversation",
        content: [
          "Cashier: 'Hello! Did you find everything you were looking for?'",
          "Customer: 'Yes, thank you. I found this notebook and these pens.'",
          "Cashier: 'Wonderful! The notebook is on sale today - it's 20% off.'",
          "Customer: 'That's great! Can I pay with a card?'",
          "Cashier: 'Of course. Your total is $8.50. Would you like a bag?'",
        ],
        questions: [
          "What did the customer buy?",
          "What was on sale?",
          "How much was the discount?",
          "What was the total price?",
        ],
      },
    ],
  },
  {
    id: "instructions",
    title: "Following Instructions",
    description: "Listen and follow directions",
    image: "https://images.unsplash.com/photo-1732841700668-4eba867c9179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGxpc3RlbmluZyUyMG11c2ljfGVufDF8fHx8MTc2NDg3Mjg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#246BCF] to-[#1E3A8A]",
    topics: [
      {
        id: "making-lemonade",
        title: "How to Make Lemonade",
        description: "Follow a simple recipe",
        content: [
          "First, gather your ingredients: fresh lemons, sugar, water, and ice.",
          "Cut four lemons in half and squeeze them to get the juice. Remove any seeds.",
          "In a large pitcher, mix the lemon juice with half a cup of sugar. Stir until the sugar dissolves.",
          "Add four cups of cold water and stir well. Taste and add more sugar if needed.",
          "Serve in glasses with ice and enjoy your refreshing homemade lemonade!",
        ],
        questions: [
          "What ingredients do you need?",
          "How many lemons do you use?",
          "When do you add the water?",
          "What do you add last?",
        ],
      },
      {
        id: "origami-boat",
        title: "Making an Origami Boat",
        description: "Paper folding instructions",
        content: [
          "Start with a rectangular piece of paper. Place it horizontally in front of you.",
          "Fold the paper in half from top to bottom, making a crease.",
          "Fold the top corners down to meet at the center line, forming a triangle shape at the top.",
          "Fold the bottom edges up on both sides, creating a hat shape.",
          "Open the bottom and flatten it into a diamond shape. Fold the bottom corners up to make your boat!",
        ],
        questions: [
          "What shape of paper do you start with?",
          "How do you fold the paper first?",
          "What do you make with the top corners?",
          "What is the final shape?",
        ],
      },
      {
        id: "planting-seeds",
        title: "Planting Garden Seeds",
        description: "Gardening step-by-step",
        content: [
          "Choose a sunny spot in your garden or use a pot with drainage holes.",
          "Fill the pot or garden bed with good quality soil, leaving some space at the top.",
          "Make small holes in the soil about one inch deep. Space them a few inches apart.",
          "Place one or two seeds in each hole and gently cover them with soil.",
          "Water the seeds gently. Keep the soil moist but not too wet. Watch your plants grow!",
        ],
        questions: [
          "What kind of spot should you choose?",
          "How deep should the holes be?",
          "How many seeds go in each hole?",
          "What should you do after planting?",
        ],
      },
    ],
  },
];

export function ListeningIntermediate({ onBack }: ListeningIntermediateProps) {
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

  // Topic detail view
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
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-2xl border-8 border-white">
                <ImageWithFallback 
                  src={selectedChapter.image}
                  alt={selectedTopic.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <Radio className="absolute -top-4 -right-4 w-10 h-10 text-[#FFD600] animate-pulse" />
              <Sparkles className="absolute -bottom-3 -left-3 w-8 h-8 text-white animate-pulse" />
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
              <div className="space-y-6 mb-8">
                {selectedTopic.content.map((paragraph, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] rounded-2xl p-6 border-4 border-[#3B82F6]/20"
                  >
                    <p className="text-lg text-[#1E3A8A] leading-relaxed">{paragraph}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-2xl p-6 border-4 border-[#FFD600]/30">
                <h4 className="text-xl text-[#1E3A8A] mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#FFD600]" />
                  Comprehension Questions
                </h4>
                <ul className="space-y-3">
                  {selectedTopic.questions.map((question, idx) => (
                    <li key={idx} className="flex gap-3 text-[#1E3A8A]/80">
                      <span className="text-[#3B82F6] flex-shrink-0">{idx + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] px-10 py-5 rounded-full shadow-xl">
                  <Radio className="w-8 h-8 text-white animate-pulse" />
                  <span className="text-2xl text-white">Practice Listening!</span>
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

  // Chapter topics view
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

  // Chapters view
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
            <h1 className="text-xl text-white">Intermediate Listening</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl text-white mb-4">Choose Your Chapter</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Enhance your skills with stories and conversations
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
                  <Radio className="absolute top-4 right-4 w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <Radio className="w-5 h-5 text-white" />
            <span className="text-white">Listen and understand!</span>
            <Star className="w-5 h-5 text-[#FFD600]" />
          </div>
        </div>
      </div>
    </div>
  );
}
