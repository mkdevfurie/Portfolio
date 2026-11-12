import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { SECTIONS } from '@/lib/sections'
import { currentSectionIndex, scrollToSection } from '@/lib/scroll'
import { useSettings } from '@/content/hooks'
import { EASE } from '@/lib/motion'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Logo } from './Logo'
import { openCommandPalette, PALETTE_SHORTCUT } from './CommandPalette'
import { useI18n } from '@/i18n'
import { LangSwitch } from './LangSwitch'

export function Nav() {
  const settings = useSettings()
  const { t } = useI18n()
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
      <button className="nav__brand" onClick={() => go('hero')} aria-label={t('Retour en haut')}>
        <Logo size={24} />
        <span className="nav__brand-sep" aria-hidden />
        <span className="nav__brand-name">
          {settings.firstName}
          <span>{settings.lastName}</span>
        </span>
      </button>

      <nav className={`nav__links ${open ? 'is-open' : ''}`}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`nav__link ${i === active ? 'is-active' : ''}`}
            onClick={() => go(s.id)}
          >
            {t(s.label)}
          </button>
        ))}
        {settings.cvUrl ? (
          <a className="btn btn--primary nav__cv" href={settings.cvUrl} target="_blank" rel="noreferrer">
            CV
          </a>
        ) : null}
      </nav>

      <div className="nav__actions">
        <button className="nav__cmd" onClick={openCommandPalette} aria-label={t('Ouvrir la palette de commandes')} title={t('Commandes rapides')}>
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <kbd>{PALETTE_SHORTCUT}</kbd>
        </button>
        <LangSwitch />
        <ThemeSwitcher />
        <button
        className={`nav__burger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={t('Menu')}
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
        </button>
      </div>
    </motion.header>
  )
}
