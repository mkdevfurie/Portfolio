import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { THEMES } from '@/theme/themes'
import { useTheme } from '@/theme/ThemeProvider'
import { EASE } from '@/lib/motion'

/** Bouton + menu déroulant pour changer de thème (couleurs du site et de la 3D). */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="theme-switch" ref={ref}>
      <button
        className="theme-switch__btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Thème : ${theme.label}. Changer de thème`}
        title="Changer de thème"
      >
        <span
          className="theme-switch__dot"
          style={{ background: `linear-gradient(135deg, ${theme.palette.accent}, ${theme.palette.primary})` }}
        />
        <span className="theme-switch__label">{theme.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="theme-switch__menu"
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {THEMES.map((t) => (
              <li key={t.id}>
                <button
                  role="menuitemradio"
                  aria-checked={t.id === theme.id}
                  className={`theme-switch__item ${t.id === theme.id ? 'is-active' : ''}`}
                  onClick={() => {
                    setTheme(t.id)
                    setOpen(false)
                  }}
                >
                  <span className="theme-switch__swatch" style={{ background: t.ui.bg }}>
                    <i style={{ background: t.palette.primary }} />
                    <i style={{ background: t.palette.accent }} />
                    <i style={{ background: t.palette.light }} />
                  </span>
                  {t.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
