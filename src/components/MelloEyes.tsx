import { useState, useEffect } from "react";

export function MelloEyes() {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    // Blink every 3-5 seconds randomly
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200); // Blink duration
    }, Math.random() * 2000 + 3000); // Random interval between 3-5 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all duration-200"
    >
      <defs>
        <radialGradient id="miniCloudGradient" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="50%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </radialGradient>
      </defs>

      {/* Cloud Body - Mini Version */}
      <g>
        {/* Main cloud shape */}
        <ellipse cx="30" cy="32" rx="22" ry="20" fill="url(#miniCloudGradient)" />
        
        {/* Cloud bumps for fluffy effect */}
        <circle cx="17" cy="27" r="10" fill="url(#miniCloudGradient)" />
        <circle cx="43" cy="27" r="10" fill="url(#miniCloudGradient)" />
        <circle cx="30" cy="22" r="11" fill="url(#miniCloudGradient)" />
        
        {/* Bottom cloud bumps */}
        <circle cx="22" cy="37" r="9" fill="url(#miniCloudGradient)" />
        <circle cx="38" cy="37" r="9" fill="url(#miniCloudGradient)" />
      </g>

      {/* Eyes */}
      <g>
        {/* Left eye */}
        {!isBlinking ? (
          <>
            <ellipse cx="24" cy="29" rx="4" ry="5" fill="#1E3A8A" />
            <circle cx="25" cy="27.5" r="1.5" fill="white" opacity="0.9" />
          </>
        ) : (
          <line
            x1="20"
            y1="29"
            x2="28"
            y2="29"
            stroke="#1E3A8A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Right eye */}
        {!isBlinking ? (
          <>
            <ellipse cx="36" cy="29" rx="4" ry="5" fill="#1E3A8A" />
            <circle cx="37" cy="27.5" r="1.5" fill="white" opacity="0.9" />
          </>
        ) : (
          <line
            x1="32"
            y1="29"
            x2="40"
            y2="29"
            stroke="#1E3A8A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </g>

      {/* Rosy Cheeks */}
      <ellipse cx="17" cy="34" rx="4" ry="3" fill="#FFB6C1" opacity="0.4" />
      <ellipse cx="43" cy="34" rx="4" ry="3" fill="#FFB6C1" opacity="0.4" />

      {/* Smile */}
      <path
        d="M 22 36 Q 30 40 38 36"
        stroke="#1E3A8A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}

