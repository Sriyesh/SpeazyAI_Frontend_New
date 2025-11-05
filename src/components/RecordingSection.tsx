import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, Square, Sparkles } from "lucide-react";
import { RecordingState } from "./types";

interface RecordingSectionProps {
  recordingState: RecordingState;
  audioLevel: number[];
  gradient: string;
  onRecord: () => void;
  onStop: () => void;
}

export function RecordingSection({
  recordingState,
  audioLevel,
  gradient,
  onRecord,
  onStop,
}: RecordingSectionProps) {
  return (
    <Card className="bg-white border-0 shadow-2xl mb-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#FFD600] via-[#FFA500] to-[#FFD600] relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIi8+PC9zdmc+')] opacity-50"></div>
        <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Mic className="w-6 h-6 text-[#1E3A8A]" />
          </div>
          <span>🎙️ Practice Your Reading</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6 bg-gradient-to-b from-white to-gray-50">
        <div className="flex flex-col items-center gap-4">
          {recordingState === "idle" && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onRecord}
                  size="lg"
                  className="w-56 h-20 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl rounded-2xl relative overflow-hidden group"
                  style={{ backgroundImage: gradient }}
                >
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  <Mic className="w-7 h-7 mr-3 relative z-10 group-hover:animate-pulse" />
                  <span className="relative z-10">Start Recording</span>
                </Button>
              </motion.div>
              <p className="text-base text-gray-600 mt-4 font-medium">
                🎤 Ready to practice? Click the button above!
              </p>
              <div className="mt-6 flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl">👂</span>
                  </div>
                  <p className="text-xs text-gray-600">Listen</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl">🗣️</span>
                  </div>
                  <p className="text-xs text-gray-600">Speak</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <p className="text-xs text-gray-600">Improve</p>
                </div>
              </div>
            </motion.div>
          )}

          {recordingState === "recording" && (
            <div className="w-full space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                <div className="flex justify-center items-center gap-1 h-40 bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 rounded-3xl p-6 shadow-inner border-4 border-red-200/50">
                  {audioLevel.map((level, index) => (
                    <motion.div
                      key={index}
                      className="w-2 bg-gradient-to-t from-red-500 via-pink-500 to-red-400 rounded-full shadow-lg"
                      style={{ height: `${level}%` }}
                      animate={{ height: `${level}%` }}
                      transition={{ duration: 0.08 }}
                    />
                  ))}
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 bg-red-500 rounded-full shadow-lg"
                  ></motion.div>
                  <span className="text-sm font-bold text-red-600">LIVE</span>
                </div>
              </motion.div>

              <div className="flex flex-col items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onStop}
                    size="lg"
                    className="w-56 h-20 bg-gradient-to-r from-red-500 via-pink-600 to-red-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl rounded-2xl"
                  >
                    <Square className="w-7 h-7 mr-3 animate-pulse" />
                    Stop Recording
                  </Button>
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-3 text-red-600"
                >
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <span className="text-lg font-semibold">Recording in progress...</span>
                </motion.div>
              </div>
            </div>
          )}

          {recordingState === "stopped" && (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#3B82F6]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#3B82F6] animate-pulse" />
                </div>
              </div>
              <p className="text-gray-700 text-xl font-medium mb-2">
                Analyzing your recording...
              </p>
              <p className="text-base text-gray-500">
                ✨ Our AI is evaluating your performance
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-3 h-3 bg-[#3B82F6] rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-3 h-3 bg-[#3B82F6] rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-3 h-3 bg-[#3B82F6] rounded-full"
                ></motion.div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
