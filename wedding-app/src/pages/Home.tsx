import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'radial-gradient(ellipse at center,#1e0808 0%,#060101 100%)' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@300;400&display=swap');`}</style>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(48px,10vw,80px)', color: '#d4af7a' }}>
          Athif Aziz & Namra Shehsy
        </div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: 6, color: 'rgba(212,175,122,0.5)', textTransform: 'uppercase', marginTop: 8 }}>
          Wedding · 6 June 2026
        </div>
        <div style={{ width: 1, height: 50, background: 'linear-gradient(to bottom,transparent,#d4af7a,transparent)', margin: '24px auto' }} />
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, letterSpacing: 3, color: 'rgba(212,175,122,0.4)', textTransform: 'uppercase', marginBottom: 32 }}>
          Your invitation link was sent personally
        </p>
        <motion.button
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: '#d4af7a', background: 'transparent', border: '1px solid rgba(212,175,122,0.4)', padding: '14px 36px', cursor: 'pointer' }}
        >
          Host Dashboard →
        </motion.button>
      </motion.div>
    </div>
  )
}
