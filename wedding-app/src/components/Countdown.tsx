import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const pad = (n: number) => String(n).padStart(2, '0')
const TARGET = new Date('2026-06-06T12:00:00')

export const Countdown = () => {
  const [time, setTime] = useState({ days: '00', hours: '00', mins: '00', secs: '00' })

  useEffect(() => {
    const tick = () => {
      const diff = TARGET.getTime() - Date.now()
      if (diff <= 0) return setTime({ days: '00', hours: '00', mins: '00', secs: '00' })
      setTime({
        days:  pad(Math.floor(diff / 86400000)),
        hours: pad(Math.floor((diff % 86400000) / 3600000)),
        mins:  pad(Math.floor((diff % 3600000) / 60000)),
        secs:  pad(Math.floor((diff % 60000) / 1000)),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, maxWidth: 480, margin: '0 auto' }}>
      {([['Days', time.days], ['Hours', time.hours], ['Mins', time.mins], ['Secs', time.secs]] as const).map(([label, val]) => (
        <div key={label} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          border: '1px solid rgba(201,168,76,0.3)',
          padding: '20px 8px',
          background: 'rgba(201,168,76,0.06)',
          position: 'relative',
        }}>
          {/* Top gold line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right,transparent,rgba(201,168,76,0.6),transparent)' }} />
          <motion.span
            key={val}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(30px,6vw,48px)', color: '#e8c97a', fontWeight: 300, lineHeight: 1, display: 'block' }}
          >
            {val}
          </motion.span>
          <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 9, letterSpacing: 3, color: 'rgba(201,168,76,0.55)', textTransform: 'uppercase', marginTop: 8, display: 'block' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}