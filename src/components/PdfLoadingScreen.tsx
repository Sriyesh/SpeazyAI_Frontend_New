"use client"

import { Loader2, FileText, Sparkles } from "lucide-react"
import { CSSProperties } from "react"

interface PdfLoadingScreenProps {
  lessonTitle?: string
}

const BLURRY_BLUE_BG: CSSProperties = {
  backgroundColor: "#123A8A",
  backgroundImage: `
    radial-gradient(900px 700px at 78% 28%, rgba(21,86,197,0.75) 0%, rgba(21,86,197,0.10) 55%, rgba(21,86,197,0) 70%),
    radial-gradient(880px 680px at 20% 20%, rgba(18,59,150,0.75) 0%, rgba(18,59,150,0.10) 55%, rgba(18,59,150,0) 70%),
    radial-gradient(900px 700px at 80% 78%, rgba(13,52,152,0.80) 0%, rgba(13,52,152,0.10) 55%, rgba(13,52,152,0) 70%),
    radial-gradient(820px 640px at 18% 82%, rgba(0,185,252,0.35) 0%, rgba(0,185,252,0.06) 55%, rgba(0,185,252,0) 70%),
    radial-gradient(700px 560px at 60% 12%, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0.06) 55%, rgba(59,130,246,0) 72%),
    radial-gradient(900px 700px at 92% 50%, rgba(8,44,132,0.85) 0%, rgba(8,44,132,0.10) 55%, rgba(8,44,132,0) 75%)
  `,
  backgroundBlendMode: "normal",
  backgroundAttachment: "fixed",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
}

// Animation keyframes as inline style objects
const floatAnimation: CSSProperties = {
  animation: "float 3s ease-in-out infinite",
}

const spinAnimation: CSSProperties = {
  animation: "spin 1s linear infinite",
}

const pulseAnimation: CSSProperties = {
  animation: "pulse 2s ease-in-out infinite",
}

export function PdfLoadingScreen({ lessonTitle }: PdfLoadingScreenProps) {
  const containerStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const backdropBlurStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(18, 58, 138, 0.85)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  }

  const backgroundStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    ...BLURRY_BLUE_BG,
  }

  const decorativeContainerStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    pointerEvents: "none",
  }

  const star1Style: CSSProperties = {
    position: "absolute",
    top: "40px",
    left: "40px",
    width: "12px",
    height: "12px",
    backgroundColor: "#3B82F6",
    borderRadius: "50%",
    opacity: 0.7,
    ...floatAnimation,
  }

  const star2Style: CSSProperties = {
    position: "absolute",
    top: "128px",
    right: "80px",
    width: "8px",
    height: "8px",
    backgroundColor: "#00B9FC",
    borderRadius: "50%",
    opacity: 0.6,
    ...floatAnimation,
    animationDelay: "0.5s",
  }

  const sparkleStyle: CSSProperties = {
    position: "absolute",
    top: "80px",
    left: "33.333%",
    width: "24px",
    height: "24px",
    color: "#00B9FC",
    opacity: 0.7,
    ...floatAnimation,
    animationDelay: "1s",
  }

  const contentContainerStyle: CSSProperties = {
    textAlign: "center",
    padding: "0 32px",
    position: "relative",
    zIndex: 1,
  }

  const iconContainerStyle: CSSProperties = {
    marginBottom: "32px",
    display: "flex",
    justifyContent: "center",
  }

  const iconWrapperStyle: CSSProperties = {
    position: "relative",
  }

  const iconCircleStyle: CSSProperties = {
    width: "96px",
    height: "96px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid rgba(255, 255, 255, 0.2)",
  }

  const fileIconStyle: CSSProperties = {
    width: "48px",
    height: "48px",
    color: "#FFFFFF",
    ...pulseAnimation,
  }

  const loaderWrapperStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const loaderStyle: CSSProperties = {
    width: "64px",
    height: "64px",
    color: "#00B9FC",
    ...spinAnimation,
  }

  const titleStyle: CSSProperties = {
    fontSize: "30px",
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: "16px",
  }

  const lessonTitleStyle: CSSProperties = {
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "24px",
    maxWidth: "448px",
    margin: "0 auto 24px auto",
  }

  const dotsContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "rgba(255, 255, 255, 0.7)",
  }

  const dotStyle: CSSProperties = {
    width: "8px",
    height: "8px",
    backgroundColor: "#00B9FC",
    borderRadius: "50%",
    ...pulseAnimation,
  }

  const subtitleStyle: CSSProperties = {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: "24px",
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
      <div style={containerStyle}>
        {/* Backdrop blur overlay */}
        <div style={backdropBlurStyle} />
        
        {/* Background gradient */}
        <div style={backgroundStyle} />

        {/* Decorative elements */}
        <div style={decorativeContainerStyle}>
          <div style={star1Style} />
          <div style={star2Style} />
          <Sparkles style={sparkleStyle} />
        </div>

        {/* Main content */}
        <div style={contentContainerStyle}>
          <div style={iconContainerStyle}>
            <div style={iconWrapperStyle}>
              <div style={iconCircleStyle}>
                <FileText style={fileIconStyle} />
              </div>
              <div style={loaderWrapperStyle}>
                <Loader2 style={loaderStyle} />
              </div>
            </div>
          </div>
          
          <h2 style={titleStyle}>
            Processing PDF...
          </h2>
          
          {lessonTitle && (
            <p style={lessonTitleStyle}>
              {lessonTitle}
            </p>
          )}
          
          <div style={dotsContainerStyle}>
            <div style={{ ...dotStyle, animationDelay: "0s" }} />
            <div style={{ ...dotStyle, animationDelay: "0.2s" }} />
            <div style={{ ...dotStyle, animationDelay: "0.4s" }} />
          </div>
          
          <p style={subtitleStyle}>
            Extracting text content from PDF...
          </p>
        </div>
      </div>
    </>
  )
}

