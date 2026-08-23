// Fallback for browsers without WebGL. Deliberately a stylized illustration,
// not a stand-in "product photo" — no real tile photography exists yet
// (00-PROGRESS.md), and presenting a generic image as a real product shot
// would violate CLAUDE.md's "never fabricate data" rule.
export function TileIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tile-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D98F5F" />
          <stop offset="55%" stopColor="#C96A3D" />
          <stop offset="100%" stopColor="#B5502B" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="205" rx="85" ry="14" fill="#3B2A20" opacity="0.12" />
      <path
        d="M45 150 C45 90 80 55 120 55 C160 55 195 90 195 150 L195 165 C195 168 192 170 189 170 L165 170 C162 170 160 168 160 165 C160 122 143 92 120 92 C97 92 80 122 80 165 C80 168 78 170 75 170 L51 170 C48 170 45 168 45 165 Z"
        fill="url(#tile-gradient)"
        stroke="#8A3B21"
        strokeWidth="1.5"
      />
    </svg>
  )
}
