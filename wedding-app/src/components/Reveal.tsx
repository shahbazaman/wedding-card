import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export const Reveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export const SectionDivider = () => (
  <div className="flex items-center justify-center gap-5 mb-10 max-w-md mx-auto">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    <span className="text-gold text-sm opacity-80">✦</span>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold to-transparent" />
  </div>
)
