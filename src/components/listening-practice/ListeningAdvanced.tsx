import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Star, Sparkles, Podcast, Newspaper, GraduationCap } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ListeningAdvancedProps {
  onBack: () => void;
}

type AdvancedView = "chapters" | "podcasts" | "news-reports" | "lectures";

type Topic = {
  id: string;
  title: string;
  description: string;
  content: string[];
  tasks: string[];
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
    id: "podcasts",
    title: "Podcast Discussions",
    description: "Listen to in-depth discussions",
    image: "https://images.unsplash.com/photo-1650564416148-41a34875cc2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMGF1ZGlvfGVufDF8fHx8MTc2NDc3NzczMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#3B82F6] to-[#00B9FC]",
    topics: [
      {
        id: "climate-action",
        title: "Youth Climate Action",
        description: "Young people leading environmental change",
        content: [
          "Listen to this podcast featuring three teenage climate activists discussing their initiatives to combat climate change in their communities.",
          "The speakers explain how they organized beach cleanups, started recycling programs at schools, and created awareness campaigns about sustainable living.",
          "They share challenges they faced, including convincing adults to take youth activism seriously and finding funding for their projects.",
          "The conversation concludes with practical advice for other young people who want to make a difference in environmental protection.",
        ],
        tasks: [
          "Identify the three main initiatives discussed by the activists",
          "List two challenges they mentioned facing",
          "Summarize their advice for aspiring young activists",
          "Explain how their programs impacted their communities",
          "Discuss your own ideas for environmental action",
        ],
      },
      {
        id: "digital-wellness",
        title: "Digital Wellness & Balance",
        description: "Managing technology in daily life",
        content: [
          "This podcast explores the relationship between teenagers and technology, featuring psychologists and students discussing digital wellness.",
          "Experts discuss the importance of setting boundaries with devices, the impact of social media on mental health, and strategies for maintaining balance.",
          "Students share their personal experiences with screen time, online friendships, and the pressure to stay constantly connected.",
          "The episode provides practical tips for creating healthy digital habits while still enjoying the benefits of technology.",
        ],
        tasks: [
          "Define 'digital wellness' based on the podcast",
          "Identify three strategies mentioned for healthy tech use",
          "Analyze the different perspectives of experts vs. students",
          "Evaluate which advice would be most helpful for you",
          "Create your own digital wellness plan",
        ],
      },
      {
        id: "creative-careers",
        title: "Exploring Creative Careers",
        description: "Interviews with creative professionals",
        content: [
          "Listen as professional artists, designers, and writers discuss their career paths and creative processes.",
          "Each guest explains how they turned their passion into a profession, the education and training they pursued, and the challenges of creative work.",
          "They offer insights into balancing artistic integrity with commercial success and maintaining creativity under pressure.",
          "The podcast concludes with encouragement for young people interested in creative fields and advice on developing their skills.",
        ],
        tasks: [
          "Compare the career paths of different creative professionals",
          "Identify common challenges in creative careers",
          "Analyze advice given for skill development",
          "Evaluate which creative field interests you most",
          "Research additional information about your chosen field",
        ],
      },
    ],
  },
  {
    id: "news-reports",
    title: "News & Current Events",
    description: "Understand news broadcasts",
    image: "https://images.unsplash.com/photo-1763674561330-5f87d703ea0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwYnJvYWRjYXN0JTIwbWVkaWF8ZW58MXx8fHwxNzY0ODcyODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#00B9FC] to-[#246BCF]",
    topics: [
      {
        id: "science-breakthrough",
        title: "Medical Research Breakthrough",
        description: "New developments in medicine",
        content: [
          "Scientists at the Global Research Institute have announced a significant breakthrough in understanding how the human immune system fights certain diseases.",
          "The research team, led by Dr. Sarah Chen, spent five years studying cellular responses and discovered a previously unknown mechanism that could lead to new treatments.",
          "Clinical trials are expected to begin next year, with initial results suggesting the treatment could be effective for conditions that currently have limited options.",
          "Medical experts worldwide have praised the research, though they caution that it may take several years before treatments become widely available to patients.",
        ],
        tasks: [
          "Identify the main finding of the research",
          "Note the timeline for clinical trials",
          "Analyze the significance of this breakthrough",
          "Explain why experts are both excited and cautious",
          "Discuss potential impacts on healthcare",
        ],
      },
      {
        id: "space-mission",
        title: "International Space Mission",
        description: "Exploring the cosmos together",
        content: [
          "Five countries have partnered to launch the most ambitious space mission in decades, aiming to establish a research station on the Moon by 2030.",
          "The mission will cost an estimated 50 billion dollars and involves over 10,000 scientists, engineers, and support staff from around the world.",
          "The lunar station will serve as a testing ground for technologies needed for future Mars missions and will conduct research impossible to perform on Earth.",
          "Project leaders emphasize that international cooperation is essential for such massive undertakings and hope it will inspire the next generation of space explorers.",
        ],
        tasks: [
          "List the key facts about the space mission",
          "Identify the main goals of the lunar station",
          "Analyze why international cooperation is important",
          "Evaluate the potential benefits of this mission",
          "Discuss your thoughts on space exploration",
        ],
      },
      {
        id: "education-reform",
        title: "Education System Changes",
        description: "New approaches to learning",
        content: [
          "Education ministers from several nations met this week to discuss innovative approaches to modernizing school curricula for the 21st century.",
          "Proposed changes include more emphasis on critical thinking, project-based learning, and integration of technology throughout all subjects rather than teaching it separately.",
          "Teachers' unions have expressed both support and concerns, particularly regarding the need for additional training and resources to implement these changes effectively.",
          "Students interviewed about the proposals were generally enthusiastic, especially about having more practical, real-world applications of their learning.",
        ],
        tasks: [
          "Summarize the proposed changes to education",
          "Compare teachers' and students' perspectives",
          "Analyze potential benefits and challenges",
          "Evaluate which changes you think are most important",
          "Propose additional improvements to education",
        ],
      },
    ],
  },
  {
    id: "lectures",
    title: "Academic Lectures",
    description: "University-level content",
    image: "https://images.unsplash.com/photo-1657819466043-2a4ae992f03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZXJzYXRpb24lMjBwZW9wbGUlMjB0YWxraW5nfGVufDF8fHx8MTc2NDg0MTU5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-[#246BCF] to-[#1E3A8A]",
    topics: [
      {
        id: "ancient-civilizations",
        title: "Ancient Civilizations",
        description: "Understanding historical societies",
        content: [
          "Good morning, class. Today we'll explore how ancient civilizations developed complex societies without modern technology.",
          "We'll examine the Mesopotamians, Egyptians, and Indus Valley civilizations, focusing on their innovations in agriculture, writing systems, and governance.",
          "These societies created impressive architectural achievements, developed mathematical and astronomical knowledge, and established legal systems that influenced later cultures.",
          "Understanding ancient civilizations helps us appreciate human ingenuity and recognize that many 'modern' concepts actually have ancient origins.",
        ],
        tasks: [
          "Identify three civilizations discussed in the lecture",
          "List their major innovations and achievements",
          "Analyze similarities between ancient and modern societies",
          "Evaluate the lasting impact of ancient civilizations",
          "Research one civilization in more depth",
        ],
      },
      {
        id: "ecosystem-balance",
        title: "Ecosystem Balance",
        description: "Environmental science concepts",
        content: [
          "Welcome to Environmental Science 101. Today's topic is ecosystem balance and the interconnected nature of living organisms and their environment.",
          "Ecosystems maintain equilibrium through complex relationships between producers, consumers, and decomposers. When one element changes, it affects the entire system.",
          "We'll examine case studies of ecosystem disruption, including invasive species, climate change impacts, and human intervention, both harmful and beneficial.",
          "Understanding these principles is crucial for addressing environmental challenges and developing sustainable practices that protect biodiversity.",
        ],
        tasks: [
          "Explain the concept of ecosystem balance",
          "Describe the roles of producers, consumers, and decomposers",
          "Analyze causes and effects of ecosystem disruption",
          "Evaluate different conservation strategies",
          "Apply these concepts to local environmental issues",
        ],
      },
      {
        id: "critical-thinking",
        title: "Critical Thinking Skills",
        description: "Logic and reasoning methods",
        content: [
          "Critical thinking is the ability to analyze information objectively and make reasoned judgments. It involves questioning assumptions and evaluating evidence.",
          "We'll explore logical fallacies—common errors in reasoning that can mislead us. These include false dichotomies, slippery slope arguments, and appeals to emotion.",
          "Developing critical thinking requires practice in identifying bias, distinguishing fact from opinion, and recognizing when we need more information.",
          "These skills are essential in academics, professional life, and navigating the overwhelming amount of information we encounter daily, especially online.",
        ],
        tasks: [
          "Define critical thinking and its importance",
          "Identify and explain at least three logical fallacies",
          "Analyze examples of biased vs. unbiased information",
          "Evaluate your own critical thinking strengths and weaknesses",
          "Practice applying these skills to current issues",
        ],
      },
    ],
  },
];

