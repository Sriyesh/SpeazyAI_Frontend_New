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
    // 🔵 Blue buttons and hover states
    "bg-blue-50",
    "bg-blue-100",
    "bg-blue-200",
    "bg-blue-300",
    "bg-blue-400",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-700",
    "hover:bg-blue-500",
    "hover:bg-blue-600",
    "hover:bg-blue-700",
    "text-blue-600",

    // 🟢 Green score boxes
    "bg-green-100",
    "bg-green-400",
    "bg-green-500",
    "bg-green-600",
    "hover:bg-green-600",
    "text-green-600",

    // 🟠 Orange score boxes
    "bg-orange-100",
    "bg-orange-400",
    "bg-orange-500",
    "text-orange-600",

    // 🔴 Record button
    "bg-red-500",
    "bg-red-600",
    "hover:bg-red-600",
    "text-red-600",

    // 🌈 Gradients (used in your buttons)
    "bg-gradient-to-r",
    "from-blue-500",
    "from-blue-600",
    "to-cyan-400",
    "to-cyan-900",

    // Common classes
    "text-white",
    "rounded-full",
    "hover:opacity-90",
    "shadow-lg",
    "transition-all",
  ],
};
