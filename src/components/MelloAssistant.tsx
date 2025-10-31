import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface MelloAssistantProps {
  state?:
    | "idle"
    | "talking"
    | "waving"
    | "celebrating"
    | "thinking";
  message?: string;
  showMessage?: boolean;
  onMessageDismiss?: () => void;
  position?: "bottom-right" | "bottom-left" | "center";
}

export function MelloAssistant({
  state = "idle",
  message = "Hi! I'm Mello, your AI learning companion!",
  showMessage = true,
  onMessageDismiss,
  position = "bottom-right",
}: MelloAssistantProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeScale, setEyeScale] = useState(1);

  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      },
      3000 + Math.random() * 2000,
    );

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      setEyeScale(1.1);
      setTimeout(() => setEyeScale(1), 200);
    }, 4000);

    return () => clearInterval(sparkleInterval);
  }, []);

  const positionClasses = {
    "bottom-right": "bottom-8 right-8",
    "bottom-left": "bottom-8 left-8",
    center:
      "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {showMessage && message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="absolute bottom-full mb-4 right-0 max-w-xs"
          >
            <div className="relative bg-gradient-to-br from-white to-[#F2F3F4] border-2 border-[#3B82F6]/30 rounded-2xl p-4 shadow-2xl">
              <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white border-r-2 border-b-2 border-[#3B82F6]/30 transform rotate-45" />
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                <p className="text-[#1E3A8A] text-sm leading-relaxed">
                  {message}
                </p>
                {onMessageDismiss && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMessageDismiss}
                    className="p-0 h-5 w-5 ml-auto flex-shrink-0 text-[#1E3A8A]/60 hover:text-[#1E3A8A]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative cursor-pointer"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] rounded-full blur-3xl"
        />

        {state === "celebrating" && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, -Math.random() * 80],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="absolute"
                style={{ left: "50%", top: "50%" }}
              >
                <Sparkles className="w-4 h-4 text-[#FFD600]" />
              </motion.div>
            ))}
          </>
        )}

        {/* Mello Character - SVG Based */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="relative z-10"
        >
          <defs>
            <radialGradient id="bodyGradient" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </radialGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Cloud Body */}
          <g filter="url(#softGlow)">
            {/* Main cloud shape */}
            <ellipse cx="60" cy="65" rx="45" ry="40" fill="url(#bodyGradient)" />
            
            {/* Cloud bumps for fluffy effect */}
            <circle cx="35" cy="55" r="20" fill="url(#bodyGradient)" />
            <circle cx="85" cy="55" r="20" fill="url(#bodyGradient)" />
            <circle cx="60" cy="45" r="22" fill="url(#bodyGradient)" />
            
            {/* Bottom cloud bumps */}
            <circle cx="45" cy="75" r="18" fill="url(#bodyGradient)" />
            <circle cx="75" cy="75" r="18" fill="url(#bodyGradient)" />
          </g>

          {/* Eyes */}
          <g>
            {/* Left eye */}
            <ellipse
              cx="48"
              cy="58"
              rx="8"
              ry={isBlinking ? "1" : "10"}
              fill="#1E3A8A"
              style={{
                transform: `scale(${eyeScale})`,
                transformOrigin: "48px 58px",
                transition: "all 0.15s ease",
              }}
            />
            {!isBlinking && (
              <>
                <circle cx="50" cy="55" r="3" fill="white" opacity="0.9" />
                <circle cx="46" cy="60" r="1.5" fill="white" opacity="0.6" />
              </>
            )}

            {/* Right eye */}
            <ellipse
              cx="72"
              cy="58"
              rx="8"
              ry={isBlinking ? "1" : "10"}
              fill="#1E3A8A"
              style={{
                transform: `scale(${eyeScale})`,
                transformOrigin: "72px 58px",
                transition: "all 0.15s ease",
              }}
            />
            {!isBlinking && (
              <>
                <circle cx="74" cy="55" r="3" fill="white" opacity="0.9" />
                <circle cx="70" cy="60" r="1.5" fill="white" opacity="0.6" />
              </>
            )}
          </g>

          {/* Rosy Cheeks */}
          <ellipse cx="35" cy="68" rx="8" ry="6" fill="#FFB6C1" opacity="0.4" />
          <ellipse cx="85" cy="68" rx="8" ry="6" fill="#FFB6C1" opacity="0.4" />

          {/* Smile */}
          <path
            d="M 45 72 Q 60 80 75 72"
            stroke="#1E3A8A"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          {/* Sparkle on head */}
          <g opacity={eyeScale > 1 ? "1" : "0.7"}>
            <path
              d="M 60 35 L 62 40 L 67 42 L 62 44 L 60 49 L 58 44 L 53 42 L 58 40 Z"
              fill="#FFD600"
            />
          </g>
        </svg>

        <motion.div
          animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 border-2 border-[#3B82F6] rounded-full"
        />
      </motion.div>
    </div>
  );
}