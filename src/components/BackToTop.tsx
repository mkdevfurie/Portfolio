import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { scrollToSection } from '@/lib/scroll'
import { useT } from '@/i18n'

const R = 20
const C = 2 * Math.PI * R

/** Bouton « retour en haut » avec anneau de progression du défilement. */
export function BackToTop() {
  const { scrollYProgress } = useScroll()
  const t = useT()
  const [p, setP] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', setP)
  const show = p > 0.12

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="to-top"
          onClick={() => scrollToSection('hero')}
          aria-label={t('Retour en haut')}
          title={t('Retour en haut')}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <svg viewBox="0 0 48 48" aria-hidden>
            <circle cx="24" cy="24" r={R} className="to-top__track" />
            <circle
              cx="24"
              cy="24"
              r={R}
              className="to-top__bar"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - p)}
            />
            <path d="M24 31V17M17.5 23.5L24 17l6.5 6.5" className="to-top__arrow" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
