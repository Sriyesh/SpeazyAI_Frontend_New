import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Volume2, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "../PageHeader";
import type { CSSProperties } from "react";

interface OfficialConversationsProps {
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
    id: "job-interview",
    title: "Job Interview",
    description: "Professional interview conversation",
    content: [
      "Interviewer: Good morning! Thank you for coming in today.",
      "Candidate: Good morning! Thank you for this opportunity.",
      "Interviewer: Could you tell me a bit about your background?",
      "Candidate: Certainly. I have five years of experience in marketing, and I'm excited about this role.",
      "Interviewer: That's excellent. What skills do you think you'd bring to our team?",
      "Candidate: I'm very organized, a good communicator, and I work well in teams."
    ],
    questions: [
      "What is the candidate's experience?",
      "How many years of experience does the candidate have?",
      "What skills does the candidate mention?",
      "What is the tone of the conversation?"
    ]
  },
  {
    id: "business-meeting",
    title: "Business Meeting",
    description: "Team discussing project updates",
    content: [
      "Manager: Let's start today's meeting. Sarah, can you update us on the project?",
      "Sarah: Of course. We're making good progress. We've completed phase one ahead of schedule.",
      "Manager: That's great news! What about phase two?",
      "Sarah: We should begin phase two next week. I'll send everyone the timeline.",
      "Manager: Perfect. Does anyone have questions or concerns?",
      "Team Member: Everything looks good. We're ready to proceed."
    ],
    questions: [
      "What is the meeting about?",
      "How is the project progressing?",
      "When will phase two begin?",
      "What will Sarah send to the team?"
    ]
  },
  {
    id: "customer-service",
    title: "Customer Service",
    description: "Handling a customer inquiry",
    content: [
      "Agent: Good afternoon, how can I assist you today?",
      "Customer: Hello, I have a question about my recent order.",
      "Agent: I'd be happy to help. Can you provide me with your order number?",
      "Customer: Yes, it's ORD-12345.",
      "Agent: Thank you. I can see your order was shipped yesterday. It should arrive by Friday.",
      "Customer: That's perfect. Thank you for your help!"
    ],
    questions: [
      "What is the customer asking about?",
      "What information does the agent need?",
      "When was the order shipped?",
      "When will the order arrive?"
    ]
  },
  {
    id: "conference-call",
    title: "Conference Call",
    description: "Multi-party business discussion",
    content: [
      "Host: Welcome everyone. Let's begin today's call. First, let's go around and introduce ourselves.",
      "Participant 1: Hi, I'm John from the sales department. Looking forward to our discussion.",
      "Participant 2: Hello, I'm Maria from marketing. I'm excited to share our ideas.",
      "Host: Thank you both. Let's start with the agenda. Our main topic is the new product launch.",
      "Participant 1: Great! I have some updates on the sales strategy.",
      "Host: Excellent. Let's hear from you first, John."
    ],
    questions: [
      "What is the purpose of the call?",
      "Who are the participants?",
      "What is the main topic?",
      "Who will speak first about updates?"
    ]
  },
  {
    id: "performance-review",
    title: "Performance Review",
    description: "Annual employee evaluation",
    content: [
      "Supervisor: Thank you for meeting with me today. Let's review your performance this year.",
      "Employee: Thank you. I've been working hard and I'm eager to hear your feedback.",
      "Supervisor: You've done excellent work. Your projects have been very successful.",
      "Employee: I'm glad to hear that. Are there areas where I can improve?",
      "Supervisor: I'd suggest focusing more on time management. Otherwise, keep up the great work.",
      "Employee: I'll work on that. Thank you for the feedback."
    ],
    questions: [
      "What is the purpose of the meeting?",
      "How is the employee's performance?",
      "What area needs improvement?",
      "How does the employee respond to feedback?"
    ]
  },
  {
    id: "contract-negotiation",
    title: "Contract Negotiation",
    description: "Discussing business terms",
    content: [
      "Representative 1: Thank you for coming. We're interested in partnering with your company.",
      "Representative 2: We're excited about this opportunity too. Let's discuss the terms.",
      "Representative 1: We're proposing a two-year contract with quarterly reviews.",
      "Representative 2: That sounds reasonable. What about the payment schedule?",
      "Representative 1: We're suggesting monthly payments, with a discount for annual payment.",
      "Representative 2: That works for us. Let's proceed with the paperwork."
    ],
    questions: [
      "What are they discussing?",
      "How long is the proposed contract?",
      "What payment options are mentioned?",
      "What will they do next?"
    ]
  }
];

export function OfficialConversations({ onBack }: OfficialConversationsProps) {
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

          <h2 className="text-3xl font-bold text-white mb-8">Official Conversations</h2>

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

