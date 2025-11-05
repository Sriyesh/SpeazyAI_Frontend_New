import { forwardRef } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { RotateCcw, Volume2 } from "lucide-react";

interface ResultsSectionProps {
  score: number;
  onTryAgain: () => void;
}

export const ResultsSection = forwardRef<HTMLDivElement, ResultsSectionProps>(
  ({ score, onTryAgain }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", bounce: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-white via-blue-50 to-purple-50 border-0 shadow-2xl overflow-hidden relative">
          {/* Celebration confetti effect */}
          {score >= 85 && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-10 text-4xl animate-bounce">
                🎉
              </div>
              <div
                className="absolute top-20 right-20 text-4xl animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                ⭐
              </div>
              <div
                className="absolute bottom-20 left-20 text-4xl animate-bounce"
                style={{ animationDelay: "0.4s" }}
              >
                🌟
              </div>
              <div
                className="absolute bottom-10 right-10 text-4xl animate-bounce"
                style={{ animationDelay: "0.1s" }}
              >
                ✨
              </div>
            </div>
          )}

          <CardHeader className="bg-gradient-to-r from-[#FFD600] via-[#FFA500] to-[#FFD600] text-white rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIi8+PC9zdmc+')] opacity-50"></div>
            <CardTitle className="text-3xl flex items-center gap-3 relative z-10 text-[#1E3A8A]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                {score >= 85 ? (
                  <span className="text-4xl">🏆</span>
                ) : score >= 70 ? (
                  <span className="text-4xl">🌟</span>
                ) : (
                  <span className="text-4xl">💪</span>
                )}
              </div>
              <div>
                {score >= 85
                  ? "Outstanding Performance!"
                  : score >= 70
                    ? "Great Job!"
                    : "Keep Practicing!"}
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-10 space-y-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Score Circle with decorative elements */}
              <div className="flex-shrink-0 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#3B82F6]/20 to-[#FFD600]/20 rounded-full blur-xl"></div>

                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="85"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="85"
                      stroke={
                        score >= 85
                          ? "url(#gradient-excellent)"
                          : score >= 70
                            ? "url(#gradient-good)"
                            : "url(#gradient-practice)"
                      }
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 85}`}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 85 * (1 - score / 100),
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient
                        id="gradient-excellent"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                      <linearGradient
                        id="gradient-good"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                      <linearGradient
                        id="gradient-practice"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#fb923c" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                      >
                        <span className="text-5xl font-bold text-[#1E3A8A] block">
                          {score}
                        </span>
                        <span className="text-2xl text-gray-600">%</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Text */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <h3 className="text-3xl text-[#1E3A8A] font-bold">
                  {score >= 85
                    ? "🎉 Excellent work! Your reading was clear and confident!"
                    : score >= 70
                      ? "👏 Well done! You're making great progress!"
                      : "💪 Good effort! Keep practicing to improve further!"}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {score >= 85
                    ? "Your pronunciation, fluency, and expression were all outstanding. You've mastered this content! You're a reading superstar!"
                    : score >= 70
                      ? "Your reading shows good understanding. Practice a bit more to polish your delivery and you'll be perfect!"
                      : "Don't worry! Every practice session helps you improve. Try reading it again and focus on clarity. You're doing great!"}
                </p>

                {/* Achievement badges */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {score >= 85 && (
                    <>
                      <Badge className="bg-green-100 text-green-700 border-green-300 px-4 py-2 text-sm">
                        ⭐ Perfect Score
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 px-4 py-2 text-sm">
                        🏆 Achievement Unlocked
                      </Badge>
                    </>
                  )}
                  {score >= 70 && score < 85 && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 px-4 py-2 text-sm">
                      ✨ Great Progress
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="space-y-5 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border-2 border-[#3B82F6]/20 shadow-lg">
              <h4 className="text-xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563eb] rounded-lg flex items-center justify-center text-white shadow-md">
                  📊
                </div>
                Detailed Analysis
              </h4>

              <div className="space-y-5">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold text-gray-700 flex items-center gap-3">
                      <span className="text-2xl">🗣️</span>
                      <span>Pronunciation</span>
                    </span>
                    <span className="text-xl font-bold text-[#1E3A8A] bg-[#3B82F6]/10 px-3 py-1 rounded-lg">
                      {Math.min(score + 5, 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(score + 5, 100)}
                    className="h-4 bg-gray-200"
                  />
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold text-gray-700 flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <span>Fluency</span>
                    </span>
                    <span className="text-xl font-bold text-[#1E3A8A] bg-[#3B82F6]/10 px-3 py-1 rounded-lg">
                      {Math.max(score - 3, 0)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.max(score - 3, 0)}
                    className="h-4 bg-gray-200"
                  />
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold text-gray-700 flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      <span>Clarity</span>
                    </span>
                    <span className="text-xl font-bold text-[#1E3A8A] bg-[#3B82F6]/10 px-3 py-1 rounded-lg">
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-4 bg-gray-200" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onTryAgain}
                  className="w-full bg-gradient-to-r from-[#3B82F6] via-[#2563eb] to-[#3B82F6] text-white hover:shadow-2xl transition-all h-14 text-lg rounded-xl"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  🔄 Try Again
                </Button>
              </motion.div>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full border-3 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10 h-14 text-lg rounded-xl font-semibold"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  🔊 Listen to Recording
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

ResultsSection.displayName = "ResultsSection";
