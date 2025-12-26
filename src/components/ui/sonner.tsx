"use client";

import { Toaster as Sonner } from "sonner@2.0.3";
import { useTheme } from "../ThemeProvider";

const Toaster = () => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme === "dark" ? "dark" : "light"}
      className="toaster group"
      style={
        {
          "--normal-bg": theme === "dark" ? "#1F2937" : "#FFFFFF",
          "--normal-text": theme === "dark" ? "#F9FAFB" : "#111827",
          "--normal-border": theme === "dark" ? "#374151" : "#E5E7EB",
        } as React.CSSProperties
      }
      position="top-right"
      richColors
    />
  );
};

export { Toaster };
