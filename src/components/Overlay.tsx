import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE } from '@/lib/motion'
import { useT } from '@/i18n'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  /** largeur max du panneau */
  width?: number
  className?: string
  children: ReactNode
}

/** Fenêtre modale générique (Échap / clic extérieur pour fermer). */
export function Overlay({ open, onClose, title, width = 720, className = '', children }: Props) {
  const t = useT()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => panel.current?.focus())
    document.documentElement.classList.add('has-overlay')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('has-overlay')
      prev?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ovl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onPointerDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panel}
            tabIndex={-1}
            className={`ovl__panel ${className}`}
            style={{ maxWidth: width }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.32, ease: EASE }}
            data-lenis-prevent
          >
            <header className="ovl__head">
              <h2>{title}</h2>
              <button className="ovl__close" onClick={onClose} aria-label={t('Fermer')}>
                ×
              </button>
            </header>
            <div className="ovl__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Petit bus d'ouverture : openPanel('estimator') depuis n'importe où. */
export type PanelId = 'estimator' | 'booking' | 'recruiter' | 'games' | 'achievements' | `post:${string}`

const EVENT = 'open-panel'

// eslint-disable-next-line react-refresh/only-export-components
export function openPanel(id: PanelId) {
  window.dispatchEvent(new CustomEvent<PanelId>(EVENT, { detail: id }))
}

// eslint-disable-next-line react-refresh/only-export-components
export function onPanel(cb: (id: PanelId) => void) {
  const h = (e: Event) => cb((e as CustomEvent<PanelId>).detail)
  window.addEventListener(EVENT, h)
  return () => window.removeEventListener(EVENT, h)
}
