import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import type { Guest } from '../lib/supabase'
import { Petals } from '../components/Backgrounds'
import { Reveal, SectionDivider } from '../components/Reveal'
import { CoupleIllustration } from '../components/CoupleIllustration'
import { Countdown } from '../components/Countdown'
import { RSVPFlow } from '../components/RSVPFlow'

// ── ISLAMIC COLOR PALETTE ─────────────────────────────────────────────────────
// Primary:  Deep Emerald  #0d3b2e / #1a5c44 / #2d7a5f
// Accent:   Warm Gold     #c9a84c / #e8c97a / #f5dfa0
// Rose:     Dusty Rose    #8b3a52 / #b05070 / #d4849a
// Neutral:  Cream/Ivory   #faf6f0 / #f0e8d8
// Text:     Soft White    #f5f0e8

const NAV = [
  { label: 'Home',         id: 'sec-hero' },
  { label: 'Save the Date',id: 'sec-savedate' },
  { label: 'The Couple',   id: 'sec-couple' },
  { label: 'Celebrations', id: 'sec-events' },
  { label: 'Venue',        id: 'sec-venue' },
  { label: 'Countdown',    id: 'sec-countdown' },
  { label: 'FAQ',          id: 'sec-faq' },
  { label: 'RSVP',         id: 'sec-rsvp' },
  { label: 'Get in Touch', id: 'sec-contact' },
]

const FAQS = [
  { q: 'Can I drive my own car?',      a: 'Yes, you are welcome to drive your own vehicle. Parking attendants will guide you.' },
  { q: 'Is there parking available?',  a: 'Ample parking is available adjacent to Malabar Avenue.' },
  { q: 'Can children attend?',         a: 'Children are warmly welcome to celebrate with us.' },
  { q: 'How do I contact the family?', a: 'Call or WhatsApp us at +91 6282142322.' },
  { q: 'What time should I arrive?',   a: 'Please arrive by 11:30 AM — 30 minutes before the ceremony.' },
]

// ── Islamic geometric pattern (SVG data URL) ─────────────────────────────────
const ISLAMIC_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg fill='none' stroke='%23c9a84c' stroke-width='0.6' opacity='0.18'%3E%3Cpolygon points='60,10 85,30 85,70 60,90 35,70 35,30'/%3E%3Cpolygon points='60,25 75,35 75,65 60,75 45,65 45,35'/%3E%3Cline x1='60' y1='10' x2='60' y2='0'/%3E%3Cline x1='85' y1='30' x2='120' y2='15'/%3E%3Cline x1='85' y1='70' x2='120' y2='85'/%3E%3Cline x1='60' y1='90' x2='60' y2='120'/%3E%3Cline x1='35' y1='70' x2='0' y2='85'/%3E%3Cline x1='35' y1='30' x2='0' y2='15'/%3E%3C/g%3E%3C/svg%3E")`

// ── Islamic arch SVG ──────────────────────────────────────────────────────────
const IslamicArch = ({ color = '#c9a84c', opacity = 0.15 }: { color?: string; opacity?: number }) => (
  <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', opacity }}>
    <path d="M10 120 L10 60 Q10 10 100 10 Q190 10 190 60 L190 120" fill="none" stroke={color} strokeWidth="1.5" />
    <path d="M25 120 L25 65 Q25 25 100 25 Q175 25 175 65 L175 120" fill="none" stroke={color} strokeWidth="0.8" />
    <line x1="10" y1="120" x2="190" y2="120" stroke={color} strokeWidth="1.5" />
    <circle cx="100" cy="10" r="4" fill={color} />
    <circle cx="10" cy="60" r="3" fill={color} />
    <circle cx="190" cy="60" r="3" fill={color} />
    {[30,50,70,90,110,130,150,170].map((x,i) => (
      <circle key={i} cx={x} cy={120} r="2" fill={color} />
    ))}
  </svg>
)

