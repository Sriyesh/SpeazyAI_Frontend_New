export type RecordingState = "idle" | "recording" | "stopped";

export interface Chapter {
  id: string;
  title: string;
  content: string;
  pages: string[];
  color: string;
  emoji: string;
}

export interface ClassData {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  gradient: string;
  chapters: Chapter[];
}
