import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE } from '@/lib/motion'

interface Props extends HTMLMotionProps<'div'> {
  children: ReactNode
  /** décalage d'apparition en secondes */
  delay?: number
  /** distance de translation initiale (px) */
  y?: number
}

/** Révèle son contenu (fondu + glissé) quand il entre dans le viewport. */
export function Reveal({ children, delay = 0, y = 26, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