// ── Islamic corner ornament ───────────────────────────────────────────────────
const IslamicCorner = ({ flip = false, flipY = false, color = '#c9a84c' }: { flip?: boolean; flipY?: boolean; color?: string }) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', transform: `${flip ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''}`.trim() }}>
    <g fill="none" stroke={color} opacity="0.7">
      {/* Outer arc */}
      <path d="M5 155 Q5 5 155 5" strokeWidth="0.8" opacity="0.3"/>
      {/* Star of Islam style petals */}
      <path d="M30 30 Q42 18 54 30 Q42 42 30 30Z" fill={color} opacity="0.6" strokeWidth="0"/>
      <path d="M18 42 Q30 30 42 42 Q30 54 18 42Z" fill={color} opacity="0.45" strokeWidth="0"/>
      <path d="M42 18 Q54 30 42 42 Q30 30 42 18Z" fill={color} opacity="0.45" strokeWidth="0"/>
      {/* Crescent hint */}
      <path d="M54 30 Q62 22 70 30 Q62 42 50 36 Q58 34 54 30Z" fill={color} opacity="0.5" strokeWidth="0"/>
      {/* Small star */}
      <polygon points="30,30 32,26 34,30 38,30 35,33 36,37 30,35 24,37 25,33 22,30 26,30 28,26" fill={color} opacity="0.35" strokeWidth="0"/>
      {/* Geometric lines */}
      <path d="M54 30 Q70 44 60 80" strokeWidth="1" opacity="0.45" stroke={color} fill="none"/>
      <path d="M30 54 Q44 70 80 60" strokeWidth="1" opacity="0.38" stroke={color} fill="none"/>
      {/* Small bloom at second node */}
      <circle cx="24" cy="80" r="9" fill="rgba(201,168,76,0.07)"/>
      <path d="M24 71 Q30 77 24 83 Q18 77 24 71Z" fill={color} opacity="0.5" strokeWidth="0"/>
      <path d="M15 80 Q21 86 15 92 Q9 86 15 80Z" fill={color} opacity="0.4" strokeWidth="0"/>
      <path d="M33 80 Q39 86 33 92 Q27 86 33 80Z" fill={color} opacity="0.35" strokeWidth="0"/>
      {/* Leaf stems */}
      <ellipse cx="42" cy="56" rx="8" ry="3.5" fill="#2d7a5f" opacity="0.4" transform="rotate(-48,42,56)"/>
      <ellipse cx="58" cy="40" rx="7" ry="3" fill="#2d7a5f" opacity="0.35" transform="rotate(-70,58,40)"/>
      {/* Gold dots */}
      <circle cx="46" cy="28" r="2" fill="#e8c97a" opacity="0.6"/>
      <circle cx="28" cy="46" r="2" fill="#e8c97a" opacity="0.55"/>
      <circle cx="20" cy="75" r="1.5" fill="#e8c97a" opacity="0.5"/>
      {/* Diamond */}
      <polygon points="30,30 33,27 36,30 33,33" fill="#e8c97a" opacity="0.4" strokeWidth="0"/>
    </g>
  </svg>
)

