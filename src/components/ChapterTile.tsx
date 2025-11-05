import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { ChevronRight, Sparkles } from "lucide-react";
import { Chapter } from "./types";

interface ChapterTileProps {
  chapter: Chapter;
  index: number;
  gradient: string;
  onSelect: () => void;
}

export function ChapterTile({
  chapter,
  index,
  gradient,
  onSelect,
}: ChapterTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        onClick={onSelect}
        className="group cursor-pointer border-3 border-gray-300 hover:border-[#3B82F6] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative"
        style={{ backgroundColor: chapter.color }}
      >
        {/* Sparkle effect on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="w-5 h-5 text-[#3B82F6] animate-pulse" />
        </div>

        <CardContent className="p-5">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="text-4xl group-hover:scale-125 transition-transform duration-300">
              {chapter.emoji}
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
              style={{ backgroundImage: gradient }}
            >
              <span className="text-sm font-bold">{index + 1}</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#1E3A8A] transition-colors leading-snug">
              {chapter.title}
            </p>
            <div className="flex items-center gap-1 text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-xs font-medium">Start Reading</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
