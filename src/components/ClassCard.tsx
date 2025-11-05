import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BookOpen, ChevronDown } from "lucide-react";
import { ClassData, Chapter } from "./types";
import { ChapterTile } from "./ChapterTile";

interface ClassCardProps {
  classData: ClassData;
  isExpanded: boolean;
  onToggle: () => void;
  onChapterSelect: (chapter: Chapter) => void;
}

export function ClassCard({
  classData,
  isExpanded,
  onToggle,
  onChapterSelect,
}: ClassCardProps) {
  return (
    <Card className="bg-white/95 border-0 shadow-lg overflow-hidden">
      {/* Class Header */}
      <div
        onClick={onToggle}
        className="cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundImage: classData.gradient }}
              >
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-[#1E3A8A]">
                  {classData.title}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {classData.description} • {classData.chapters.length} chapters
                </p>
                <Badge variant="secondary" className="mt-1">
                  {classData.ageGroup}
                </Badge>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-[#1E3A8A]" />
            </motion.div>
          </div>
        </CardHeader>
      </div>

      {/* Expanded Chapters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {classData.chapters.map((chapter, index) => (
                  <ChapterTile
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    gradient={classData.gradient}
                    onSelect={() => onChapterSelect(chapter)}
                  />
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
