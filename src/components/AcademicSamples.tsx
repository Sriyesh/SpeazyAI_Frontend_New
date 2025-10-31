import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  Mic,
  Square,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Star,
  Trophy,
  Heart,
  Volume2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AcademicSamplesProps {
  onBack: () => void;
}

type View = "class-selection" | "recording-session";
type PronunciationScore =
  | "excellent"
  | "good"
  | "needs-practice"
  | null;

const classes = [
  {
    id: "ukg",
    title: "UKG",
    description: "First words with animated pictures",
    ageGroup: "3-5 years",
    icon: "🎈",
    color: "from-amber-500 to-orange-600",
    isNew: true,
    words: [
      {
        word: "Apple",
        encouragement: "Yay! Apple is red and yummy! 🍎",
        hasAnimation: false,
      },
      {
        word: "Ball",
        encouragement: "Woohoo! Ball bounces up and down! ⚽",
        hasAnimation: false,
      },
      {
        word: "Car",
        encouragement: "Vroom vroom! Cars go fast! 🚗",
        hasAnimation: false,
      },
      {
        word: "Duck",
        encouragement: "Quack quack! Ducks swim in water! 🦆",
        hasAnimation: false,
      },
      {
        word: "Fish",
        encouragement: "Splash! Fish swim in the sea! 🐠",
        hasAnimation: true,
      },
      {
        word: "Sun",
        encouragement:
          "Bright and shiny! Sun gives us light! ☀️",
        hasAnimation: true,
      },
    ],
  },
  {
    id: "class-1-2",
    title: "Class 1-2",
    description: "Fun words for little learners",
    ageGroup: "5-7 years",
    icon: "🌱",
    color: "from-emerald-500 to-teal-600",
    words: [
      {
        word: "Apple",
        encouragement: "Great job! Apples are yummy!",
      },
      {
        word: "Orange",
        encouragement: "Awesome! Oranges are so bright!",
      },
      {
        word: "Banana",
        encouragement: "Perfect! Bananas are sweet!",
      },
      {
        word: "Ball",
        encouragement: "Fantastic! Let's play ball!",
      },
      {
        word: "Cat",
        encouragement: "Wonderful! Cats say meow!",
      },
      {
        word: "Dog",
        encouragement: "Amazing! Dogs are friendly!",
      },
    ],
  },
  {
    id: "class-3-4",
    title: "Class 3-4",
    description: "Building vocabulary skills",
    ageGroup: "8-10 years",
    icon: "🌟",
    color: "from-indigo-500 to-pink-600",
    words: [
      {
        word: "Butterfly",
        encouragement: "Excellent! Butterflies are beautiful!",
      },
      {
        word: "Rainbow",
        encouragement: "Brilliant! Rainbows have many colors!",
      },
      {
        word: "Mountain",
        encouragement: "Super! Mountains are tall!",
      },
      {
        word: "Ocean",
        encouragement: "Terrific! Oceans are deep and blue!",
      },
      {
        word: "Friendship",
        encouragement: "Outstanding! Friends are special!",
      },
      {
        word: "Adventure",
        encouragement: "Incredible! Let's go exploring!",
      },
    ],
  },
  {
    id: "class-5-6",
    title: "Class 5-6",
    description: "Advanced speaking practice",
    ageGroup: "11-13 years",
    icon: "🚀",
    color: "from-blue-600 to-purple-700",
    words: [
      {
        word: "Confidence",
        encouragement:
          "Excellent! You're speaking with confidence!",
      },
      {
        word: "Discovery",
        encouragement: "Amazing! Science helps us discover!",
      },
      {
        word: "Creativity",
        encouragement: "Wonderful! Art shows creativity!",
      },
      {
        word: "Perseverance",
        encouragement: "Outstanding! Never give up!",
      },
      {
        word: "Leadership",
        encouragement: "Fantastic! Be a great leader!",
      },
      {
        word: "Innovation",
        encouragement: "Brilliant! New ideas change the world!",
      },
    ],
  },
];

