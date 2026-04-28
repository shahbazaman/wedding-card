import React from 'react'

export const FloralCorner = ({ flip = false, className = '' }: { flip?: boolean; className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
  >
    <path d="M10 190 Q10 10 190 10" stroke="#d4af7a" strokeWidth="0.6" fill="none" opacity="0.25" />
    <circle cx="50" cy="50" r="18" fill="rgba(212,175,122,0.08)" />
    <path d="M50 32 Q62 44 50 56 Q38 44 50 32Z" fill="#c0392b" opacity="0.75" />
    <path d="M32 50 Q44 62 32 74 Q20 62 32 50Z" fill="#d4af7a" opacity="0.65" />
    <path d="M68 50 Q80 62 68 74 Q56 62 68 50Z" fill="#d4af7a" opacity="0.55" />
    <path d="M50 68 Q62 80 50 92 Q38 80 50 68Z" fill="#c0392b" opacity="0.45" />
    <circle cx="24" cy="90" r="10" fill="rgba(212,175,122,0.07)" />
    <path d="M24 80 Q30 88 24 96 Q18 88 24 80Z" fill="#c8a882" opacity="0.6" />
    <path d="M14 90 Q22 98 14 106 Q6 98 14 90Z" fill="#d4af7a" opacity="0.45" />
    <path d="M34 90 Q42 98 34 106 Q26 98 34 90Z" fill="#d4af7a" opacity="0.4" />
    <circle cx="90" cy="24" r="8" fill="rgba(212,175,122,0.06)" />
    <path d="M90 16 Q96 22 90 28 Q84 22 90 16Z" fill="#c8a882" opacity="0.5" />
    <path d="M82 24 Q88 30 82 36 Q76 30 82 24Z" fill="#d4af7a" opacity="0.4" />
    <path d="M98 24 Q104 30 98 36 Q92 30 98 24Z" fill="#d4af7a" opacity="0.35" />
    <path d="M50 56 Q40 70 24 90" stroke="#5a7a48" strokeWidth="1.2" fill="none" opacity="0.55" />
    <path d="M50 56 Q65 62 90 24" stroke="#5a7a48" strokeWidth="1.2" fill="none" opacity="0.45" />
    <path d="M50 56 Q45 80 35 120" stroke="#5a7a48" strokeWidth="1" fill="none" opacity="0.35" />
    <ellipse cx="36" cy="73" rx="8" ry="3.5" fill="#5a7a48" opacity="0.45" transform="rotate(-48,36,73)" />
    <ellipse cx="72" cy="40" rx="7" ry="3" fill="#5a7a48" opacity="0.38" transform="rotate(-72,72,40)" />
    <ellipse cx="40" cy="105" rx="9" ry="3.5" fill="#5a7a48" opacity="0.32" transform="rotate(-30,40,105)" />
    <path d="M20 130 Q25 118 30 125 Q28 135 20 130Z" fill="#f0e0c0" opacity="0.3" />
    <circle cx="60" cy="38" r="1.5" fill="#ffd700" opacity="0.5" />
    <circle cx="38" cy="60" r="1.5" fill="#ffd700" opacity="0.45" />
    <circle cx="26" cy="82" r="1" fill="#ffd700" opacity="0.4" />
  </svg>
)
