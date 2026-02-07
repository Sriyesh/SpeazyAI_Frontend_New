interface MelloIconProps {
  size?: number
  className?: string
}

export function MelloIcon({ size = 40, className }: MelloIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="mello-body" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="50%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </radialGradient>
        <filter id="mello-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#mello-glow)">
        <ellipse cx="60" cy="65" rx="45" ry="40" fill="url(#mello-body)" />
        <circle cx="35" cy="55" r="20" fill="url(#mello-body)" />
        <circle cx="85" cy="55" r="20" fill="url(#mello-body)" />
        <circle cx="60" cy="45" r="22" fill="url(#mello-body)" />
        <circle cx="45" cy="75" r="18" fill="url(#mello-body)" />
        <circle cx="75" cy="75" r="18" fill="url(#mello-body)" />
      </g>

      <g>
        <ellipse cx="48" cy="58" rx="8" ry="10" fill="#1E3A8A" />
        <circle cx="50" cy="55" r="3" fill="white" opacity="0.9" />
        <circle cx="46" cy="60" r="1.5" fill="white" opacity="0.6" />

        <ellipse cx="72" cy="58" rx="8" ry="10" fill="#1E3A8A" />
        <circle cx="74" cy="55" r="3" fill="white" opacity="0.9" />
        <circle cx="70" cy="60" r="1.5" fill="white" opacity="0.6" />
      </g>

      <ellipse cx="35" cy="68" rx="8" ry="6" fill="#FFB6C1" opacity="0.4" />
      <ellipse cx="85" cy="68" rx="8" ry="6" fill="#FFB6C1" opacity="0.4" />

      <path
        d="M 45 72 Q 60 80 75 72"
        stroke="#1E3A8A"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      <path
        d="M 60 35 L 62 40 L 67 42 L 62 44 L 60 49 L 58 44 L 53 42 L 58 40 Z"
        fill="#FFD600"
        opacity="0.8"
      />
    </svg>
  )
}
