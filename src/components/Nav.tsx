import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { SECTIONS } from '@/three/config'
import { currentSectionIndex, scrollToSection } from '@/lib/scroll'
import { useSettings } from '@/content/hooks'
import { EASE } from '@/lib/motion'

export function Nav() {
  const settings = useSettings()
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setActive(currentSectionIndex())
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    scrollToSection(id)
  }

  return (
    <motion.header
      className="nav"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
    >
      <button className="nav__brand" onClick={() => go('hero')} aria-label="Retour en haut">
        {settings.firstName}
        <span>{settings.lastName}</span>
      </button>

      <nav className={`nav__links ${open ? 'is-open' : ''}`}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`nav__link ${i === active ? 'is-active' : ''}`}
            onClick={() => go(s.id)}
          >
            {s.label}
          </button>
        ))}
        {settings.cvUrl ? (
          <a className="btn btn--primary nav__cv" href={settings.cvUrl} target="_blank" rel="noreferrer">
            CV
          </a>
        ) : null}
      </nav>

      <button
        className={`nav__burger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>
    </motion.header>
  )
}
