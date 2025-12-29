import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ThemeToggle } from "./ThemeToggle";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Mic,
  Save,
  FileText,
  Sparkles,
  Star,
  Book,
  Play,
} from "lucide-react";
import { motion } from "motion/react";
import { MelloAssistant } from "./MelloAssistant";
import { useNavigate, useLocation } from "react-router-dom";

interface CustomContentProps {
  onBack?: () => void;
}

type CustomLesson = {
  id: number;
  title: string;
  content: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: Date;
};

export function CustomContent({ onBack }: CustomContentProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const backRoute = (location.state as any)?.backRoute || "/speaking-modules"
  
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(backRoute)
    }
  }
  
  const [view, setView] = useState<
    "list" | "create" | "practice"
  >("list");
  const [customLessons, setCustomLessons] = useState<
    CustomLesson[]
  >([
    {
      id: 1,
      title: "My Favorite Story",
      content:
        "Once upon a time, there was a brave little rabbit who loved adventures. Every day, the rabbit would explore new places and make new friends.",
      difficulty: "Easy",
      createdAt: new Date("2025-01-05"),
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<
    "Easy" | "Medium" | "Hard"
  >("Easy");
  const [selectedLesson, setSelectedLesson] =
    useState<CustomLesson | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [showMelloMessage, setShowMelloMessage] =
    useState(true);

  const handleCreateLesson = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Please fill in both title and content!");
      return;
    }

    const newLesson: CustomLesson = {
      id: customLessons.length + 1,
      title: newTitle,
      content: newContent,
      difficulty: newDifficulty,
      createdAt: new Date(),
    };

    setCustomLessons([...customLessons, newLesson]);
    setNewTitle("");
    setNewContent("");
    setNewDifficulty("Easy");
    setView("list");
    setShowMelloMessage(true);
  };

  const handleDeleteLesson = (id: number) => {
    if (
      confirm("Are you sure you want to delete this lesson?")
    ) {
      setCustomLessons(
        customLessons.filter((lesson) => lesson.id !== id),
      );
    }
  };

  const handlePracticeLesson = (lesson: CustomLesson) => {
    setSelectedLesson(lesson);
    setView("practice");
    setIsPracticing(false);
    setShowMelloMessage(true);
  };

  const handleStartPractice = () => {
    setIsPracticing(true);
    setTimeout(() => {
      setIsPracticing(false);
      alert(
        "Great job! 🌟 You completed your practice session!",
      );
    }, 5000);
  };

  const renderList = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h2
          className="text-4xl font-bold flex items-center justify-center gap-3"
          style={{ color: "#F2F6FF" }}
        >
          Create Your Own Content ✨
          <Sparkles
            className="w-10 h-10 kid-pulse"
            style={{ color: "#FFD600" }}
          />
        </h2>
        <p
          className="text-xl"
          style={{ color: "rgba(242, 246, 255, 0.7)" }}
        >
          Write your own stories and practice speaking them!
        </p>
      </div>

      <div className="mb-8 text-center">
        <Button
          onClick={() => setView("create")}
          className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-xl px-8 py-6 text-lg shadow-lg hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-6 h-6 mr-2" />
          Create New Lesson
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customLessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              className="group bg-[#FFFFFF] border-0 hover:shadow-xl transition-all duration-300"
              style={{
                borderRadius: "16px",
                boxShadow:
                  "0 8px 32px rgba(59, 130, 246, 0.15)",
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] group-hover:scale-110 transition-transform duration-300`}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteLesson(lesson.id)
                      }
                      className="text-[#1E3A8A] hover:text-[#FFD600] hover:bg-[#3B82F6]/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardTitle
                  className="text-lg group-hover:text-[#FFD600] transition-colors"
                  style={{ color: "#1E3A8A" }}
                >
                  {lesson.title}
                </CardTitle>
                <p
                  className="text-sm mt-2 line-clamp-3"
                  style={{ color: "rgba(30, 58, 138, 0.7)" }}
                >
                  {lesson.content}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#3B82F6]/20"
                    style={{ color: "#FFD600" }}
                  >
                    {lesson.difficulty}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "rgba(30, 58, 138, 0.7)" }}
                  >
                    {lesson.createdAt.toLocaleDateString()}
                  </span>
                </div>

                <Button
                  onClick={() => handlePracticeLesson(lesson)}
                  className="w-full bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-lg transition-all duration-200"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Practice Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {customLessons.length === 0 && (
          <Card
            className="col-span-full bg-[#FFFFFF] border-0 p-12 text-center"
            style={{
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
            }}
          >
            <Book
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "rgba(30, 58, 138, 0.7)" }}
            />
            <h3
              className="text-xl font-bold"
              style={{ color: "#1E3A8A" }}
            >
              No custom content yet
            </h3>
            <p
              className="mb-6"
              style={{ color: "rgba(30, 58, 138, 0.7)" }}
            >
              Create your first lesson to get started!
            </p>
            <Button
              onClick={() => setView("create")}
              className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Lesson
            </Button>
          </Card>
        )}
      </div>

      <motion.div
        animate={
          showMelloMessage
            ? { y: [0, -15, 0], scale: [1, 1.1, 1] }
            : { x: [0, 10, -10, 0] }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          times: showMelloMessage
            ? [0, 0.5, 1]
            : [0, 0.33, 0.66, 1],
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 100,
        }}
      >
        <MelloAssistant
          state={showMelloMessage ? "celebrating" : "idle"}
          message="Create or practice your own stories! You're the star! 😄✨"
          showMessage={showMelloMessage}
          onMessageDismiss={() => setShowMelloMessage(false)}
          position="bottom-right"
          style={{
            background:
              "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
            padding: "12px",
            maxWidth: "300px",
          }}
          messageClassName="typewriter"
        />
      </motion.div>
    </div>
  );

  const renderCreate = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card
        className="bg-[#FFFFFF] border-0 shadow-2xl"
        style={{
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
        }}
      >
        <CardHeader>
          <CardTitle
            className="text-2xl flex items-center"
            style={{ color: "#1E3A8A" }}
          >
            <Sparkles
              className="w-6 h-6 mr-2"
              style={{ color: "#FFD600" }}
            />
            Create New Lesson
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label style={{ color: "#1E3A8A" }}>
              Lesson Title
            </Label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Give your lesson an exciting title..."
              className="bg-[#F2F6FF] border-[#3B82F6]/20 focus:border-[#3B82F6]"
              style={{ color: "#1E3A8A" }}
            />
          </div>

          <div className="space-y-2">
            <Label style={{ color: "#1E3A8A" }}>
              Difficulty Level
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {(["Easy", "Medium", "Hard"] as const).map(
                (level) => (
                  <Button
                    key={level}
                    variant={
                      newDifficulty === level
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setNewDifficulty(level)}
                    className={`${
                      newDifficulty === level
                        ? "bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] text-white"
                        : "bg-[#F2F6FF] border-[#3B82F6]/20 text-[#1E3A8A] hover:bg-[#3B82F6]/10"
                    }`}
                  >
                    {level}
                  </Button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label style={{ color: "#1E3A8A" }}>
              Lesson Content
            </Label>
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your story or text here. This is what you'll practice speaking..."
              rows={10}
              className="bg-[#F2F6FF] border-[#3B82F6]/20 focus:border-[#3B82F6]"
              style={{ color: "#1E3A8A" }}
            />
            <p
              className="text-xs"
              style={{ color: "rgba(30, 58, 138, 0.7)" }}
            >
              {newContent.length} characters •{" "}
              {newContent.split(" ").filter((w) => w).length}{" "}
              words
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleCreateLesson}
              className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Lesson
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setView("list");
                setNewTitle("");
                setNewContent("");
                setNewDifficulty("Easy");
              }}
              className="border-[#3B82F6]/20 text-[#1E3A8A] hover:bg-[#3B82F6]/10"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <motion.div
        animate={
          showMelloMessage
            ? { y: [0, -15, 0], scale: [1, 1.1, 1] }
            : { x: [0, 10, -10, 0] }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          times: showMelloMessage
            ? [0, 0.5, 1]
            : [0, 0.33, 0.66, 1],
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 100,
        }}
      >
        <MelloAssistant
          state={showMelloMessage ? "celebrating" : "idle"}
          message="Write a fun story to practice! Make it exciting! 😄✨"
          showMessage={showMelloMessage}
          onMessageDismiss={() => setShowMelloMessage(false)}
          position="bottom-right"
          style={{
            background:
              "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
            padding: "12px",
            maxWidth: "300px",
          }}
          messageClassName="typewriter"
        />
      </motion.div>
    </div>
  );

  const renderPractice = () => {
    if (!selectedLesson) return null;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card
          className="bg-[#FFFFFF] border-0 shadow-2xl"
          style={{
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
          }}
        >
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] shadow-lg kid-pulse">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <CardTitle
              className="text-3xl"
              style={{ color: "#1E3A8A" }}
            >
              {selectedLesson.title}
            </CardTitle>
            <span
              className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-[#3B82F6]/20"
              style={{ color: "#FFD600" }}
            >
              {selectedLesson.difficulty}
            </span>
          </CardHeader>

          <CardContent className="space-y-6">
            <div
              className="bg-[#F2F6FF] rounded-xl p-6"
              style={{
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <h3
                className="text-lg font-bold"
                style={{ color: "#1E3A8A" }}
              >
                📖 Your Content
              </h3>
              <p
                className="leading-relaxed whitespace-pre-line"
                style={{ color: "#1E3A8A" }}
              >
                {selectedLesson.content}
              </p>
            </div>

            <div className="text-center space-y-4">
              {!isPracticing ? (
                <Button
                  onClick={handleStartPractice}
                  className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-xl px-12 py-6 text-lg shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Mic className="w-6 h-6 mr-2" />
                  Start Practice Reading
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] rounded-full flex items-center justify-center kid-pulse shadow-2xl">
                    <Mic className="w-16 h-16 text-white" />
                  </div>
                  <p
                    className="text-xl kid-pulse"
                    style={{ color: "#F2F6FF" }}
                  >
                    🎤 Recording... Speak clearly!
                  </p>
                  <div className="flex justify-center items-end space-x-1 h-12">
                    <div
                      className="w-3 bg-[#3B82F6] rounded recording-bar"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-3 bg-[#00B9FC] rounded recording-bar"
                      style={{ animationDelay: "100ms" }}
                    ></div>
                    <div
                      className="w-3 bg-[#3B82F6] rounded recording-bar"
                      style={{ animationDelay: "200ms" }}
                    ></div>
                    <div
                      className="w-3 bg-[#00B9FC] rounded recording-bar"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-3 bg-[#3B82F6] rounded recording-bar"
                      style={{ animationDelay: "400ms" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setView("list")}
              className="w-full border-[#3B82F6]/20 text-[#1E3A8A] hover:bg-[#3B82F6]/10"
            >
              Back to Lessons
            </Button>
          </CardContent>
        </Card>

        <motion.div
          animate={
            showMelloMessage
              ? { y: [0, -15, 0], scale: [1, 1.1, 1] }
              : { x: [0, 10, -10, 0] }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            times: showMelloMessage
              ? [0, 0.5, 1]
              : [0, 0.33, 0.66, 1],
          }}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 100,
          }}
        >
          <MelloAssistant
            state={showMelloMessage ? "celebrating" : "idle"}
            message="Read your story aloud! Speak clearly and have fun! 😄✨"
            showMessage={showMelloMessage}
            onMessageDismiss={() => setShowMelloMessage(false)}
            position="bottom-right"
            style={{
              background:
                "linear-gradient(135deg, #3B82F6 0%, #00B9FC 100%)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
              padding: "12px",
              maxWidth: "300px",
            }}
            messageClassName="typewriter"
          />
        </motion.div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#1E3A8A" }}
    >
      <style>
        {`
          .typewriter {
            overflow: hidden;
            white-space: nowrap;
            animation: typing 2s steps(40, end);
          }
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
          .recording-bar {
            height: 20px;
            animation: recording 800ms ease-in-out infinite alternate;
          }
          @keyframes recording {
            from { height: 10px; }
            to { height: 30px; }
          }
          .kid-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          .kid-bounce {
            animation: bounce 0.5s ease-in-out;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <Star
          className="absolute top-10 left-10 w-4 h-4 animate-pulse"
          style={{ color: "#FFD600" }}
        />
        <Sparkles
          className="absolute top-40 right-20 w-5 h-5 animate-pulse"
          style={{ color: "#FFD600", animationDelay: "0.5s" }}
        />
        <Star
          className="absolute bottom-40 left-40 w-4 h-4 animate-pulse"
          style={{ color: "#FFD600", animationDelay: "1s" }}
        />
        <Sparkles
          className="absolute bottom-20 right-40 w-5 h-5 animate-pulse"
          style={{ color: "#FFD600", animationDelay: "1.5s" }}
        />
      </div>

      <header
        className="backdrop-blur-lg border-b sticky top-0 z-50"
        style={{
          background: "rgba(30, 58, 138, 0.95)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-[#F2F6FF] hover:text-[#FFD600] hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <h1
              className="text-lg font-semibold"
              style={{ color: "#F2F6FF" }}
            >
              Custom Content 📝✨
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {view === "list" && renderList()}
        {view === "create" && renderCreate()}
        {view === "practice" && renderPractice()}
      </div>
    </div>
  );
}