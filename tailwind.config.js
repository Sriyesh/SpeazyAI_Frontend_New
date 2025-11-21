/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          900: "#164E63",
        },
      },
    },
  },
  plugins: [],
  safelist: [
    // 🔵 Blue colors
    "bg-blue-50", "bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-blue-500", "bg-blue-600", "bg-blue-700",
    "text-blue-500", "text-blue-600", "text-blue-700",
    "border-blue-100", "border-blue-200",
    "hover:bg-blue-500", "hover:bg-blue-600", "hover:bg-blue-700",
    "shadow-blue-500/30",

    // 🟢 Green/Emerald colors
    "bg-green-50", "bg-green-100", "bg-green-400", "bg-green-500", "bg-green-600",
    "bg-emerald-50", "bg-emerald-100", "bg-emerald-500", "bg-emerald-600",
    "text-green-600", "text-emerald-500", "text-emerald-600", "text-emerald-700",
    "border-emerald-100", "border-green-200", "border-green-400",
    "hover:bg-green-600",

    // 🟣 Purple/Pink colors
    "bg-purple-50", "bg-purple-100", "bg-purple-500", "bg-purple-600",
    "bg-pink-50", "bg-pink-500",
    "text-purple-500", "text-purple-600", "text-purple-700",
    "border-purple-100",

    // 🟡 Yellow/Amber colors
    "bg-yellow-50", "bg-yellow-100", "bg-yellow-500",
    "bg-amber-50", "bg-amber-100", "bg-amber-500",
    "text-yellow-500", "text-yellow-600", "text-yellow-700",
    "border-amber-100", "border-yellow-100",

    // 🔴 Red colors
    "bg-red-100", "bg-red-500", "bg-red-600",
    "text-red-600",
    "hover:bg-red-600",

    // 🟠 Orange colors
    "bg-orange-100", "bg-orange-400", "bg-orange-500",
    "text-orange-600",
    "border-orange-400",

    // 🌈 Cyan/Teal colors
    "bg-cyan-50", "bg-cyan-400", "bg-cyan-500",
    "bg-teal-50", "bg-teal-500",
    "text-cyan-500", "text-teal-500",
    "to-cyan-50", "to-cyan-400", "to-cyan-500", "to-cyan-900",
    "to-teal-50", "to-teal-500",

    // 💙 Indigo/Slate colors
    "bg-indigo-50", "bg-indigo-500", "bg-indigo-600", "bg-indigo-700",
    "bg-slate-50",
    "text-indigo-600", "text-indigo-700",
    "to-indigo-50", "to-indigo-600", "to-indigo-700",

    // 🌈 Gradient classes
    "bg-gradient-to-r", "bg-gradient-to-br",
    "from-blue-50", "from-blue-500", "from-blue-600",
    "from-emerald-50", "from-emerald-500",
    "from-purple-50", "from-purple-500",
    "from-amber-50", "from-amber-500",
    "from-slate-50",
    "via-blue-50",
    "to-teal-50", "to-green-50", "to-pink-50",

    // 📦 Shadow classes
    "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl", "shadow-inner",
    "drop-shadow-sm", "drop-shadow-md",

    // 🎨 Border classes
    "border", "border-transparent", "border-gray-100", "border-gray-200",
    "border-b", "rounded-t-2xl", "rounded-xl", "rounded-2xl", "rounded-lg", "rounded-md", "rounded-full",

    // 🎭 Background opacity
    "bg-white/20", "bg-white/60", "bg-white/80",

    // ✨ Effects
    "backdrop-blur-sm",
    "transform", "scale-105",
    "transition-all", "duration-300", "duration-500", "ease-out",

    // 📐 Spacing and layout
    "p-2", "p-4", "p-5", "p-6",
    "px-2", "px-4", "py-1", "py-3",
    "gap-2", "gap-3", "gap-6",
    "mb-2", "mb-3", "mb-4", "mb-6",
    "mt-1", "mt-6",
    "space-y-2", "space-y-3", "space-y-4", "space-y-6",

    // 📝 Text classes
    "text-xs", "text-sm", "text-xl", "text-3xl", "text-4xl",
    "font-medium", "font-semibold", "font-bold",
    "text-center", "text-white", "text-gray-400", "text-gray-500", "text-gray-600", "text-gray-700", "text-gray-900",
    "uppercase", "tracking-widest",
    "bg-clip-text", "text-transparent",

    // 🎯 Flex and positioning
    "flex", "flex-1", "flex-shrink-0", "items-center", "justify-center", "justify-between",
    "w-full", "w-4", "w-5", "w-6", "w-12", "w-32", "w-36", "w-64",
    "h-4", "h-5", "h-6", "h-12", "h-32", "h-36", "min-h-[600px]",
    "relative", "absolute", "inset-0", "mx-auto",

    // 🎨 Hover states
    "hover:bg-gray-50", "hover:text-gray-900", "hover:shadow-md", "hover:border-gray-200",
  ],
};