// ── Scratch Card ──────────────────────────────────────────────────────────────
const ScratchCard = ({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scratched, setScratched] = useState(false)
  const drawing = useRef(false)
  const init = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => {
      const c = canvasRef.current
      if (!c || init.current) return
      init.current = true
      const ctx = c.getContext('2d')!
      const dpr = window.devicePixelRatio || 1
      const r = c.getBoundingClientRect()
      c.width = r.width * dpr; c.height = r.height * dpr
      ctx.scale(dpr, dpr)
      // Emerald-gold gradient for scratch surface
      const g = ctx.createLinearGradient(0, 0, r.width, r.height)
      g.addColorStop(0, '#1a5c44')
      g.addColorStop(0.4, '#c9a84c')
      g.addColorStop(0.7, '#2d7a5f')
      g.addColorStop(1, '#c9a84c')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, r.width, r.height)
      ctx.fillStyle = 'rgba(255,248,230,0.85)'
      ctx.font = `bold 11px Montserrat, sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('Scratch ✦', r.width / 2, r.height / 2)
      ctx.globalCompositeOperation = 'destination-out'
    }, delay)
    return () => clearTimeout(t)
  }, [delay])

  const pos = (e: React.MouseEvent | React.TouchEvent, c: HTMLCanvasElement) => {
    const r = c.getBoundingClientRect()
    if ('touches' in e) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top }
    return { x: (e as React.MouseEvent).clientX - r.left, y: (e as React.MouseEvent).clientY - r.top }
  }

  const scratch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (scratched || !drawing.current) return
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    const { x, y } = pos(e, c)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill()
    const d = ctx.getImageData(0, 0, c.width, c.height).data
    let t = 0; for (let i = 3; i < d.length; i += 4) if (d[i] < 128) t++
    if (t / (d.length / 4) > 0.5) setScratched(true)
  }, [scratched])

return (
  <div className="flex flex-col items-center gap-4">
    <div 
      className="relative rounded-full overflow-hidden"
      style={{ 
        // 1. Make the container size responsive
        width: 'clamp(75px, 18vw, 110px)', 
        height: 'clamp(75px, 18vw, 110px)', 
        boxShadow: '0 8px 32px rgba(13,59,46,0.4), 0 0 0 3px rgba(201,168,76,0.3)' 
      }}
    >
      <div 
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#0d3b2e,#1a5c44)', border: '2px solid rgba(201,168,76,0.5)' }}
      >
        <span style={{ 
          fontFamily: '"Cormorant Garamond",serif', 
          // 2. Make the number inside scale down too
          fontSize: 'clamp(24px, 5vw, 34px)', 
          color: '#e8c97a', 
          fontWeight: 300 
        }}>
          {value}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 rounded-full"
        // Ensure canvas stays 100% of the parent
        style={{ width: '100%', height: '100%', cursor: scratched ? 'default' : 'crosshair', opacity: scratched ? 0 : 1, transition: 'opacity 0.6s ease' }}
        onMouseDown={e => { drawing.current = true; scratch(e) }}
        onMouseMove={scratch}
        onMouseUp={() => { drawing.current = false }}
        onMouseLeave={() => { drawing.current = false }}
        onTouchStart={e => { e.preventDefault(); drawing.current = true; scratch(e) }}
        onTouchMove={e => { e.preventDefault(); scratch(e) }}
        onTouchEnd={() => { drawing.current = false }}
      />
      {/* ... rest of the code */}
    </div>
    <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 9, letterSpacing: 4, color: 'rgba(13,59,46,0.6)', textTransform: 'uppercase' }}>{label}</span>
  </div>
)
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function InvitePage() {
  const { slug } = useParams<{ slug: string }>()
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('guests').select('*').eq('slug', slug).single()
      if (data) setGuest(data as Guest)
      else setNotFound(true)
      setLoading(false)
    }
    fetch()
  }, [slug])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
  }

  const share = () => {
    const url = window.location.href
    if (navigator.share) navigator.share({ title: 'Athif Aziz & Namra Shehsy Wedding', text: `You're invited! 🌸`, url })
    else { navigator.clipboard.writeText(url); alert('Link copied!') }
  }

  // ── Loader ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center,#1a5c44,#0d3b2e)' }}>
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}
        style={{ fontFamily: '"Great Vibes",cursive', fontSize: 52, color: '#e8c97a', marginBottom: 24 }}>
        Athif Aziz & Namra Shehsy
      </motion.div>
      <div className="flex gap-2">
        {[0,1,2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full"
            style={{ background: '#c9a84c' }}
            animate={{ scale: [0.6,1,0.6], opacity: [0.3,1,0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} />
        ))}
      </div>
    </div>
  )

  if (notFound) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: '#0d3b2e' }}>
      <div style={{ fontFamily: '"Great Vibes",cursive', fontSize: 52, color: '#e8c97a', marginBottom: 12 }}>Invitation Not Found</div>
      <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, letterSpacing: 4, color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase' }}>
        This invitation link may be incorrect
      </p>
    </div>
  )

  // ── Envelope opener ────────────────────────────────────────────────────────
  if (!showInvite) return (
    <AnimatePresence>
      <motion.div key="envelope" initial={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at center,#1a5c44 0%,#0d3b2e 60%,#081f18 100%)' }}
        onClick={() => setShowInvite(true)}
      >
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0" style={{ backgroundImage: ISLAMIC_PATTERN, backgroundSize: '120px 120px' }} />
        {/* Floating gold particles */}
        {Array.from({length:16}).map((_,i) => (
          <div key={i} className="absolute rounded-full"
            style={{ width: 3+i%4, height: 3+i%4, background: `rgba(201,168,76,${0.15+i%4*0.08})`, left: `${(i*6.3)%100}%`, animation: `floatUp ${7+i%5}s ${i*0.4}s linear infinite` }} />
        ))}
        <Petals />

        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative" style={{ width: 'clamp(260px,80vw,360px)' }}>
          {/* Emerald-toned envelope */}
          <svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 20px 50px rgba(13,59,46,0.6))' }}>
            <defs>
              <linearGradient id="envB2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2d7a5f"/>
                <stop offset="100%" stopColor="#1a5c44"/>
              </linearGradient>
              <linearGradient id="envF2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a9070"/>
                <stop offset="100%" stopColor="#2d7a5f"/>
              </linearGradient>
            </defs>
            <rect x="0" y="30" width="320" height="190" rx="5" fill="url(#envB2)"/>
            {/* Islamic geometric lines on envelope body */}
            <line x1="24" y1="58" x2="296" y2="58" stroke="#c9a84c" strokeWidth="0.6" opacity="0.4"/>
            <line x1="24" y1="62" x2="296" y2="62" stroke="#c9a84c" strokeWidth="0.3" opacity="0.25"/>
            <polygon points="0,30 160,130 0,220" fill="#1a5c44" opacity="0.6"/>
            <polygon points="320,30 160,130 320,220" fill="#0d3b2e" opacity="0.55"/>
            <polygon points="0,220 320,220 160,130" fill="#2d7a5f" opacity="0.7"/>
            {/* Star-and-crescent motif */}
            <text x="160" y="188" fontFamily="Georgia,serif" fontSize="16" fill="#c9a84c" textAnchor="middle" opacity="0.6">A ♥ N</text>
            <polygon points="0,30 320,30 160,130" fill="url(#envF2)"/>
            <line x1="0" y1="30" x2="320" y2="30" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5"/>
            {/* Small diamond accents on flap */}
            <polygon points="155,28 160,22 165,28 160,34" fill="#c9a84c" opacity="0.5"/>
          </svg>
          {/* Wax seal — rose/burgundy */}
          <motion.div whileHover={{ scale: 1.12 }}
            className="absolute flex items-center justify-center rounded-full"
            style={{ bottom: -14, left: '50%', transform: 'translateX(-50%)', width: 46, height: 46,
              background: 'radial-gradient(circle,#b05070,#6b1f35)',
              boxShadow: '0 4px 20px rgba(107,31,53,0.7)', animation: 'pulse-gold 2s infinite',
              fontSize: 18, color: '#f5dfa0' }}>
            ♥
          </motion.div>
        </motion.div>

        <motion.p animate={{ opacity: [0.4,1,0.4] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ marginTop: 40, fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: 4, color: 'rgba(232,201,122,0.75)', textTransform: 'uppercase' }}>
          Tap to open your invitation
        </motion.p>
        {guest && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ marginTop: 12, fontFamily: '"Great Vibes",cursive', fontSize: 26, color: 'rgba(232,201,122,0.8)' }}>
            Dear {guest.name}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  )

  // ── Full Invitation ────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', color: '#1a1a1a', position: 'relative' }}>
      {/* Rose petals — recoloured via filter */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {Array.from({length:20}).map((_,i) => {
          const colors = ['rgba(176,80,112,0.25)','rgba(201,168,76,0.2)','rgba(45,122,95,0.15)','rgba(139,58,82,0.2)']
          const s = 5 + i%8
          return <div key={i} className="petal" style={{ width:s, height:s, background: colors[i%colors.length], left:`${(i*5.1)%100}%`, animationDuration:`${10+i%8}s`, animationDelay:`${i*0.6}s` }} />
        })}
      </div>

      {/* ── HAMBURGER ── */}
      <button onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-5 right-5 z-50 flex flex-col items-center justify-center gap-[5px] rounded-full backdrop-blur-md"
        style={{ width: 46, height: 46, background: 'rgba(13,59,46,0.9)', border: '1px solid rgba(201,168,76,0.5)' }}>
        {[0,1,2].map(i => (
          <motion.div key={i} style={{ width: 20, height: 1.5, background: '#c9a84c', borderRadius: 9 }}
            animate={menuOpen ? { rotate: i===0?45:i===2?-45:0, y: i===0?6.5:i===2?-6.5:0, opacity: i===1?0:1 } : { rotate:0, y:0, opacity:1 }}
            transition={{ duration: 0.3 }} />
        ))}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40" style={{ background: 'rgba(13,59,46,0.5)' }} />
            <motion.nav initial={{ x:300 }} animate={{ x:0 }} exit={{ x:300 }}
              transition={{ type:'spring', damping:28, stiffness:300 }}
              className="fixed top-0 right-0 h-full z-50 overflow-y-auto"
              style={{ width:280, background:'linear-gradient(180deg,#0d3b2e,#1a5c44)', borderLeft:'1px solid rgba(201,168,76,0.3)', padding:'80px 32px 40px' }}>
              <div style={{ fontFamily:'"Great Vibes",cursive', fontSize:32, color:'#e8c97a', marginBottom:24, paddingBottom:16, borderBottom:'1px solid rgba(201,168,76,0.25)' }}>
                Athif Aziz & Namra Shehsy
              </div>
              {NAV.map(n => (
                <div key={n.id} onClick={() => scrollTo(n.id)}
                  style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, letterSpacing:4, textTransform:'uppercase', color:'rgba(232,201,122,0.75)', padding:'14px 0', borderBottom:'1px solid rgba(201,168,76,0.1)', cursor:'pointer', transition:'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#e8c97a')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(232,201,122,0.75)')}>
                  {n.label}
                </div>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Deep emerald with Islamic geometric pattern
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="sec-hero" className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight:'100vh', background:'radial-gradient(ellipse at center,#1a5c44 0%,#0d3b2e 70%,#081f18 100%)' }}>
        {/* Islamic geometric pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: ISLAMIC_PATTERN, backgroundSize:'120px 120px' }} />
        {/* Soft radial glow */}
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at center,rgba(201,168,76,0.07) 0%,transparent 70%)' }} />

        {/* Islamic corner ornaments */}
        {(['tl','tr','bl','br'] as const).map(p => (
          <div key={p} className="absolute" style={{
            width:'clamp(110px,18vw,180px)', height:'clamp(110px,18vw,180px)', opacity:0.85,
            ...(p==='tl'?{top:0,left:0}:p==='tr'?{top:0,right:0}:p==='bl'?{bottom:0,left:0}:{bottom:0,right:0})
          }}>
            <IslamicCorner flip={p==='tr'||p==='br'} flipY={p==='bl'||p==='br'} />
          </div>
        ))}

        {/* Arch at top */}
        <div className="absolute top-0 left-0 right-0" style={{ opacity:0.3 }}>
          <IslamicArch color="#c9a84c" opacity={1} />
        </div>

        <motion.div className="relative z-10 px-6" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:1.2 }}>
          {/* Bismillah */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
            style={{ fontFamily:'"Great Vibes",cursive', fontSize:'clamp(18px,4vw,28px)', color:'#e8c97a', letterSpacing:3, marginBottom:20, opacity:0.95,marginTop:5 }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </motion.div>

          {/* Gold decorative line */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:16 }}>
            <div style={{ flex:1, maxWidth:80, height:1, background:'linear-gradient(to right,transparent,#c9a84c)' }} />
            <span style={{ color:'#c9a84c', fontSize:14, opacity:0.7 }}>✦</span>
            <div style={{ flex:1, maxWidth:80, height:1, background:'linear-gradient(to left,transparent,#c9a84c)' }} />
          </div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, letterSpacing:6, color:'rgba(232,201,122,0.8)', textTransform:'uppercase', marginBottom:10 }}>
            Together with their families
          </motion.div>

          <div style={{ width:1, height:50, background:'linear-gradient(to bottom,transparent,#c9a84c,transparent)', margin:'14px auto' }} />

          <motion.div 
  initial={{ opacity: 0, scale: 0.9 }} 
  animate={{ opacity: 1, scale: 1 }} 
  transition={{ delay: 0.7 }}
  style={{ overflow: 'visible', padding: '20px' }} // Added overflow and padding