export function AcademicSamples({
  
  onBack,
}: AcademicSamplesProps) {
  const [currentView, setCurrentView] = useState<View>(
    "class-selection",
  );
  const [selectedClass, setSelectedClass] = useState<
    (typeof classes)[0] | null
  >(null);
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedWords, setRecordedWords] = useState<number[]>(
    [],
  );
  const [showEncouragement, setShowEncouragement] =
    useState(false);
  const [pronunciationScore, setPronunciationScore] =
    useState<PronunciationScore>(null);
  const [showPronunciationResult, setShowPronunciationResult] =
    useState(false);
  const [
    isPlayingCorrectPronunciation,
    setIsPlayingCorrectPronunciation,
  ] = useState(false);
  const [
    showCorrectPronunciationButton,
    setShowCorrectPronunciationButton,
  ] = useState(false);

  const handleClassSelect = (
    classItem: (typeof classes)[0],
  ) => {
    setSelectedClass(classItem);
    setCurrentView("recording-session");
    setCurrentWordIndex(0);
    setRecordedWords([]);
  };

  const simulatePronunciationCheck = (): PronunciationScore => {
    const rand = Math.random();
    if (rand < 0.4) return "excellent";
    if (rand < 0.8) return "good";
    return "needs-practice";
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => {
        const score = simulatePronunciationCheck();
        setPronunciationScore(score);
        setShowPronunciationResult(true);
        setShowCorrectPronunciationButton(true);
        if (score === "excellent" || score === "good") {
          setRecordedWords([
            ...recordedWords,
            currentWordIndex,
          ]);
          setShowEncouragement(true);
        }
        setTimeout(() => {
          setShowPronunciationResult(false);
          setShowEncouragement(false);
        }, 4000);
      }, 1000);
    } else {
      setIsRecording(true);
      setShowPronunciationResult(false);
      setPronunciationScore(null);
    }
  };

  const handlePlayCorrectPronunciation = () => {
    setIsPlayingCorrectPronunciation(true);
    setTimeout(() => {
      setIsPlayingCorrectPronunciation(false);
    }, 2000);
  };

  const handleNextWord = () => {
    if (
      selectedClass &&
      currentWordIndex < selectedClass.words.length - 1
    ) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowEncouragement(false);
      setShowPronunciationResult(false);
      setPronunciationScore(null);
      setShowCorrectPronunciationButton(false);
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowEncouragement(false);
      setShowPronunciationResult(false);
      setPronunciationScore(null);
      setShowCorrectPronunciationButton(false);
    }
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setRecordedWords([]);
    setShowEncouragement(false);
    setShowPronunciationResult(false);
    setPronunciationScore(null);
    setShowCorrectPronunciationButton(false);
  };

  const bgProps = {
    className:
      "min-h-screen relative bg-[#1E3A8A] bg-center bg-no-repeat bg-cover",
  };

  const renderClassSelection = () => (
    <div {...bgProps}>
      <header className="bg-[#1E3A8A]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-white/10 hover:text-amber-300 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Academic Speaking
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Embark on Your Learning Journey
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Master new words tailored to your age group with fun
            and interactive practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {classes.map((classItem) => (
            <Card
              key={classItem.id}
              className="group bg-white/95 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden hover:-translate-y-2 rounded-2xl"
              onClick={() => handleClassSelect(classItem)}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                {classItem.id === "ukg" && (
                  <>
                    <div className="absolute top-4 right-4 text-amber-400 animate-pulse">
                      ⭐
                    </div>
                    <div className="absolute bottom-4 left-4 text-pink-400 animate-bounce">
                      ✨
                    </div>
                  </>
                )}
                {classItem.id === "class-1-2" && (
                  <>
                    <div className="absolute top-4 right-4 text-emerald-400 animate-spin-slow">
                      🌍
                    </div>
                    <div className="absolute bottom-4 left-4 text-blue-400 animate-pulse">
                      🚀
                    </div>
                  </>
                )}
              </div>

              {classItem.isNew && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md animate-pulse">
                    NEW ✨
                  </div>
                </div>
              )}

              <div className="absolute top-4 left-4 z-10">
                <div className="text-4xl animate-bounce">
                  {classItem.icon}
                </div>
              </div>

              <CardHeader className="pb-4 pt-16">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${classItem.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl mx-auto`}
                >
                  <Mic className="w-8 h-8 text-white" />
                </div>

                <CardTitle className="text-xl font-semibold text-center text-[#1E3A8A] group-hover:text-amber-600 transition-colors duration-300">
                  {classItem.title}
                </CardTitle>
                <p className="text-sm text-[#1E3A8A]/70 text-center">
                  {classItem.description}
                </p>
                <p className="text-xs text-[#1E3A8A]/50 text-center">
                  {classItem.ageGroup}
                </p>
              </CardHeader>

              <CardContent className="text-center">
                <div className="mb-4">
                  <p className="text-sm text-[#1E3A8A]/60">
                    {classItem.words.length} words to master
                  </p>
                </div>

                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${classItem.color} hover:opacity-90 hover:scale-105 text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  Begin Practice
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecordingSession = () => {
    if (!selectedClass) return null;

    const currentWord = selectedClass.words[currentWordIndex];
    const isWordRecorded =
      recordedWords.includes(currentWordIndex);
    const progress =
      (recordedWords.length / selectedClass.words.length) * 100;

    return (
      <div {...bgProps}>
        <header className="bg-[#1E3A8A]/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentView("class-selection")
                }
                className="text-white hover:bg-white/10 hover:text-amber-300 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Classes
              </Button>
              <h1 className="text-xl font-semibold text-white tracking-tight">
                {selectedClass.title} Practice
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestart}
                className="text-white hover:bg-white/10 hover:text-amber-300 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/60">
                Progress
              </span>
              <span className="text-sm font-medium text-white">
                {recordedWords.length} /{" "}
                {selectedClass.words.length}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className={`h-3 bg-gradient-to-r ${selectedClass.color} rounded-full transition-all duration-500 shadow-md`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Main Word Card */}
          <Card className="mb-8 bg-white/95 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <h2 className="text-5xl font-bold text-[#1E3A8A] mb-8 tracking-tight">
                {currentWord.word}
              </h2>

              <Button
                size="lg"
                onClick={handleRecord}
                disabled={isPlayingCorrectPronunciation}
                className={`w-32 h-32 rounded-full shadow-2xl transform transition-all duration-500 ${
                  isRecording
                    ? "bg-gradient-to-r from-red-500 to-pink-600 animate-pulse scale-110"
                    : isWordRecorded
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 animate-bounce"
                      : `bg-gradient-to-r ${selectedClass.color} hover:scale-110`
                }`}
              >
                {isRecording ? (
                  <Square className="w-12 h-12 text-white" />
                ) : isWordRecorded ? (
                  <Trophy className="w-12 h-12 text-white" />
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )}
              </Button>

              <p className="text-xl text-[#1E3A8A]/70 mt-6 mb-4">
                {isRecording
                  ? "🎤 Recording... Speak clearly!"
                  : isWordRecorded
                    ? "🎉 Well done! Word mastered!"
                    : "🚀 Tap to start speaking!"}
              </p>

              {showEncouragement && (
                <p className="text-lg text-amber-600 font-semibold animate-fade-in">
                  {currentWord.encouragement}
                </p>
              )}

              {showPronunciationResult &&
                pronunciationScore && (
                  <div className="mt-4 flex items-center justify-center gap-2 animate-fade-in">
                    {pronunciationScore === "excellent" && (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    )}
                    {pronunciationScore === "good" && (
                      <Star className="w-6 h-6 text-amber-500" />
                    )}
                    {pronunciationScore ===
                      "needs-practice" && (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                    <p className="text-lg font-semibold text-[#1E3A8A]">
                      {pronunciationScore === "excellent"
                        ? "Excellent pronunciation!"
                        : pronunciationScore === "good"
                          ? "Good effort!"
                          : "Needs more practice!"}
                    </p>
                  </div>
                )}

              {showCorrectPronunciationButton && (
                <Button
                  size="sm"
                  onClick={handlePlayCorrectPronunciation}
                  disabled={isPlayingCorrectPronunciation}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl px-6 hover:scale-105 transition-all duration-300"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isPlayingCorrectPronunciation
                    ? "Playing..."
                    : "Hear Correct Pronunciation"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              size="lg"
              onClick={handlePrevWord}
              disabled={currentWordIndex === 0}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl px-6 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              size="lg"
              onClick={handleNextWord}
              disabled={
                currentWordIndex ===
                selectedClass.words.length - 1
              }
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl px-6 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return currentView === "class-selection"
    ? renderClassSelection()
    : renderRecordingSession();
}