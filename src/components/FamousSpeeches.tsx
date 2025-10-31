import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Star,
  Heart,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Mic,
  MicOff,
  Award,
} from "lucide-react";
import { motion } from "motion/react";
import { MelloAssistant } from "./MelloAssistant";

interface FamousSpeechesProps {
  onBack: () => void;
}

type View = "selection" | "speech-detail" | "quiz";

const speeches = [
  {
    id: "mlk-dream",
    title: "I Have a Dream",
    speaker: "Martin Luther King Jr.",
    description: "A speech about equality and dreams",
    kidFriendlyText: `"I have a dream that one day all children will play together, no matter what they look like. I dream that everyone will be kind to each other and treat each other fairly. We should judge people by how nice they are, not by the color of their skin."`,
    icon: "🌟",
    color: "from-[#3B82F6] to-[#00B9FC]",
    quizWords: [
      "dream",
      "children",
      "play",
      "together",
      "kind",
      "fairly",
    ],
  },
  {
    id: "peace-speech",
    title: "Words of Peace",
    speaker: "A Great Leader",
    description: "Learning about kindness and peace",
    kidFriendlyText: `"Peace means being kind to everyone around us. When we are peaceful, we solve problems by talking, not fighting. We can make the world better by being helpful, sharing with others, and always choosing love over anger."`,
    icon: "🕊️",
    color: "from-[#1E3A8A] to-[#3B82F6]",
    quizWords: [
      "peace",
      "kind",
      "talking",
      "helpful",
      "sharing",
      "love",
    ],
  },
];

