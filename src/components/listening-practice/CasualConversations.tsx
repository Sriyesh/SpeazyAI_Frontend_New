import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Volume2, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "../PageHeader";
import type { CSSProperties } from "react";

interface CasualConversationsProps {
  onBack?: () => void;
}

type Conversation = {
  id: string;
  title: string;
  description: string;
  content: string[];
  questions: string[];
};

const conversations: Conversation[] = [
  {
    id: "weekend-plans",
    title: "Weekend Plans",
    description: "Friends discussing their weekend activities",
    content: [
      "Alex: Hey, what are you doing this weekend?",
      "Sam: I'm thinking of going to the beach. Want to come?",
      "Alex: That sounds great! What time are you planning to leave?",
      "Sam: Maybe around 10 in the morning. We can grab breakfast first.",
      "Alex: Perfect! I'll bring some snacks and drinks.",
      "Sam: Awesome! It's going to be a fun day."
    ],
    questions: [
      "Where is Sam planning to go?",
      "What time are they leaving?",
      "What will Alex bring?",
      "How do they feel about the weekend?"
    ]
  },
  {
    id: "coffee-meetup",
    title: "Coffee Meetup",
    description: "Organizing a casual coffee hangout",
    content: [
      "Jordan: Want to grab coffee later?",
      "Casey: Sure! Where do you want to go?",
      "Jordan: How about that new café downtown?",
      "Casey: Good choice! I've heard they have amazing pastries.",
      "Jordan: Great! Let's meet there at 3 PM.",
      "Casey: See you then!"
    ],
    questions: [
      "Where are they meeting?",
      "What time is the meetup?",
      "What does Casey mention about the café?",
      "Who suggested the location?"
    ]
  },
  {
    id: "movie-night",
    title: "Movie Night",
    description: "Planning a movie night together",
    content: [
      "Taylor: Want to watch a movie tonight?",
      "Riley: Yes! What kind of movie are you in the mood for?",
      "Taylor: Maybe a comedy? Something light and fun.",
      "Riley: Sounds perfect! I'll bring the popcorn.",
      "Taylor: I'll get some drinks. Should we watch it at your place?",
      "Riley: Sure, my place works! See you at 7."
    ],
    questions: [
      "What type of movie do they want to watch?",
      "Who will bring popcorn?",
      "Where will they watch the movie?",
      "What time is the movie night?"
    ]
  },
  {
    id: "shopping-trip",
    title: "Shopping Trip",
    description: "Friends discussing a shopping adventure",
    content: [
      "Morgan: I need to go shopping this weekend. Want to join?",
      "Avery: Definitely! What are you looking for?",
      "Morgan: Just some new clothes for spring. Maybe we can find some deals.",
      "Avery: Great idea! I need a few things too. Where should we go?",
      "Morgan: Let's check out the mall downtown. They have good stores.",
      "Avery: Perfect! Let's make a day of it."
    ],
    questions: [
      "What does Morgan need?",
      "Why does Avery want to go shopping?",
      "Where will they go shopping?",
      "How long do they plan to shop?"
    ]
  },
  {
    id: "gym-buddy",
    title: "Gym Buddy",
    description: "Encouraging each other to exercise",
    content: [
      "Quinn: Are you going to the gym today?",
      "Sage: I was thinking about it. Want to come with me?",
      "Quinn: Yes! I need some motivation. What time works for you?",
      "Sage: How about 6 PM? We can do a quick workout.",
      "Quinn: Perfect! I'll see you there. Don't forget your water bottle!",
      "Sage: Thanks for the reminder! Let's have a good workout."
    ],
    questions: [
      "When are they going to the gym?",
      "Why does Quinn want to go to the gym?",
      "What does Quinn remind Sage to bring?",
      "How do they feel about working out together?"
    ]
  },
  {
    id: "dinner-plans",
    title: "Dinner Plans",
    description: "Deciding where to have dinner",
    content: [
      "Blake: I'm starving! Want to get dinner?",
      "Cameron: Yes! What are you in the mood for?",
      "Blake: How about pizza? Or maybe Chinese food?",
      "Cameron: Pizza sounds good! There's a great place nearby.",
      "Blake: Awesome! Should we order delivery or eat there?",
      "Cameron: Let's eat there. It's more fun that way!"
    ],
    questions: [
      "What food options did they discuss?",
      "What did they decide on?",
      "How will they have dinner?",
      "Why do they prefer eating at the restaurant?"
    ]
  }
];

export function CasualConversations({ onBack }: CasualConversationsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const backRoute = (location.state as any)?.backRoute || "/listening-modules";
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backRoute);
    }
  };

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  const BLUE_BG: CSSProperties = {
    backgroundColor: "#1E3A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  // Conversation detail view
  if (selectedConversation) {
    return (
      <div className="h-screen flex flex-col relative overflow-x-hidden w-full">
        <div className="absolute inset-0 -z-10" style={BLUE_BG} />
        <PageHeader />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToConversations}
              className="text-white hover:bg-white/10 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Conversations
            </Button>

            <div className="text-center mb-8">
              <h2 className="text-4xl text-white mb-4">{selectedConversation.title}</h2>
              <p className="text-xl text-white/70">{selectedConversation.description}</p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
              <div className="mb-8">
                <h3 className="text-2xl text-[#1E3A8A] mb-4 flex items-center gap-2">
                  <Volume2 className="w-6 h-6 text-[#3B82F6]" />
                  Conversation
                </h3>
                <div className="space-y-4">
                  {selectedConversation.content.map((line, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200"
                    >
                      <p className="text-lg text-[#1E3A8A]">{line}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                <h4 className="text-xl text-[#1E3A8A] mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#FFD600]" />
                  Comprehension Questions
                </h4>
                <ul className="space-y-3">
                  {selectedConversation.questions.map((question, idx) => (
                    <li key={idx} className="flex gap-3 text-[#1E3A8A]">
                      <span className="text-[#3B82F6] flex-shrink-0 font-semibold">{idx + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main conversations list view
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

          <h2 className="text-3xl font-bold text-white mb-8">Casual Conversations</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation)}
                className="bg-white rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">{conversation.title}</h3>
                <p className="text-[#1E3A8A]/70">{conversation.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

