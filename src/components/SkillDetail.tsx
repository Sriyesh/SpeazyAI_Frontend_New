import { useParams, useNavigate } from "react-router-dom"
import { Card } from "./ui/card"

const skillMap: Record<
  string,
  { title: string; items: { label: string; route: string }[] }
> = {
  reading: {
    title: "Reading",
    items: [
      { label: "My Lessons", route: "/my-lessons" },
      { label: "Custom Content", route: "/custom-content" },
      { label: "Learn Your Own Way", route: "/quick-practice" },
    ],
  },
  writing: {
    title: "Writing",
    items: [
      { label: "Writing Practice", route: "/writing-practice" },
      { label: "Work from Teacher", route: "/writing/work-from-teacher" },
      { label: "Practise Yourself", route: "/writing/practise-yourself" },
      { label: "IELTS", route: "/ielts" },
      { label: "Sample View", route: "/writing/sample-view" },
      { label: "Connect to Teacher", route: "/connect-teacher" },
    ],
  },
  listening: {
    title: "Listening",
    items: [{ label: "Listening Practice", route: "/listening-practice" }],
  },
  speaking: {
    title: "Speaking",
    items: [
      { label: "My Lessons", route: "/my-lessons" },
      { label: "AI Tutor", route: "/chat" },
      { label: "Custom Content", route: "/custom-content" },
      { label: "Learn Your Own Way", route: "/quick-practice" },
    ],
  },
  "ai-tutor": {
    title: "AI Tutor",
    items: [{ label: "Open AI Tutor", route: "/chat" }],
  },
}

export function SkillDetail() {
  const { skillId } = useParams()
  const navigate = useNavigate()

  const skill = skillMap[skillId || ""]

  if (!skill) return null

  return (
    <div className="min-h-screen bg-[#123A8A] px-6 py-14">
      <h2 className="text-3xl text-white mb-10">{skill.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {skill.items.map((item) => (
          <Card
            key={item.label}
            onClick={() => navigate(item.route)}
            className="cursor-pointer bg-white rounded-3xl px-8 py-10
                       flex items-center justify-center text-center
                       shadow-lg transition-all duration-300
                       hover:-translate-y-2 hover:shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-[#0F1F47]">
              {item.label}
            </h3>
          </Card>
        ))}
      </div>
    </div>
  )
}
