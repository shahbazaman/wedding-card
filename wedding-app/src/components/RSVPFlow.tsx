import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import type { Guest } from '../lib/supabase'

type Step = 'choice' | 'count' | 'confirmed' | 'declined'

interface Props {
  guest: Guest
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:   { opacity: 0, scale: 0.92, y: -20, transition: { duration: 0.3 } },
}

export const RSVPFlow = ({ guest }: Props) => {
  const [step, setStep] = useState<Step>('choice')
  const [guestCount, setGuestCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [existingRsvp, setExistingRsvp] = useState(false)

  const firstName = guest.name.split(' ')[0]

  const submitRSVP = async (attending: boolean, count: number) => {
    setLoading(true)
    try {
      // Upsert: delete old, insert new
      await supabase.from('rsvps').delete().eq('guest_id', guest.id)
      await supabase.from('rsvps').insert({
        guest_id: guest.id,
        attending,
        guest_count: attending ? count : 0,
      })
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleYes = () => setStep('count')

  const handleNo = async () => {
    await submitRSVP(false, 0)
    setStep('declined')
  }

  const handleConfirm = async () => {
    await submitRSVP(true, guestCount)
    setStep('confirmed')
  }

  const handleChange = () => {
    setStep('choice')
    setGuestCount(1)
    setExistingRsvp(true)
  }

  // ── Shared card wrapper (matches sample image style) ──────────────────────
  const Card = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative bg-white/95 backdrop-blur-sm rounded-sm shadow-2xl p-8 max-w-sm w-full mx-auto"
      style={{ border: '1px solid rgba(212,175,122,0.25)' }}
    >
      {/* Corner brackets like sample images */}
      <div className="gold-border-corner top-0 left-0" style={{ borderWidth: '1px 0 0 1px' }} />
      <div className="gold-border-corner top-0 right-0" style={{ borderWidth: '1px 1px 0 0' }} />
      <div className="gold-border-corner bottom-0 left-0" style={{ borderWidth: '0 0 1px 1px' }} />
      <div className="gold-border-corner bottom-0 right-0" style={{ borderWidth: '0 1px 1px 0' }} />

      {/* RSVP label */}
      <p className="text-center font-montserrat text-[9px] tracking-[5px] text-gray-400 uppercase mb-1">R S V P</p>
      <h2 className="text-center font-vibes text-4xl text-gray-800 mb-1">Will you attend?</h2>
      <p className="text-center font-cormorant text-base italic text-gray-500 mb-1">
        Dear {firstName}, we would love to know
      </p>
      {children}
    </motion.div>
  )

  return (
    <div className="relative w-full px-4">
      {/* Scattered petals around card (like sample images) */}
      {['top-2 left-4 rotate-12','top-6 right-6 -rotate-20','bottom-4 left-8 rotate-45','bottom-2 right-4 -rotate-12'].map((cls,i) => (
        <div key={i} className={`absolute ${cls} text-rose-200 opacity-60 text-xs pointer-events-none`} style={{ fontSize: 10+i*2 }}>🌸</div>
      ))}

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Yes / No ── */}
        {step === 'choice' && (
          <Card key="choice">
            <p className="text-center font-cormorant text-sm italic text-gray-400 mb-6 mt-2">
              How many guests will be attending?
            </p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {/* YES */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleYes}
                className="flex flex-col items-center gap-2 p-5 rounded-sm border transition-all"
                style={{ background: 'rgba(212,175,122,0.08)', borderColor: 'rgba(212,175,122,0.35)', borderRadius: '8px',}}
              >
                <span className="text-3xl">😊</span>
                <span className="font-cormorant italic text-gray-700 text-sm">Yes, In Sha Allah!</span>
              </motion.button>
              {/* NO */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNo}
                className="flex flex-col items-center gap-2 p-5 rounded-sm border transition-all"
                // style={{ borderColor: 'rgba(200,168,130,0.25)', borderRadius: '8px' }}
                style={{ background: 'rgba(200,168,130,0.25)', borderColor: 'rgba(200,168,130,0.25)', borderRadius: '8px',}}
              >
                <span className="text-3xl">🙏</span>
                <span className="font-cormorant italic text-gray-600 text-sm">Unfortunately, I can't make it</span>
              </motion.button>
            </div>
          </Card>
        )}

        {/* ── STEP 2: Guest Count ── */}
        {step === 'count' && (
          <Card key="count">
            <p className="text-center font-cormorant text-sm italic text-gray-500 mb-6 mt-2">
              How many guests will be attending?
            </p>
            {/* Counter */}
            <div className="flex items-center justify-center gap-5 my-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setGuestCount(c => Math.max(1, c - 1))}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-600 text-xl font-light hover:border-gold hover:text-gold transition-colors"
              >
                −
              </motion.button>
              <motion.span
                key={guestCount}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-cormorant text-5xl text-gray-800 w-16 text-center font-light"
              >
                {guestCount}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setGuestCount(c => Math.min(10, c + 1))}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-600 text-xl font-light hover:border-gold hover:text-gold transition-colors"
              >
                +
              </motion.button>
            </div>
            <p className="text-center font-montserrat text-[10px] text-gray-400 mb-6 tracking-wider uppercase">
              {guestCount === 1 ? '1 Guest' : `${guestCount} Guests`} attending
            </p>
            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep('choice')}
                className="flex-1 py-3 border border-gray-200 font-montserrat text-xs tracking-[3px] uppercase text-gray-500 hover:border-gray-400 transition-colors"
              >
                Back
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={handleConfirm}
                className="flex-1 py-3 font-montserrat text-xs tracking-[3px] uppercase text-white transition-all"
                style={{ background: loading ? '#c8a882' : '#9b2335' }}
                whileHover={{ background: '#7a1a28' }}
              >
                {loading ? 'Confirming...' : 'Confirm'}
              </motion.button>
            </div>
          </Card>
        )}

        {/* ── STEP 3a: Confirmed ── */}
        {step === 'confirmed' && (
          <Card key="confirmed">
            <div className="flex flex-col items-center gap-3 mt-4">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.2 }}
                className="text-5xl"
              >
                🌸
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="font-vibes text-3xl text-center text-gray-800 mb-1">JazakAllah Khair!</h3>
                <p className="font-cormorant italic text-gray-500 text-center text-sm leading-relaxed">
                  We look forward to celebrating with you. See you on the 6th, Insha Allah!
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="text-center mt-2"
              >
                <p className="font-montserrat text-xs tracking-[3px] uppercase text-gray-500">
                  {guestCount} Guest{guestCount > 1 ? 's' : ''} Confirmed
                </p>
                <button
                  onClick={handleChange}
                  className="mt-3 font-montserrat text-[9px] tracking-[3px] uppercase text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
                >
                  Change Response
                </button>
              </motion.div>
            </div>
          </Card>
        )}

        {/* ── STEP 3b: Declined ── */}
        {step === 'declined' && (
          <Card key="declined">
            <div className="flex flex-col items-center gap-3 mt-4">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.2 }}
                className="text-5xl"
              >
                🙏
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="font-vibes text-3xl text-center text-gray-800 mb-1">JazakAllah Khair!</h3>
                <p className="font-cormorant italic text-gray-500 text-center text-sm leading-relaxed">
                  We understand and wish you well. May Allah bless you always.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-2">
                <button
                  onClick={handleChange}
                  className="font-montserrat text-[9px] tracking-[3px] uppercase text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
                >
                  Change Response
                </button>
              </motion.div>
            </div>
          </Card>
        )}
      </AnimatePresence>
    </div>
  )
}