>
  <div style={{ 
    fontFamily: '"Great Vibes", cursive', 
    fontSize: 'clamp(50px, 10vw, 90px)', 
    lineHeight: 1.2, // Increased slightly for flourishes
    padding: '0 10px', // Prevents side clipping
    background: 'linear-gradient(90deg, #c9a84c, #f5dfa0, #c9a84c)', 
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text', 
    WebkitTextFillColor: 'transparent', 
    animation: 'shimmer 3s linear infinite' 
  }}>
    Athif Aziz
  </div>
  
  <div style={{ 
    fontFamily: '"Great Vibes", cursive', 
    fontSize: 'clamp(32px, 7vw, 58px)', 
    color: '#d4849a', 
    display: 'block', 
    margin: '4px 0' 
  }}>
    &amp;
  </div>
  
  <div style={{ 
    fontFamily: '"Great Vibes", cursive', 
    fontSize: 'clamp(50px, 10vw, 90px)', 
    lineHeight: 1.2, // Increased slightly
    padding: '0 10px', // Prevents side clipping
    background: 'linear-gradient(90deg, #c9a84c, #f5dfa0, #c9a84c)', 
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text', 
    WebkitTextFillColor: 'transparent', 
    animation: 'shimmer 3s linear infinite' 
  }}>
    Namra Shehsy
  </div>
</motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
            style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, letterSpacing:8, color:'rgba(232,201,122,0.55)', textTransform:'uppercase', marginTop:16 }}>
            Wedding Invitation
          </motion.div>

          {guest && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
              style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontSize:18, color:'rgba(232,201,122,0.85)', marginTop:12 }}>
              In honour of {guest.name}
            </motion.div>
          )}

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, margin:'20px 0' }}>
            <div style={{ flex:1, maxWidth:100, height:1, background:'linear-gradient(to right,transparent,#c9a84c)' }} />
            <span style={{ color:'#c9a84c', fontSize:18, opacity:0.7 }}>✦</span>
            <div style={{ flex:1, maxWidth:100, height:1, background:'linear-gradient(to left,transparent,#c9a84c)' }} />
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <div className="absolute bottom-7 left-1/2 scroll-bounce" style={{ transform:'translateX(-50%)', textAlign:'center' }}>
          <span style={{ display:'block', fontFamily:'Montserrat,sans-serif', fontSize:9, letterSpacing:3, color:'rgba(201,168,76,0.5)', textTransform:'uppercase', marginBottom:8 }}>Scroll</span>
          <div style={{ width:18, height:18, borderRight:'1px solid #c9a84c', borderBottom:'1px solid #c9a84c', transform:'rotate(45deg)', margin:'0 auto', opacity:0.45 }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SAVE THE DATE — Cream/ivory background
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="sec-savedate" style={{ background:'linear-gradient(180deg,#f0e8d8,#faf6f0,#f0e8d8)', padding:'clamp(60px,9vw,100px) 20px' }}>
        <Reveal>
          <div className="mx-auto max-w-md p-10 text-center relative"
            style={{ background:'linear-gradient(135deg,#faf6f0,#f5ede0)', border:'1px solid rgba(13,59,46,0.15)', boxShadow:'0 20px 60px rgba(13,59,46,0.1)' }}>
            {/* Islamic border corners */}
            {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map((pos,i) => (
              <div key={i} className={`absolute ${pos} w-8 h-8`}
                style={{ borderColor:'rgba(13,59,46,0.35)', borderStyle:'solid',
                  borderWidth: i===0?'2px 0 0 2px':i===1?'2px 2px 0 0':i===2?'0 0 2px 2px':'0 2px 2px 0' }} />
            ))}
            {/* Islamic arch above title */}
            <div style={{ opacity:0.25, marginBottom:8 }}>
              <IslamicArch color="#1a5c44" opacity={1} />
            </div>
            <h2 style={{ fontFamily:'"Great Vibes",cursive', fontSize:'clamp(44px,9vw,70px)', color:'#0d3b2e', marginBottom:8 }}>
              Save the Date
            </h2>
            <p style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', color:'rgba(13,59,46,0.65)', fontSize:15, marginBottom:32, letterSpacing:1 }}>
              Gently scratch each seal to reveal our special day
            </p>
            {/* Gold divider */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
              <div style={{ flex:1, height:1, background:'linear-gradient(to right,transparent,#c9a84c)' }} />
              <span style={{ color:'#c9a84c', fontSize:14 }}>✦</span>
              <div style={{ flex:1, height:1, background:'linear-gradient(to left,transparent,#c9a84c)' }} />
            </div>
            <div className="flex justify-center items-end mt-4" 
  style={{ 
    gap: 'clamp(8px, 3vw, 24px)', 
    width: '100%',
    // This CSS variable trick can force child components to resize if they use 'em' or '%'
    fontSize: 'clamp(10px, 2.5vw, 16px)' 
  }}
>
  {[
    { label: "DAY", value: "06", delay: 100 },
    { label: "MONTH", value: "06", delay: 300 },
    { label: "YEAR", value: "2026", delay: 500 }
  ].map((card, index) => (
    <div key={index} style={{ 
      // This forces the component to scale down on small screens
      transform: 'scale(clamp(0.6, 18vw, 1))', 
      transformOrigin: 'bottom center',
      width: 'min-content' // Prevents the container from taking too much space
    }}>
      <ScratchCard label={card.label} value={card.value} delay={card.delay} />
    </div>
  ))}
</div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          THE COUPLE — Soft cream with emerald accents
      ══════════════════════════════════════════════════════════════════════ */}
   <section id="sec-couple" className="text-center" style={{ padding: 'clamp(50px,9vw,90px) clamp(16px,5vw,60px)', background: 'linear-gradient(180deg,#faf6f0,#f0ebe0,#faf6f0)' }}>
  <Reveal>
    <GoldDivider />
    <h2 style={titleStyle('#0d3b2e')}>The Couple</h2>
    <p style={subStyle('#1a5c44')}>United in love &amp; faith</p>

    <div 
  className="grid grid-cols-1 lg:grid-cols-[minmax(0,350px)_80px_minmax(0,350px)] max-w-6xl mx-auto px-4 mt-10" 
  style={{ 
    justifyContent: 'center', 
    alignItems: 'stretch',
    gap: '20px' // Added gap for when they stack vertically
  }}
>
  {/* Left Card */}
  <PersonCard 
    name="Athif Aziz" 
    role="Son of" 
    family="Mr. Azeez & Mrs. Soudha" 
    style={{ width: '100%', height: '100%', margin: 0 }} 
  />

  {/* Center Heart */}
  <div style={{ 
    fontFamily: '"Great Vibes", cursive', 
    fontSize: 'clamp(44px, 8vw, 64px)', 
    color: '#b05070', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60px' // Ensures space for the heart on mobile
  }}>
    ♥
  </div>

  {/* Right Card */}
  <PersonCard 
    name="Namra Shehsy" 
    role="Daughter of" 
    family="Mr. Saleem & Mrs. Naflu" 
    style={{ width: '100%', height: '100%', margin: 0 }}
  />
</div>

    {/* Couple illustration */}
    <div className="max-w-xs mx-auto mt-12 relative" style={{ border: '1px solid rgba(13,59,46,0.2)', padding: 16, background: 'linear-gradient(135deg,#0d3b2e,#1a5c44)' }}>
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl px-2"
        style={{ background: '#faf6f0', color: 'rgba(13,59,46,0.5)' }}>❧</div>
      <CoupleIllustration />
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xl px-2"
        style={{ background: '#faf6f0', color: 'rgba(13,59,46,0.5)', transform: 'translateX(-50%) scaleY(-1)' }}>❧</div>
    </div>
  </Reveal>
</section>

      {/* ══════════════════════════════════════════════════════════════════════
          CELEBRATIONS — Emerald dark section
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="sec-events" className="text-center" style={{ padding:'clamp(50px,9vw,90px) clamp(16px,5vw,60px)', background:'linear-gradient(180deg,#0d3b2e,#1a5c44,#0d3b2e)', position:'relative' }}>
        <div className="absolute inset-0" style={{ backgroundImage: ISLAMIC_PATTERN, backgroundSize:'120px 120px' }} />
        <div className="relative z-10">
          <Reveal>
            <GoldDivider light />
            <h2 style={titleStyle('#e8c97a')}>The Celebrations</h2>
            <p style={subStyle('rgba(232,201,122,0.6)')}>Join us for these precious moments</p>
            <div className="grid gap-5 max-w-md mx-auto px-4 mt-10">
              <motion.a
                href="https://www.google.com/maps/dir/?api=1&destination=Malabar+Avenue+Ramanattukara+Calicut+Kerala"
                target="_blank" rel="noreferrer"
                className="block relative text-center p-8 cursor-pointer"
                style={{ border:'1px solid rgba(201,168,76,0.35)', background:'rgba(201,168,76,0.06)', backdropFilter:'blur(4px)' }}
                whileHover={{ y:-5, borderColor:'rgba(201,168,76,0.7)' }} transition={{ duration:0.25 }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(to right,transparent,#c9a84c,transparent)' }} />
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:'linear-gradient(to right,transparent,rgba(201,168,76,0.3),transparent)' }} />
                <span className="text-3xl block mb-4">✨</span>
                <div style={{ fontFamily:'"Great Vibes",cursive', fontSize:'clamp(26px,4vw,34px)', color:'#e8c97a', marginBottom:16 }}>
                  Wedding Reception
                </div>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, letterSpacing:'2.5px', color:'rgba(232,201,122,0.65)', lineHeight:2.6, textTransform:'uppercase' }}>
                  Date<strong style={{ display:'block', color:'rgba(232,201,122,0.9)', fontSize:10, fontWeight:500, marginTop:2 }}>Saturday, 6th June 2026</strong>
                  Time<strong style={{ display:'block', color:'rgba(232,201,122,0.9)', fontSize:10, fontWeight:500, marginTop:2 }}>11:00 AM Onwards</strong>
                  Venue<strong style={{ display:'block', color:'rgba(232,201,122,0.9)', fontSize:10, fontWeight:500, marginTop:2 }}>Malabar Avenue, Calicut</strong>
                </div>
                <div style={{ marginTop:16, fontFamily:'Montserrat,sans-serif', fontSize:9, letterSpacing:3, textTransform:'uppercase', color:'rgba(201,168,76,0.5)' }}>
                  Tap for directions →
                </div>
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          VENUE — Light cream
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="sec-venue" className="text-center" style={{ padding:'clamp(50px,9vw,90px) clamp(16px,5vw,60px)', background:'#faf6f0' }}>
        <Reveal>
          <GoldDivider />
          <h2 style={titleStyle('#0d3b2e')}>Venue</h2>
          <p style={subStyle('#1a5c44')}>Where hearts will gather</p>
          <div style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontSize:'clamp(16px,2.5vw,20px)', color:'rgba(13,59,46,0.8)', lineHeight:2.2, marginTop:20, marginBottom:32 }}>
            Malabar Avenue<br />Ramanattukara, Calicut, Kerala
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {[
              { label:'Open in Maps', href:'https://maps.app.goo.gl/ZmPFAxwHUQCPZqT78' },
              { label:'Get Directions ↗', href:'https://www.google.com/maps/dir/?api=1&destination=Malabar+Avenue+Ramanattukara+Calicut+Kerala' },
            ].map(b => (
              <motion.a key={b.label} href={b.href} target="_blank" rel="noreferrer"
                style={{ display:'inline-block', fontFamily:'Montserrat,sans-serif', textTransform:'uppercase', color:'#1a5c44', textDecoration:'none', padding:'13px 28px', border:'1px solid rgba(13,59,46,0.4)', fontSize:10, letterSpacing:4, background:'transparent' }}
                whileHover={{ background:'rgba(13,59,46,0.08)', borderColor:'#0d3b2e' }}>
                {b.label}
              </motion.a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          COUNTDOWN — Emerald dark
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="sec-countdown" className="text-center" style={{ padding:'clamp(50px,9vw,90px) clamp(16px,5vw,60px)', background:'linear-gradient(135deg,#0d3b2e,#1a5c44,#0d3b2e)', position:'relative' }}>
        <div className="absolute inset-0" style={{ backgroundImage: ISLAMIC_PATTERN, backgroundSize:'120px 120px' }} />
        <div className="relative z-10">
          <Reveal>
            <GoldDivider light />
            <h2 style={titleStyle('#e8c97a')}>Counting Down</h2>
            <p style={subStyle('rgba(232,201,122,0.6)')}>To the most beautiful day</p>
            <div className="mt-10">
              <Countdown />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ — Cream
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="sec-faq" className="text-center" style={{ padding:'clamp(50px,9vw,90px) clamp(16px,5vw,60px)', background:'linear-gradient(180deg,#f5f0e8,#faf6f0)' }}>
        <Reveal>
          <GoldDivider />
          <h2 style={titleStyle('#0d3b2e')}>Important Information</h2>
          <p style={subStyle('#1a5c44')}>Frequently asked questions</p>
          <div className="max-w-xl mx-auto text-left px-4 mt-10">
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderBottom:'1px solid rgba(13,59,46,0.12)', overflow:'hidden' }}>
                <div className="flex items-center justify-between py-5 cursor-pointer gap-4 transition-colors"
                  style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(15px,2.5vw,17px)', color:'rgba(13,59,46,0.8)' }}
                  onClick={() => setOpenFaq(openFaq===i?null:i)}>
                  <span>{f.q}</span>
                  <motion.span animate={{ rotate: openFaq===i?45:0 }} transition={{ duration:0.3 }}
                    style={{ color:'#1a5c44', opacity:0.7, fontSize:20, flexShrink:0 }}>+</motion.span>
                </div>
                <AnimatePresence>
                  {openFaq===i && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.35 }} style={{ overflow:'hidden' }}>
                      <p style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', paddingBottom:20, fontSize:15, color:'rgba(13,59,46,0.65)', lineHeight:1.9 }}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          RSVP — Emerald dark with cream card
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="sec-rsvp" className="text-center" style={{ padding:'clamp(50px,9vw,90px) clamp(16px,5vw,60px)', background:'linear-gradient(180deg,#0d3b2e,#1a5c44)', position:'relative' }}>
        <div className="absolute inset-0" style={{ backgroundImage: ISLAMIC_PATTERN, backgroundSize:'120px 120px' }} />
        <div className="relative z-10">
          <Reveal>
            <GoldDivider light />
            <h2 style={titleStyle('#e8c97a')}>RSVP</h2>
            <p style={subStyle('rgba(232,201,122,0.6)')}>Your presence is our greatest gift</p>
            <div className="mt-10">
              {guest ? <RSVPFlow guest={guest} /> : (
                <div style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', color:'rgba(232,201,122,0.6)', fontSize:18 }}>
                  Loading your invitation...
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          GET IN TOUCH — Cream
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="sec-contact" className="text-center" style={{ padding:'clamp(50px,9vw,90px) clamp(16px,5vw,60px)', background:'linear-gradient(180deg,#f5f0e8,#faf6f0)' }}>
  <Reveal>
    <GoldDivider />
    <h2 style={titleStyle('#0d3b2e')}>Get in Touch</h2>
    <p style={subStyle('#1a5c44')}>We would love to hear from you</p>
    
    <div 
  className="grid gap-4 max-w-5xl mx-auto px-4 mt-10" 
  style={{ 
    display: 'grid',
    // Using a simple calculation: if width is small, use 2 columns; otherwise, 4.
    gridTemplateColumns: window.innerWidth < 640 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
    justifyContent: 'center'
  }}
>
      {[
        { icon:'📍', label:'Open Maps',   href:'https://maps.app.goo.gl/ZmPFAxwHUQCPZqT78' },
        { icon:'📞', label:'Call Family', href:'tel:+916282142322' },
        { icon:'💬', label:'Whats App',    href:'https://wa.me/916282142322?text=Hi!%20I%20received%20your%20wedding%20invitation.' },
        { icon:'🔗', label:'Share Invite',href:'#', onClick: share },
      ].map(c => (
        <motion.a key={c.label} href={c.href}
          target={c.href.startsWith('http')?'_blank':undefined} rel="noreferrer"
          onClick={c.onClick ? e => { e.preventDefault(); c.onClick!() } : undefined}
          className="flex flex-col items-center gap-2 py-7 cursor-pointer no-underline"
          style={{ 
            border:'1px solid rgba(13,59,46,0.2)', 
            background:'rgba(13,59,46,0.03)',
            borderRadius: '4px' // Optional: adds a slight elegance
          }}
          whileHover={{ y:-4, borderColor:'rgba(13,59,46,0.5)', background:'rgba(13,59,46,0.07)' }}
          whileTap={{ scale:0.97 }}>
          <span className="text-3xl">{c.icon}</span>
          <span style={{ 
            fontFamily:'Montserrat,sans-serif', 
            fontSize: 9, 
            lineHeight: 1.4, // Prevents text overlapping if it wraps
            letterSpacing: 2, // Slightly reduced for mobile readability
            color:'rgba(13,59,46,0.6)', 
            textTransform:'uppercase',
            textAlign: 'center'
          }}>
            {c.label}
          </span>
        </motion.a>
      ))}
    </div>
  </Reveal>
</section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER — Emerald dark
      ══════════════════════════════════════════════════════════════════════ */}
      <Reveal>
        <footer className="text-center" style={{ padding:'60px 20px 80px', background:'linear-gradient(180deg,#0d3b2e,#081f18)', borderTop:'1px solid rgba(201,168,76,0.2)', position:'relative' }}>
          <div className="absolute inset-0" style={{ backgroundImage: ISLAMIC_PATTERN, backgroundSize:'120px 120px' }} />
          <div className="relative z-10">
            <div style={{ width:1, height:60, background:'linear-gradient(to bottom,transparent,#c9a84c,transparent)', margin:'0 auto 24px' }} />
            {/* Bottom arch */}
            <div style={{ maxWidth:300, margin:'0 auto 24px', opacity:0.3 }}>
              <IslamicArch color="#c9a84c" opacity={1} />
            </div>
            <div style={{ fontFamily:'"Great Vibes",cursive', fontSize:'clamp(32px,6vw,50px)', color:'#e8c97a' }}>
              Athif Aziz   &amp;   Namra Shehsy
            </div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:5, color:'rgba(201,168,76,0.45)', textTransform:'uppercase', marginTop:12 }}>
              6th June 2026 · Ramanattukara, Calicut
            </div>
            <div className="flex justify-center gap-3 mt-5">
              {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, background:'#b05070', transform:'rotate(45deg)', opacity:0.6, borderRadius:1 }} />)}
            </div>
            <div style={{ fontFamily:'"Great Vibes",cursive', fontSize:'clamp(18px,3vw,24px)', color:'rgba(201,168,76,0.35)', marginTop:28 }}>
              With love &amp; blessings
            </div>
            {/* Bismillah closing */}
            <div style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontSize:13, color:'rgba(201,168,76,0.3)', marginTop:20, letterSpacing:2 }}>
              بارك الله لكما وبارك عليكما
            </div>
          </div>
        </footer>
      </Reveal>

      <style>{`
        .section-pad { padding: clamp(50px,9vw,90px) clamp(16px,5vw,60px); }
        @media(max-width:600px){
          [style*="gridTemplateColumns: 1fr auto 1fr"]{grid-template-columns:1fr !important}
          [style*="gridTemplateColumns: repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr) !important}
        }
      `}</style>
    </div>
  )
}

