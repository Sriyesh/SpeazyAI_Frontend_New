import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Star, Sparkles, FileText, Scale } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface WritingAdvancedProps {
  onBack: () => void;
}

type AdvancedView =
  | "chapters"
  | "opinion-essays"
  | "descriptive-writing"
  | "argumentative-writing";

type Topic = {
  id: string;
  title: string;
  description: string;
  content: string[];
  tips: string[];
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
    id: "opinion-essays",
    title: "Opinion Essays",
    description: "Express your views on important topics",
    image:
      "https://images.unsplash.com/photo-1647417602226-574d7b8b64c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeWluZyUyMG5vdGVib29rJTIwZXNzYXl8ZW58MXx8fHwxNzY0NzgyNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#3B82F6] to-[#00B9FC]",
    topics: [
      {
        id: "technology-education",
        title: "Technology in Education",
        description:
          "Discuss the role of technology in modern learning",
        content: [
          "In today's world, technology plays an increasingly important role in education. Students use computers, tablets, and online platforms to learn new skills and access information.",
          "Write an essay expressing your opinion on this topic: 'Do you think technology improves education, or does it create problems for students?'",
          "Consider both advantages (easy access to information, interactive learning) and disadvantages (distraction, reduced face-to-face interaction).",
        ],
        tips: [
          "Start with a clear introduction stating your opinion",
          "Provide 2-3 main points with examples",
          "Address the opposite viewpoint briefly",
          "End with a strong conclusion that summarizes your position",
        ],
      },
      {
        id: "environmental-responsibility",
        title: "Environmental Responsibility",
        description:
          "Share your views on protecting our planet",
        content: [
          "Climate change and environmental protection are major global concerns. Many people believe that young people should take an active role in protecting the environment.",
          "Write an essay on: 'Should schools require students to participate in environmental conservation activities?'",
          "Think about: The benefits of environmental education, practical ways students can help, and potential challenges.",
        ],
        tips: [
          "Use specific examples from your experience or knowledge",
          "Connect your ideas with linking words (however, moreover, therefore)",
          "Keep your paragraphs focused on one main idea each",
          "Use formal language appropriate for essay writing",
        ],
      },
      {
        id: "social-media-impact",
        title: "Social Media Impact",
        description: "Analyze social media's effect on society",
        content: [
          "Social media platforms have transformed how people communicate and share information. While they offer many benefits, they also raise concerns.",
          "Write an opinion essay: 'Has social media had a mostly positive or negative impact on young people?'",
          "Consider: Communication benefits, mental health effects, information access, and privacy concerns.",
        ],
        tips: [
          "Balance your argument by acknowledging both sides",
          "Use statistics or research if you know any relevant facts",
          "Make your opinion clear from the introduction",
          "Support each point with reasoning and examples",
        ],
      },
    ],
  },
  {
    id: "descriptive-writing",
    title: "Descriptive Writing",
    description: "Paint pictures with your words",
    image:
      "https://images.unsplash.com/photo-1763729805496-b5dbf7f00c79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtYWwlMjB3cml0aW5nJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY0NzgyNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#00B9FC] to-[#246BCF]",
    topics: [
      {
        id: "memorable-person",
        title: "A Person Who Influenced You",
        description:
          "Describe someone who made a difference in your life",
        content: [
          "Think of a person who has had a significant impact on your life. This could be a family member, teacher, friend, or even someone you've never met personally.",
          "Write a detailed description of this person and explain how they influenced you.",
          "Include: Their physical appearance, personality traits, specific actions they took, and the lasting impact they've had on you.",
        ],
        tips: [
          "Use vivid adjectives to bring the person to life",
          "Include specific anecdotes or memories",
          "Show, don't just tell - use examples of their behavior",
          "Organize your description logically (appearance, then personality, then impact)",
        ],
      },
      {
        id: "significant-place",
        title: "A Place of Significance",
        description: "Describe a meaningful location in detail",
        content: [
          "Write about a place that holds special meaning for you. It could be somewhere you visit often or a place from your past.",
          "Describe this location using all five senses: what you see, hear, smell, taste, and feel there.",
          "Explain: Why this place is important to you, what memories are connected to it, and how it makes you feel.",
        ],
        tips: [
          "Use sensory details to make readers feel present in the place",
          "Vary your sentence structure for better flow",
          "Create a mood through your word choices",
          "Include emotional connections to make it personal",
        ],
      },
      {
        id: "cultural-tradition",
        title: "A Cultural Tradition",
        description:
          "Explain a custom or celebration in detail",
        content: [
          "Every culture has unique traditions and celebrations. Choose a cultural tradition that is important to you or your community.",
          "Describe this tradition in detail, including its origins, how it's celebrated, and what it means to people.",
          "Consider: The preparation involved, the activities during the celebration, the food, clothing, and the values it represents.",
        ],
        tips: [
          "Provide background information for readers unfamiliar with the tradition",
          "Use descriptive language to convey the atmosphere",
          "Explain the significance and symbolism",
          "Include personal observations or experiences",
        ],
      },
    ],
  },
  {
    id: "argumentative-writing",
    title: "Argumentative Writing",
    description: "Build strong arguments with evidence",
    image:
      "https://images.unsplash.com/photo-1542725752-e9f7259b3881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGxlYXJuaW5nJTIwYm9va3N8ZW58MXx8fHwxNzY0NzgyNjAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#246BCF] to-[#1E3A8A]",
    topics: [
      {
        id: "school-uniforms",
        title: "School Uniforms Debate",
        description:
          "Argue for or against mandatory school uniforms",
        content: [
          "School uniforms are a controversial topic in education. Some believe they promote equality and discipline, while others argue they limit self-expression.",
          "Take a position and write an argumentative essay: 'Should all schools require students to wear uniforms?'",
          "Build your argument with: Statistical evidence if available, logical reasoning, real-world examples, and responses to counterarguments.",
        ],
        tips: [
          "State your position clearly in the thesis statement",
          "Provide at least three strong supporting arguments",
          "Address and refute opposing viewpoints",
          "Use transitions to connect your ideas smoothly",
          "Conclude by reinforcing your position",
        ],
      },
      {
        id: "homework-policy",
        title: "Homework Effectiveness",
        description:
          "Debate the value of homework in modern education",
        content: [
          "Educators and parents often disagree about the role of homework in learning. Research shows mixed results about its effectiveness.",
          "Argue your position: 'Is homework beneficial for student learning, or should it be reduced or eliminated?'",
          "Consider: Time management skills, family time, stress levels, learning reinforcement, and quality vs. quantity.",
        ],
        tips: [
          "Research different perspectives before writing",
          "Use logical reasoning supported by examples",
          "Maintain a formal, objective tone",
          "Acknowledge complexity while defending your position",
          "Propose solutions or alternatives if relevant",
        ],
      },
      {
        id: "digital-privacy",
        title: "Digital Privacy Rights",
        description: "Argue about privacy in the digital age",
        content: [
          "As more of our lives move online, questions about digital privacy become increasingly important. Companies collect vast amounts of data about users.",
          "Write an argument: 'Should there be stricter laws protecting people's privacy online, even if it limits some conveniences?'",
          "Discuss: Personal data collection, security risks, corporate responsibility, government regulation, and individual choice.",
        ],
        tips: [
          "Define key terms clearly (privacy, data collection, etc.)",
          "Use current events or examples to strengthen arguments",
          "Consider ethical, practical, and legal perspectives",
          "Anticipate and address counterarguments",
          "End with a call to action or strong conclusion",
        ],
      },
    ],
  },
];

