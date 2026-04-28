import React, { useMemo } from 'react'

const PETAL_COLORS = [
  'rgba(192,57,43,0.35)',
  'rgba(212,175,122,0.25)',
  'rgba(200,168,130,0.22)',
  'rgba(107,143,90,0.18)',
  'rgba(180,80,80,0.2)',
]

export const Petals = () => {
  const petals = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${(i * 4.2 + Math.sin(i) * 8) % 100}%`,
      size: 5 + (i % 7),
      duration: `${10 + (i % 8)}s`,
      delay: `${(i * 0.7) % 12}s`,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
    })), [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

export const WatercolorBlobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[
      { w: 400, h: 400, top: '10%', left: '5%', color: 'rgba(192,57,43,0.04)', dur: '18s' },
      { w: 500, h: 350, top: '40%', left: '60%', color: 'rgba(212,175,122,0.05)', dur: '22s', delay: '4s' },
      { w: 350, h: 450, top: '70%', left: '20%', color: 'rgba(107,143,90,0.04)', dur: '20s', delay: '8s' },
      { w: 300, h: 300, top: '20%', left: '75%', color: 'rgba(180,80,80,0.03)', dur: '25s', delay: '2s' },
    ].map((b, i) => (
      <div
        key={i}
        className="blob"
        style={{
          width: b.w, height: b.h,
          top: b.top, left: b.left,
          background: b.color,
          animationDuration: b.dur,
          animationDelay: b.delay || '0s',
        }}
      />
    ))}
  </div>
)