// ── Small reusable sub-components ─────────────────────────────────────────────
const titleStyle = (color: string): React.CSSProperties => ({
  fontFamily: '"Great Vibes", cursive',
  fontSize: 'clamp(38px,7vw,58px)',
  color,
  marginBottom: 8,
})
const subStyle = (color: string): React.CSSProperties => ({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 10,
  letterSpacing: 5,
  color,
  textTransform: 'uppercase',
  marginBottom: 10,
})

const GoldDivider = ({ light = false }: { light?: boolean }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, margin:'0 auto 40px', maxWidth:500 }}>
    <div style={{ flex:1, height:1, background:`linear-gradient(to right,transparent,${light?'rgba(201,168,76,0.7)':'rgba(13,59,46,0.5)'} 50%,transparent)` }} />
    <span style={{ color: light?'#c9a84c':'#1a5c44', fontSize:16, opacity:0.8 }}>✦</span>
    <div style={{ flex:1, height:1, background:`linear-gradient(to left,transparent,${light?'rgba(201,168,76,0.7)':'rgba(13,59,46,0.5)'} 50%,transparent)` }} />
  </div>
)

const PersonCard = ({ name, role, family }: { name: string; role: string; family: string }) => (
  <div className="p-6 text-center relative"
    style={{ border:'1px solid rgba(13,59,46,0.2)', background:'rgba(13,59,46,0.03)' }}>
    <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:36, height:2, background:'#1a5c44' }} />
    <div style={{ fontFamily:'"Great Vibes",cursive', fontSize:'clamp(26px,5vw,42px)', color:'#0d3b2e', marginBottom:8 }}>{name}</div>
    <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, letterSpacing:2, color:'rgba(13,59,46,0.5)', textTransform:'uppercase' }}>{role}</div>
    <div style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontSize:15, color:'rgba(13,59,46,0.7)', marginTop:6 }}>{family}</div>
  </div>
)

const StoryCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-5" style={{ border:'1px solid rgba(13,59,46,0.15)', background:'rgba(13,59,46,0.02)' }}>
    <div style={{ fontFamily:'"Great Vibes",cursive', fontSize:26, color:'#0d3b2e', marginBottom:8 }}>{title}</div>
    <p style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontSize:14, color:'rgba(13,59,46,0.7)', lineHeight:1.8 }}>{desc}</p>
  </div>
)