export function ListeningAdvanced({ onBack }: ListeningAdvancedProps) {
  const [currentView, setCurrentView] = useState<AdvancedView>("chapters");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

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
              <Podcast className="absolute -top-4 -right-4 w-10 h-10 text-[#FFD600] animate-pulse" />
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
                  Critical Listening Tasks
                </h4>
                <ul className="space-y-3">
                  {selectedTopic.tasks.map((task, idx) => (
                    <li key={idx} className="flex gap-3 text-[#1E3A8A]/80">
                      <span className="text-[#3B82F6] flex-shrink-0">{idx + 1}.</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] px-10 py-5 rounded-full shadow-xl">
                  <Podcast className="w-8 h-8 text-white animate-pulse" />
                  <span className="text-2xl text-white">Master This Content!</span>
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
                <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden h-full">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${selectedChapter.color}`} />
                  
                  <div className="mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${selectedChapter.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Podcast className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg text-[#1E3A8A] text-center mb-2 group-hover:text-[#3B82F6] transition-colors min-h-[3.5rem]">
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
            <h1 className="text-xl text-white">Advanced Listening</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl text-white mb-4">Choose Your Chapter</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Master advanced listening with academic content
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
                  <Podcast className="absolute top-4 right-4 w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <GraduationCap className="w-5 h-5 text-white" />
            <span className="text-white">Challenge yourself with advanced content!</span>
            <Star className="w-5 h-5 text-[#FFD600]" />
          </div>
        </div>
      </div>
    </div>
  );
}