export function FamousSpeeches({
  onBack,
}: FamousSpeechesProps) {
  const [currentView, setCurrentView] =
    useState<View>("selection");
  const [selectedSpeech, setSelectedSpeech] = useState<
    (typeof speeches)[0] | null
  >(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizProgress, setQuizProgress] = useState<string[]>(
    [],
  );
  const [draggedWord, setDraggedWord] = useState<string | null>(
    null,
  );
  const [showMelloMessage, setShowMelloMessage] =
    useState(true);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<
    number | null
  >(null);
  const [pronunciationFeedback, setPronunciationFeedback] =
    useState<string>("");

  const handleSpeechSelect = (speech: (typeof speeches)[0]) => {
    setSelectedSpeech(speech);
    setCurrentView("speech-detail");
    setIsRecording(false);
    setHasRecorded(false);
    setPronunciationScore(null);
    setPronunciationFeedback("");
    setShowMelloMessage(true);
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const handleStartQuiz = () => {
    setCurrentView("quiz");
    setQuizProgress([]);
    setIsRecording(false);
    setHasRecorded(false);
    setPronunciationScore(null);
    setPronunciationFeedback("");
    setShowMelloMessage(true);
  };

  const handleWordDrop = (word: string, position: number) => {
    const newProgress = [...quizProgress];
    newProgress[position] = word;
    setQuizProgress(newProgress);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);
    setPronunciationScore(null);
    setPronunciationFeedback("");

    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);

      const randomScore = Math.floor(Math.random() * 30) + 70;
      setPronunciationScore(randomScore);

      if (randomScore >= 90) {
        setPronunciationFeedback(
          "Excellent pronunciation! You spoke clearly and confidently.",
        );
      } else if (randomScore >= 80) {
        setPronunciationFeedback(
          "Great job! Your pronunciation is very good. Keep practicing!",
        );
      } else {
        setPronunciationFeedback(
          "Good effort! Try to speak a bit more clearly next time.",
        );
      }
    }, 3000);
  };

  const handleStopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);

      const randomScore = Math.floor(Math.random() * 30) + 70;
      setPronunciationScore(randomScore);

      if (randomScore >= 90) {
        setPronunciationFeedback(
          "Excellent pronunciation! You spoke clearly and confidently.",
        );
      } else if (randomScore >= 80) {
        setPronunciationFeedback(
          "Great job! Your pronunciation is very good. Keep practicing!",
        );
      } else {
        setPronunciationFeedback(
          "Good effort! Try to speak a bit more clearly next time.",
        );
      }
    }
  };

  const renderSpeechSelection = () => (
    <div
      className="min-h-screen"
      style={{ background: "#1E3A8A" }}
    >
      {/* CSS for Typewriter Effect */}
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
                onClick={onBack}
                className="text-[#F2F6FF] hover:text-[#FFD600] hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <h1
              className="text-lg font-semibold"
              style={{ color: "#F2F6FF" }}
            >
              Famous Speeches
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold"
            style={{ color: "#F2F6FF" }}
          >
            Learn from Great Speakers
          </h2>
          <p
            className="text-lg"
            style={{ color: "rgba(242, 246, 255, 0.7)" }}
          >
            Discover amazing speeches that changed the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {speeches.map((speech) => (
            <motion.div
              key={speech.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                className="group bg-[#FFFFFF] border-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleSpeechSelect(speech)}
                style={{
                  borderRadius: "16px",
                  boxShadow:
                    "0 8px 32px rgba(59, 130, 246, 0.15)",
                }}
              >
                <div className="absolute top-4 right-4">
                  <div className="text-3xl">{speech.icon}</div>
                </div>

                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${speech.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}
                  >
                    <Volume2 className="w-8 h-8 text-white" />
                  </div>

                  <CardTitle
                    className="text-xl text-center group-hover:text-[#FFD600] transition-colors"
                    style={{ color: "#1E3A8A" }}
                  >
                    {speech.title}
                  </CardTitle>
                  <p
                    className="text-center"
                    style={{ color: "rgba(30, 58, 138, 0.7)" }}
                  >
                    {speech.description}
                  </p>
                  <p
                    className="text-sm text-center"
                    style={{ color: "rgba(30, 58, 138, 0.7)" }}
                  >
                    by {speech.speaker}
                  </p>
                </CardHeader>

                <CardContent className="text-center">
                  <Button
                    size="lg"
                    className={`bg-gradient-to-r ${speech.color} hover:opacity-90 text-white rounded-lg px-6 transition-all duration-200`}
                  >
                    Listen & Learn
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
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
          message="Pick a speech to learn from! Each one has a special message! 🌟😄"
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

  const renderSpeechDetail = () => {
    if (!selectedSpeech) return null;

    return (
      <div
        className="min-h-screen"
        style={{ background: "#1E3A8A" }}
      >
        <header
          className="backdrop-blur-lg border-b sticky top-0 z-50"
          style={{
            background: "rgba(30, 58, 138, 0.95)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("selection")}
                className="text-[#F2F6FF] hover:text-[#FFD600] hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Speeches
              </Button>
              <h1
                className="text-lg font-semibold"
                style={{ color: "#F2F6FF" }}
              >
                {selectedSpeech.title}
              </h1>
              <div></div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card
            className="mb-8 bg-[#FFFFFF] border-0 shadow-xl"
            style={{
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
            }}
          >
            <CardHeader className="text-center">
              <div
                className={`w-20 h-20 bg-gradient-to-br ${selectedSpeech.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}
              >
                <span className="text-3xl">
                  {selectedSpeech.icon}
                </span>
              </div>
              <CardTitle
                className="text-2xl"
                style={{ color: "#1E3A8A" }}
              >
                {selectedSpeech.title}
              </CardTitle>
              <p style={{ color: "rgba(30, 58, 138, 0.7)" }}>
                by {selectedSpeech.speaker}
              </p>
            </CardHeader>

            <CardContent className="text-center space-y-6">
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
                  🎧 Listen to the Speech
                </h3>
                <Button
                  size="lg"
                  onClick={handlePlayAudio}
                  className={`bg-gradient-to-r ${selectedSpeech.color} hover:opacity-90 text-white rounded-lg px-6 kid-pulse transition-all duration-200 mt-4`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Play Speech
                    </>
                  )}
                </Button>
              </div>

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
                  📖 Speech for Kids
                </h3>
                <p
                  className="text-base leading-relaxed italic"
                  style={{ color: "#1E3A8A" }}
                >
                  {selectedSpeech.kidFriendlyText}
                </p>
              </div>

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
                  🎤 Practice Reading
                </h3>
                <p
                  className="mb-4"
                  style={{ color: "rgba(30, 58, 138, 0.7)" }}
                >
                  Read the speech aloud and get feedback on your
                  pronunciation!
                </p>

                <div className="flex flex-col items-center space-y-4">
                  {!isRecording && !hasRecorded && (
                    <Button
                      size="lg"
                      onClick={handleStartRecording}
                      className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-lg px-8 transition-all duration-200"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Start Reading
                    </Button>
                  )}

                  {isRecording && (
                    <div className="text-center">
                      <Button
                        size="lg"
                        onClick={handleStopRecording}
                        className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-lg px-8 transition-all duration-200 kid-pulse"
                      >
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Reading
                      </Button>
                      <div className="mt-4">
                        <div className="flex justify-center items-end space-x-1 h-12">
                          <div
                            className="w-2 bg-[#3B82F6] rounded recording-bar"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 bg-[#00B9FC] rounded recording-bar"
                            style={{ animationDelay: "100ms" }}
                          ></div>
                          <div
                            className="w-2 bg-[#3B82F6] rounded recording-bar"
                            style={{ animationDelay: "200ms" }}
                          ></div>
                          <div
                            className="w-2 bg-[#00B9FC] rounded recording-bar"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                          <div
                            className="w-2 bg-[#3B82F6] rounded recording-bar"
                            style={{ animationDelay: "400ms" }}
                          ></div>
                          <div
                            className="w-2 bg-[#00B9FC] rounded recording-bar"
                            style={{ animationDelay: "500ms" }}
                          ></div>
                          <div
                            className="w-2 bg-[#3B82F6] rounded recording-bar"
                            style={{ animationDelay: "600ms" }}
                          ></div>
                        </div>
                        <p className="text-[#FFD600] mt-2 kid-pulse">
                          Recording... Speak clearly!
                        </p>
                      </div>
                    </div>
                  )}

                  {hasRecorded &&
                    pronunciationScore !== null && (
                      <div className="text-center space-y-4 w-full max-w-md">
                        <div className="kid-bounce">
                          {pronunciationScore >= 90 ? (
                            <div className="text-6xl">🌟</div>
                          ) : pronunciationScore >= 80 ? (
                            <div className="text-6xl">🎉</div>
                          ) : (
                            <div className="text-6xl">👏</div>
                          )}
                        </div>

                        <div
                          className="bg-[#F2F6FF] rounded-xl p-4"
                          style={{
                            border:
                              "1px solid rgba(59, 130, 246, 0.2)",
                          }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span
                              style={{
                                color: "rgba(30, 58, 138, 0.7)",
                              }}
                            >
                              Pronunciation Score
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: "#1E3A8A" }}
                            >
                              {pronunciationScore}%
                            </span>
                          </div>
                          <div className="w-full bg-[#1E3A8A]/20 rounded-full h-3">
                            <div
                              className="h-3 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] transition-all duration-1000"
                              style={{
                                width: `${pronunciationScore}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className="bg-[#F2F6FF] rounded-xl p-4"
                          style={{
                            border:
                              "1px solid rgba(59, 130, 246, 0.2)",
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <Award className="w-6 h-6 text-[#FFD600] mt-1 flex-shrink-0" />
                            <p style={{ color: "#1E3A8A" }}>
                              {pronunciationFeedback}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            setHasRecorded(false);
                            setPronunciationScore(null);
                            setPronunciationFeedback("");
                          }}
                          className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-lg px-6"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleStartQuiz}
                className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-lg px-6 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try Fun Activity
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
              message="Listen and practice reading! Try to speak clearly! 😄✨"
              showMessage={showMelloMessage}
              onMessageDismiss={() =>
                setShowMelloMessage(false)
              }
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
      </div>
    );
  };

  const renderQuiz = () => {
    if (!selectedSpeech) return null;

    const sentence =
      "I have a _____ that all _____ will play _____ and be _____ to each other.";
    const correctAnswers = [
      "dream",
      "children",
      "together",
      "kind",
    ];
    const isComplete =
      quizProgress.length === correctAnswers.length &&
      quizProgress.every(
        (word, index) => word === correctAnswers[index],
      );

    return (
      <div
        className="min-h-screen"
        style={{ background: "#1E3A8A" }}
      >
        <header
          className="backdrop-blur-lg border-b sticky top-0 z-50"
          style={{
            background: "rgba(30, 58, 138, 0.95)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("speech-detail")}
                className="text-[#F2F6FF] hover:text-[#FFD600] hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Speech
              </Button>
              <h1
                className="text-lg font-semibold"
                style={{ color: "#F2F6FF" }}
              >
                Fun Word Activity
              </h1>
              <div></div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card
            className="bg-[#FFFFFF] border-0 shadow-xl"
            style={{
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
            }}
          >
            <CardHeader className="text-center">
              <CardTitle
                className="text-2xl"
                style={{ color: "#1E3A8A" }}
              >
                🧩 Complete the Sentence!
              </CardTitle>
              <p style={{ color: "rgba(30, 58, 138, 0.7)" }}>
                Drag the words below to complete the sentence
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              <div
                className="bg-[#F2F6FF] rounded-xl p-6"
                style={{
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <div
                  className="text-lg leading-relaxed text-center"
                  style={{ color: "#1E3A8A" }}
                >
                  {sentence
                    .split("_____")
                    .map((part, index) => (
                      <span key={index}>
                        {part}
                        {index < 4 && (
                          <span
                            className="inline-block w-24 h-10 bg-[#1E3A8A]/20 border-2 border-dashed border-[#3B82F6] rounded-lg mx-2 align-middle relative hover:bg-[#1E3A8A]/30 transition-colors"
                            onDragOver={(e) =>
                              e.preventDefault()
                            }
                            onDrop={(e) => {
                              e.preventDefault();
                              if (draggedWord) {
                                handleWordDrop(
                                  draggedWord,
                                  index,
                                );
                                setDraggedWord(null);
                              }
                            }}
                          >
                            {quizProgress[index] && (
                              <span
                                className="absolute inset-0 flex items-center justify-center font-medium kid-bounce"
                                style={{ color: "#FFD600" }}
                              >
                                {quizProgress[index]}
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                    ))}
                </div>
              </div>

              <div className="text-center">
                <h3
                  className="text-lg font-bold"
                  style={{ color: "#1E3A8A" }}
                >
                  🎪 Word Bank
                </h3>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {selectedSpeech.quizWords.map(
                    (word, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={() => setDraggedWord(word)}
                        className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] text-white px-4 py-2 rounded-lg font-medium cursor-grab active:cursor-grabbing hover:scale-105 transition-all duration-200"
                      >
                        {word}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {isComplete && (
                <div className="text-center space-y-4">
                  <div className="text-6xl kid-bounce">🎉</div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: "#FFD600" }}
                  >
                    Fantastic! You did it!
                  </h3>
                  <p
                    style={{ color: "rgba(30, 58, 138, 0.7)" }}
                  >
                    You completed the sentence perfectly!
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setQuizProgress([])}
                    className="bg-gradient-to-r from-[#3B82F6] to-[#00B9FC] hover:opacity-90 text-white rounded-lg px-6"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}
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
              message="Drag the words to complete the sentence! You’re doing awesome! 😄✨"
              showMessage={showMelloMessage}
              onMessageDismiss={() =>
                setShowMelloMessage(false)
              }
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
      </div>
    );
  };

  switch (currentView) {
    case "selection":
      return renderSpeechSelection();
    case "speech-detail":
      return renderSpeechDetail();
    case "quiz":
      return renderQuiz();
    default:
      return renderSpeechSelection();
  }
}