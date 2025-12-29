import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Volume2, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "../PageHeader";
import type { CSSProperties } from "react";

interface FormalConversationsProps {
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
    id: "academic-presentation",
    title: "Academic Presentation",
    description: "Formal presentation at a conference",
    content: [
      "Presenter: Good morning, ladies and gentlemen. Thank you for attending today's session.",
      "Presenter: I'm pleased to present my research on climate change and its global impact.",
      "Audience Member: Excuse me, could you elaborate on the methodology you used?",
      "Presenter: Certainly. We conducted a comprehensive study over three years, analyzing data from multiple sources.",
      "Presenter: Our findings indicate significant trends that require immediate attention.",
      "Audience Member: Thank you for that clarification. The research is quite impressive."
    ],
    questions: [
      "What is the presentation about?",
      "How long was the study conducted?",
      "What does the presenter ask the audience to do?",
      "What is the audience member's opinion of the research?"
    ]
  },
  {
    id: "diplomatic-meeting",
    title: "Diplomatic Meeting",
    description: "Formal diplomatic discussion",
    content: [
      "Ambassador: On behalf of my country, I would like to express our commitment to this partnership.",
      "Counterpart: We appreciate your commitment. Let us work together to achieve our common goals.",
      "Ambassador: We propose establishing a joint committee to oversee the implementation.",
      "Counterpart: That is an excellent suggestion. We will review the proposal and respond formally.",
      "Ambassador: We look forward to your response. This collaboration will benefit both our nations.",
      "Counterpart: Indeed. We share your enthusiasm for this important initiative."
    ],
    questions: [
      "What is the purpose of the meeting?",
      "What do they propose to establish?",
      "How will the counterpart respond?",
      "What is the expected outcome of this collaboration?"
    ]
  },
  {
    id: "legal-consultation",
    title: "Legal Consultation",
    description: "Formal legal advice session",
    content: [
      "Attorney: Good afternoon. Thank you for coming in. How may I assist you today?",
      "Client: I require legal advice regarding a contract matter.",
      "Attorney: I understand. Could you please provide me with the relevant documents?",
      "Client: Certainly. I have brought all the necessary paperwork with me.",
      "Attorney: Thank you. After reviewing these, I will provide you with my professional opinion.",
      "Client: I appreciate your time and expertise. I look forward to your assessment."
    ],
    questions: [
      "What is the client seeking?",
      "What does the attorney request?",
      "What will the attorney do after reviewing?",
      "How does the client respond to the attorney?"
    ]
  },
  {
    id: "university-lecture",
    title: "University Lecture",
    description: "Academic lecture and discussion",
    content: [
      "Professor: Welcome to today's lecture on advanced mathematics. Let's begin with a review of last week's material.",
      "Student: Professor, I have a question about the theorem we discussed.",
      "Professor: Please proceed with your question. I'm happy to clarify.",
      "Student: Could you explain how the theorem applies to real-world problems?",
      "Professor: Excellent question. The theorem has numerous applications, particularly in engineering and physics.",
      "Student: Thank you, Professor. That helps me understand it better."
    ],
    questions: [
      "What is the lecture topic?",
      "What does the student ask about?",
      "What fields does the professor mention?",
      "How does the student respond to the explanation?"
    ]
  },
  {
    id: "ceremonial-address",
    title: "Ceremonial Address",
    description: "Formal ceremonial speech",
    content: [
      "Speaker: Distinguished guests, honored attendees, thank you for being here on this important occasion.",
      "Speaker: We gather today to celebrate the achievements of our community and honor those who have contributed.",
      "Speaker: It is with great pleasure that I recognize the outstanding efforts of our award recipients.",
      "Attendee: This is truly a momentous occasion. We are grateful for this recognition.",
      "Speaker: Your dedication and commitment serve as an inspiration to us all.",
      "Attendee: Thank you for these kind words. We are honored to be here."
    ],
    questions: [
      "What is the occasion?",
      "Who is being recognized?",
      "What does the speaker say about the recipients?",
      "How do the attendees respond?"
    ]
  },
  {
    id: "board-meeting",
    title: "Board Meeting",
    description: "Corporate board of directors meeting",
    content: [
      "Chairperson: Good morning, board members. Let's call this meeting to order.",
      "Chairperson: First on our agenda is the quarterly financial report. Director Smith, please proceed.",
      "Director Smith: Thank you, Madam Chair. Our company has shown strong growth this quarter.",
      "Chairperson: Thank you for the report. Are there any questions from the board?",
      "Director Johnson: Yes, I'd like to request more details on the marketing strategy.",
      "Director Smith: I will prepare a detailed report for next month's meeting. Thank you for your inquiry."
    ],
    questions: [
      "What is the first agenda item?",
      "How is the company performing?",
      "What does Director Johnson request?",
      "When will the detailed report be provided?"
    ]
  }
];

export function FormalConversations({ onBack }: FormalConversationsProps) {
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

          <h2 className="text-3xl font-bold text-white mb-8">Formal Conversations</h2>

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