export function WritingAdvanced({
  onBack,
}: WritingAdvancedProps) {
  const [currentView, setCurrentView] =
    useState<AdvancedView>("chapters");
  const [selectedChapter, setSelectedChapter] =
    useState<Chapter | null>(null);
  const [selectedTopic, setSelectedTopic] =
    useState<Topic | null>(null);

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSelectedTopic(null);
    setCurrentView(chapter.id as AdvancedView);
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

  // TOPIC DETAIL VIEW
  if (selectedTopic && selectedChapter) {
    return (
      <div className="min-h-screen relative bg-[#1E3A8A]">
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
              <h1 className="text-xl text-white">
                {selectedChapter.title}
              </h1>
              <div className="w-32" />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

            <h2 className="text-5xl text-white mb-4">
              {selectedTopic.title}
            </h2>
            <p className="text-xl text-white/70">
              {selectedTopic.description}
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="h-6 bg-gradient-to-r from-[#3B82F6] via-[#00B9FC] to-[#FFD600] relative">
              <div className="absolute inset-0 flex justify-around items-center">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-white rounded-full"
                  />
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
                    <p className="text-lg text-[#1E3A8A] leading-relaxed">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-2xl p-6 border-4 border-[#FFD600]/30">
                <h4 className="text-xl text-[#FFD700    ] mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#FFD600]" />
                  Writing Tips
                </h4>
                <ul className="space-y-2">
                  {selectedTopic.tips.map((tip, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 text-[#FFD700]"
                    >
                      <span className="text-[#FFD700] flex-shrink-0">
                        •
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] px-10 py-5 rounded-full shadow-xl">
                  <span className="text-2xl text-white">
                    Start Writing Your Essay!
                  </span>
                </div>
              </div>
            </div>

            <div className="h-6 bg-gradient-to-r from-[#FFD600] via-[#00B9FC] to-[#3B82F6]" />
          </div>
        </div>
      </div>
    );
  }

  // CHAPTER VIEW (SHOW TOPICS)
  if (selectedChapter && currentView !== "chapters") {
    return (
      <div className="min-h-screen relative bg-[#1E3A8A]">
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
                Back to Topics
              </Button>
              <h1 className="text-xl text-white">
                {selectedChapter.title}
              </h1>
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
            </div>

            <h2 className="text-5xl text-white mb-4">
              {selectedChapter.title}
            </h2>
            <p className="text-xl text-white/70">
              {selectedChapter.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {selectedChapter.topics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden h-full">
                  <div
                    className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${selectedChapter.color}`}
                  />

                  <div className="mb-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${selectedChapter.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg text-[#1E3A8A] text-center mb-2 group-hover:text-[#3B82F6] transition-colors min-h-[3.5rem]">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-[#1E3A8A]/70 text-center mb-4">
                    {topic.description}
                  </p>

                  <div className="bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] rounded-xl p-4 text-xs text-[#1E3A8A]/80">
                    <p className="line-clamp-3">
                      {topic.content[0]}
                    </p>
                  </div>

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

  // DEFAULT → CHAPTER LIST
  return (
    <div className="min-h-screen relative bg-[#1E3A8A]">
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
            <h1 className="text-xl text-white">
              Advanced Writing - IELTS Level
            </h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl text-white mb-4">
            Master Academic Writing
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Develop your skills with IELTS-level writing topics
            and techniques
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
                    <span className="text-sm text-[#1E3A8A]/60">
                      {chapter.topics.length} Topics
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <Scale className="w-5 h-5 text-white" />
            <span className="text-white">
              Build strong arguments and express yourself
              clearly
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}