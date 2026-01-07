"use client";

import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BookOpen, Layers, Lightbulb } from "lucide-react";

export default function ReadingPage() {
  const BLUE_BG: React.CSSProperties = {
    backgroundColor: "#123A8A",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    position: "relative",
    fontFamily: "Fredoka, sans-serif",
  };

  const backgroundStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex: -10,
    ...BLUE_BG,
  };

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const headerContentStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: "64px",
  };

  const titleStyle: React.CSSProperties = {
    color: "white",
    fontSize: "18px",
    fontWeight: 600,
    display: "flex",
    gap: "8px",
    alignItems: "center",
  };

  const mainStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 24px",
    maxWidth: "1152px",
    margin: "0 auto",
    textAlign: "center",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "clamp(30px, 4vw, 36px)",
    color: "white",
    fontWeight: 800,
    marginBottom: "40px",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "32px",
    width: "100%",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const cardHoverStyle: React.CSSProperties = {
    ...cardStyle,
    boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
  };

  const iconContainerStyle1: React.CSSProperties = {
    width: "64px",
    height: "64px",
    marginBottom: "16px",
    borderRadius: "50%",
    background: "linear-gradient(to bottom right, #38bdf8, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const iconContainerStyle2: React.CSSProperties = {
    ...iconContainerStyle1,
    background: "linear-gradient(to bottom right, #4ade80, #10b981)",
  };

  const iconContainerStyle3: React.CSSProperties = {
    ...iconContainerStyle1,
    background: "linear-gradient(to bottom right, #fde047, #eab308)",
  };

  const iconStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    color: "white",
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0F1F47",
    marginBottom: "8px",
  };

  const cardTextStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "rgba(15, 31, 71, 0.7)",
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle} />

      {/* HEADER */}
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <h1 style={titleStyle}>
            <BookOpen style={{ width: "20px", height: "20px", color: "white" }} />
            Reading Skills
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={mainStyle}>
        <h2 style={headingStyle}>
          Dive into Reading 📖
        </h2>

        <div style={gridStyle}>
          {/* My Lessons */}
          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 20px 25px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={iconContainerStyle1}>
              <BookOpen style={iconStyle} />
            </div>
            <h3 style={cardTitleStyle}>My Lessons</h3>
            <p style={cardTextStyle}>Track, continue, or revise lessons at your pace.</p>
          </div>

          {/* Custom Content */}
          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 20px 25px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={iconContainerStyle2}>
              <Layers style={iconStyle} />
            </div>
            <h3 style={cardTitleStyle}>Custom Content</h3>
            <p style={cardTextStyle}>Access personalized reading materials and uploads.</p>
          </div>

          {/* Learn Your Own Way */}
          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 20px 25px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={iconContainerStyle3}>
              <Lightbulb style={iconStyle} />
            </div>
            <h3 style={cardTitleStyle}>Learn Your Own Way</h3>
            <p style={cardTextStyle}>Explore flexible content designed around your learning style.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
