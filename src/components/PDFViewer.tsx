import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Star,
  Heart,
  Sparkles,
  Award,
} from "lucide-react";
import { ClassData, Chapter } from "./types";

interface PDFViewerProps {
  classData: ClassData;
  chapter: Chapter;
  currentPage: number;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageSelect: (page: number) => void;
}

export function PDFViewer({
  classData,
  chapter,
  currentPage,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onNextPage,
  onPrevPage,
  onPageSelect,
}: PDFViewerProps) {
  const totalPages = chapter.pages.length;

  return (
    <Card className="bg-white/95 border-0 shadow-2xl mb-8 sm:overflow-hidden">
      {/* Viewer Controls */}
      <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563eb] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onZoomOut}
              disabled={zoomLevel <= 70}
              className="bg-white/90 hover:bg-white text-[#1E3A8A] shadow-md"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onResetZoom}
              className="bg-white/90 hover:bg-white text-[#1E3A8A] shadow-md min-w-[80px]"
            >
              {zoomLevel}%
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onZoomIn}
              disabled={zoomLevel >= 150}
              className="bg-white/90 hover:bg-white text-[#1E3A8A] shadow-md"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={onPrevPage}
                disabled={currentPage === 0}
                className="bg-white/90 hover:bg-white text-[#1E3A8A] shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm font-medium px-3">
                Page {currentPage + 1} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={onNextPage}
                disabled={currentPage === totalPages - 1}
                className="bg-white/90 hover:bg-white text-[#1E3A8A] shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* PDF Content Area */}
      <CardContent className="p-4 md:p-8 lg:p-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-[500px] flex items-center justify-center relative sm:overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-20 hidden sm:block">
          <Star className="w-16 h-16 text-yellow-400 animate-pulse" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20 hidden sm:block">
          <Heart className="w-16 h-16 text-pink-400 animate-pulse" />
        </div>
        <div className="absolute top-1/2 right-20 opacity-10 hidden sm:block">
          <Sparkles className="w-20 h-20 text-purple-400" />
        </div>

        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl z-10"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.3s ease",
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 border-4 border-[#3B82F6]/30 relative">
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#FFD600]/30 to-transparent rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#3B82F6]/30 to-transparent rounded-br-3xl"></div>

            {/* Header */}
            <div className="flex items-start gap-4 mb-8 pb-6 border-b-4 border-gradient-to-r from-[#3B82F6]/20 via-[#FFD600]/20 to-[#3B82F6]/20">
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transform hover:rotate-6 transition-transform"
                  style={{ backgroundImage: classData.gradient }}
                >
                  <span className="text-3xl">{chapter.emoji}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl text-[#1E3A8A] mb-2 font-bold">
                  {chapter.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30">
                    {classData.title}
                  </Badge>
                  <Badge className="bg-[#FFD600]/10 text-[#1E3A8A] border-[#FFD600]/30">
                    Page {currentPage + 1}/{totalPages}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Illustration for younger classes */}
            {(classData.id === "class-1" ||
              classData.id === "class-2" ||
              classData.id === "class-3") && (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759977064094-840dfc694bee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHJlYWRpbmclMjBib29rcyUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjIyNDk4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Reading illustration"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Content with icons */}
            <div className="prose prose-lg max-w-none">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <BookOpen className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <p
                  className="text-gray-800 leading-relaxed text-justify whitespace-pre-line flex-1"
                  style={{ fontSize: "1.125rem", lineHeight: "1.875rem" }}
                >
                  {chapter.pages[currentPage]}
                </p>
              </div>
            </div>

            {/* Fun facts or tips for older classes */}
            {parseInt(classData.id.split("-")[1]) >= 7 && (
              <div className="mt-8 p-4 bg-gradient-to-r from-[#FFD600]/10 to-[#FFA500]/10 rounded-xl border-2 border-[#FFD600]/30">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-[#FFA500] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-[#1E3A8A] mb-1">
                      💡 Reading Tip
                    </p>
                    <p className="text-sm text-gray-700">
                      Take your time to understand each sentence. Practice
                      reading this passage multiple times to improve your
                      fluency!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Page indicators */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 pt-6 border-t-2 border-dashed border-[#3B82F6]/20">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentPage
                        ? "bg-gradient-to-r from-[#3B82F6] to-[#2563eb] w-10 shadow-lg"
                        : "bg-gray-300 hover:bg-gray-400 w-3"
                    }`}
                    onClick={() => onPageSelect(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
