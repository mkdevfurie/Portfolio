import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SECTIONS } from '@/lib/sections'
import { scrollToSection } from '@/lib/scroll'
import { useSettings } from '@/content/hooks'
import { THEMES } from '@/theme/themes'
import { useTheme } from '@/theme/ThemeProvider'
import { copyText, isTyping, toast } from '@/lib/toast'
import { EASE } from '@/lib/motion'
import { useI18n } from '@/i18n'
import { openTerminal } from './Terminal'
import { openPanel } from './Overlay'
import { unlock } from '@/lib/achievements'

interface Action {
  id: string
  group: string
  label: string
  hint?: string
  keywords?: string
  run: () => void
}

const OPEN_EVENT = 'open-command-palette'

/** Ouvre la palette depuis n'importe quel bouton. */
// eslint-disable-next-line react-refresh/only-export-components
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
// eslint-disable-next-line react-refresh/only-export-components
export const PALETTE_SHORTCUT = isMac ? '⌘K' : 'Ctrl K'

/**
 * Palette de commandes (Ctrl/⌘ + K ou « / ») : aller à une section, changer de thème,
 * copier l'email, ouvrir les réseaux… Raccourci « T » : thème suivant.
 */
export function CommandPalette() {
  const s = useSettings()
  const { t: tr } = useI18n()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)

  const actions = useMemo<Action[]>(() => {
    const a: Action[] = SECTIONS.map((sec, i) => ({
      id: `go-${sec.id}`,
      group: 'Navigation',
      label: sec.label,
      hint: String(i + 1),
      keywords: sec.id,
      run: () => scrollToSection(sec.id),
    }))
    a.push({
      id: 'terminal',
      group: 'Outils',
      label: 'Ouvrir le terminal interactif',
      hint: '²',
      keywords: 'console shell commande jeu',
      run: openTerminal,
    })
    ;(
      [
        ['games', '🎮 Arcade : mini-jeux', 'jeu game memory quiz catch'],
        ['achievements', '🏆 Mes succès', 'badge trophee'],
        ['estimator', '🧮 Estimer mon projet', 'devis prix tarif budget'],
        ['booking', '📅 Réserver un appel', 'rendez-vous rdv calendrier'],
        ['recruiter', '📄 Mode recruteur (CV une page)', 'cv imprimer pdf resume'],
      ] as const
    ).forEach(([id, label, keywords]) =>
      a.push({ id: `panel-${id}`, group: 'Outils', label, keywords, run: () => openPanel(id) }),
    )
    THEMES.forEach((t) =>
      a.push({
        id: `theme-${t.id}`,
        group: 'Thème',
        label: `${tr('Thème')} ${tr(t.label)}`,
        hint: t.id === theme.id ? tr('actif') : undefined,
        keywords: 'couleur theme mode',
        run: () => {
          setTheme(t.id)
          toast(tr('Thème {name} activé', { name: tr(t.label) }))
        },
      }),
    )
    a.push({
      id: 'copy-email',
      group: 'Contact',
      label: "Copier l'adresse email",
      hint: s.email,
      keywords: 'mail courriel',
      run: () => copyText(s.email, tr('Email copié dans le presse-papiers')),
    })
    if (s.whatsapp)
      a.push({
        id: 'whatsapp',
        group: 'Contact',
        label: 'Discuter sur WhatsApp',
        run: () => window.open(`https://wa.me/${s.whatsapp}`, '_blank', 'noopener'),
      })
    const links: [string, string | undefined][] = [
      ['GitHub', s.socials.github],
      ['LinkedIn', s.socials.linkedin],
      ['Télécharger le CV', s.cvUrl],
    ]
    links.forEach(([label, href]) => {
      if (href)
        a.push({
          id: `link-${label}`,
          group: 'Liens',
          label,
          keywords: 'reseau social',
          run: () => window.open(href, '_blank', 'noopener'),
        })
    })
    a.push({
      id: 'copy-url',
      group: 'Liens',
      label: 'Copier le lien du portfolio',
      keywords: 'partager url',
      run: () => copyText(location.origin, tr('Lien copié — merci de partager !')),
    })
    return a.map((x) => ({ ...x, label: tr(x.label), group: tr(x.group) }))
  }, [s, theme.id, setTheme, tr])

  const filtered = useMemo(() => {
    const n = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    const terms = n(q).split(/\s+/).filter(Boolean)
    if (!terms.length) return actions
    return actions.filter((a) => {
      const hay = n(`${a.label} ${a.group} ${a.keywords ?? ''}`)
      return terms.every((t) => hay.includes(t))
    })
  }, [q, actions])

  // raccourcis clavier globaux
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }
      if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (!open && n >= 1 && n <= SECTIONS.length) {
        scrollToSection(SECTIONS[n - 1].id)
      } else if (e.key === '/') {
        e.preventDefault()
        setOpen(true)
      } else if (e.key.toLowerCase() === 't' && !open) {
        const i = THEMES.findIndex((t) => t.id === theme.id)
        const next = THEMES[(i + 1) % THEMES.length]
        setTheme(next.id)
        toast(`${tr('Thème')} ${tr(next.label)}`)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_EVENT, onOpen)
    }
  }, [open, theme.id, setTheme, tr])

  useEffect(() => {
    if (open) {
      unlock('palette')
      setQ('')
      setSel(0)
      requestAnimationFrame(() => input.current?.focus())
    }
  }, [open])

  useEffect(() => setSel(0), [q])

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  const run = (a?: Action) => {
    if (!a) return
    setOpen(false)
    // laisse la palette se fermer avant de défiler
    window.setTimeout(a.run, 60)
  }

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel((v) => Math.min(v + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel((v) => Math.max(v - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(filtered[sel])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  let lastGroup = ''

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            className="cmdk__panel"
            role="dialog"
            aria-modal="true"
            aria-label={tr('Palette de commandes')}
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            <div className="cmdk__search">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onInputKey}
                placeholder={tr('Rechercher une action, une section, un thème…')}
                aria-label={tr('Rechercher une commande')}
                aria-controls="cmdk-list"
                aria-activedescendant={filtered[sel] ? `cmdk-${filtered[sel].id}` : undefined}
              />
              <kbd>{tr('Échap')}</kbd>
            </div>

            <ul className="cmdk__list" id="cmdk-list" role="listbox" ref={list} data-lenis-prevent>
              {filtered.length === 0 && <li className="cmdk__empty">{tr('Aucun résultat pour « {q} »', { q })}</li>}
              {filtered.map((a, i) => {
                const head = a.group !== lastGroup ? a.group : null
                lastGroup = a.group
                return (
                  <li key={a.id} role="presentation">
                    {head && <div className="cmdk__group">{head}</div>}
                    <button
                      id={`cmdk-${a.id}`}
                      role="option"
                      aria-selected={i === sel}
                      data-i={i}
                      className={`cmdk__item ${i === sel ? 'is-sel' : ''}`}
                      onPointerMove={() => setSel(i)}
                      onClick={() => run(a)}
                    >
                      <span>{a.label}</span>
                      {a.hint && <em>{a.hint}</em>}
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="cmdk__foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> {tr('naviguer')}
              </span>
              <span>
                <kbd>↵</kbd> {tr('valider')}
              </span>
              <span>
                <kbd>T</kbd> {tr('thème suivant')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
