import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useExperience, useProjects, useServices, useSettings, useSkills } from '@/content/hooks'
import { useTheme } from '@/theme/ThemeProvider'
import { isTyping } from '@/lib/toast'
import { EASE } from '@/lib/motion'
import { ASCII_LOGO, Cmd, complete, Dim, Err, findCommand, Hl, Ok, type TermCtx } from '@/terminal/commands'

const OPEN_EVENT = 'open-terminal'
const BEST_KEY = 'mkd-guess-best'

// eslint-disable-next-line react-refresh/only-export-components
export function openTerminal() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

interface Line {
  id: number
  kind: 'in' | 'out'
  prompt?: string
  node: ReactNode
}

interface Game {
  target: number
  tries: number
}

function readBest(): number | null {
  try {
    const v = Number(localStorage.getItem(BEST_KEY))
    return v > 0 ? v : null
  } catch {
    return null
  }
}

/**
 * Terminal interactif : une autre façon de visiter le portfolio.
 * Ouverture : touche ² / ` , palette de commandes, bouton de l'accueil.
 */
export function Terminal() {
  const settings = useSettings()
  const projects = useProjects()
  const skills = useSkills()
  const experience = useExperience()
  const services = useServices()
  const { theme, setTheme } = useTheme()

  const [open, setOpen] = useState(false)
  const [max, setMax] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState<number | null>(null)
  const [game, setGame] = useState<Game | null>(null)
  const [matrixOn, setMatrixOn] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const idRef = useRef(0)
  const input = useRef<HTMLInputElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const booted = useRef(false)

  const user = settings.firstName.toLowerCase().replace(/\s+/g, '') || 'visiteur'
  const prompt = game ? 'devine ›' : `visiteur@${user}:~$`

  const print = useCallback((node: ReactNode, kind: Line['kind'] = 'out', p?: string) => {
    setLines((v) => [...v.slice(-200), { id: ++idRef.current, kind, node, prompt: p }])
  }, [])

  const close = useCallback(() => setOpen(false), [])

  /* ---------- jeu : devinez le nombre ---------- */
  const startGame = useCallback(() => {
    setGame({ target: 1 + Math.floor(Math.random() * 100), tries: 0 })
    const best = readBest()
    return (
      <>
        <div>
          🎯 <Hl>Devinez le nombre</Hl> entre 1 et 100.
        </div>
        <Dim>
          {best ? `Record actuel : ${best} essai${best > 1 ? 's' : ''}. ` : ''}Tapez « stop » pour abandonner.
        </Dim>
      </>
    )
  }, [])

  const playGuess = useCallback(
    (raw: string) => {
      if (!game) return
      if (/^(stop|q|quit|exit)$/i.test(raw)) {
        setGame(null)
        print(
          <Dim>
            Partie abandonnée. C'était {game.target}. <Cmd c="jeu" /> pour rejouer.
          </Dim>,
        )
        return
      }
      const n = Number(raw)
      if (!Number.isInteger(n) || n < 1 || n > 100) {
        print(<Err>Un nombre entier entre 1 et 100, s'il vous plaît.</Err>)
        return
      }
      const tries = game.tries + 1
      if (n === game.target) {
        const best = readBest()
        const record = !best || tries < best
        if (record)
          try {
            localStorage.setItem(BEST_KEY, String(tries))
          } catch {
            /* stockage indisponible */
          }
        setGame(null)
        print(
          <>
            <Ok>
              🎉 Bravo ! {n} trouvé en {tries} essai{tries > 1 ? 's' : ''}.
            </Ok>
            {record && <div><Hl>🏆 Nouveau record !</Hl></div>}
            <div className="t-gap">
              <Dim>Vous savez chercher, moi je sais coder : </Dim>
              <Cmd c="embaucher" /> <Cmd c="jeu" />
            </div>
          </>,
        )
        return
      }
      setGame({ ...game, tries })
      const far = Math.abs(n - game.target) > 20
      print(
        n < game.target ? (
          <span>↑ Plus grand{far ? ' — et de loin' : ''}</span>
        ) : (
          <span>↓ Plus petit{far ? ' — et de loin' : ''}</span>
        ),
      )
    },
    [game, print],
  )

  const ctx = useMemo<TermCtx>(
    () => ({
      settings,
      projects,
      skills,
      experience,
      services,
      themeId: theme.id,
      setTheme,
      history,
      clear: () => setLines([]),
      close,
      matrix: () => {
        setMatrixOn(true)
        window.setTimeout(() => setMatrixOn(false), 5000)
      },
      startGame,
    }),
    [settings, projects, skills, experience, services, theme.id, setTheme, history, close, startGame],
  )

  /* ---------- exécution ---------- */
  const exec = useCallback(
    (raw: string) => {
      const line = raw.trim()
      print(line, 'in', prompt)
      setValue('')
      setHIdx(null)
      if (!line) return
      setHistory((h) => (h[h.length - 1] === line ? h : [...h.slice(-49), line]))

      if (game) {
        playGuess(line)
        return
      }
      const [name, ...args] = line.split(/\s+/)
      const cmd = findCommand(name)
      if (!cmd) {
        print(
          <Err>
            {name} : commande introuvable. Tapez <Cmd c="aide" />
          </Err>,
        )
        return
      }
      const out = cmd.run(args, ctx)
      if (out !== undefined && out !== null) print(out)
    },
    [ctx, game, playGuess, print, prompt],
  )

  /* ---------- message d'accueil ---------- */
  useEffect(() => {
    if (!open || booted.current) return
    booted.current = true
    print(
      <div className="t-boot">
        <pre className="t-ascii">{ASCII_LOGO}</pre>
        <div>
          Bienvenue dans le terminal de{' '}
          <Hl>
            {settings.firstName} {settings.lastName}
          </Hl>{' '}
          <Dim>(mkd-sh 1.0)</Dim>
        </div>
        <div>
          Tapez <Cmd c="aide" /> pour commencer, ou essayez <Cmd c="whoami" /> <Cmd c="projets" />{' '}
          <Cmd c="neofetch" /> <Cmd c="jeu" />
        </div>
      </div>,
    )
  }, [open, print, settings])

  /* ---------- raccourcis globaux ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e) || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === '²' || e.key === '`' || e.code === 'Backquote') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_EVENT, onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus())
  }, [open])

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight })
  }, [lines])

  /* ---------- saisie ---------- */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      exec(value)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (game) return
      const r = complete(value, ctx)
      setValue(r.value)
      if (r.options.length > 1)
        print(
          <div className="t-ls">
            {r.options.map((o) => (
              <span key={o} className="t-hl">
                {o}
              </span>
            ))}
          </div>,
        )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const i = hIdx === null ? history.length - 1 : Math.max(0, hIdx - 1)
      setHIdx(i)
      setValue(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hIdx === null) return
      const i = hIdx + 1
      if (i >= history.length) {
        setHIdx(null)
        setValue('')
      } else {
        setHIdx(i)
        setValue(history[i])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setLines([])
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      if (window.getSelection()?.toString()) return
      e.preventDefault()
      print(value + '^C', 'in', prompt)
      setValue('')
      if (game) {
        setGame(null)
        print(<Dim>Partie interrompue.</Dim>)
      }
    }
  }

  /** clic sur une commande affichée = exécution */
  const onBodyClick = (e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-cmd]')
    if (btn?.dataset.cmd) {
      exec(btn.dataset.cmd)
      input.current?.focus()
      return
    }
    if (!window.getSelection()?.toString()) input.current?.focus()
  }

  /* ---------- déplacement de la fenêtre ---------- */
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const onBarDown = (e: React.PointerEvent) => {
    if (max || (e.target as HTMLElement).closest('button')) return
    if (window.matchMedia('(max-width: 720px)').matches) return
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onBarMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    setOffset({ x: d.ox + e.clientX - d.x, y: d.oy + e.clientY - d.y })
  }
  const onBarUp = () => {
    drag.current = null
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="term-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            className={`term ${max ? 'is-max' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Terminal interactif"
            style={max ? undefined : { translate: `${offset.x}px ${offset.y}px` }}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div
              className="term__bar"
              onPointerDown={onBarDown}
              onPointerMove={onBarMove}
              onPointerUp={onBarUp}
              onDoubleClick={() => setMax((v) => !v)}
            >
              <div className="term__dots">
                <button className="is-close" onClick={close} aria-label="Fermer le terminal" />
                <button className="is-min" onClick={close} aria-label="Réduire le terminal" />
                <button
                  className="is-max"
                  onClick={() => setMax((v) => !v)}
                  aria-label={max ? 'Restaurer la taille' : 'Agrandir le terminal'}
                />
              </div>
              <span className="term__title">
                {`visiteur@${user}`} — mkd-sh
              </span>
              <kbd className="term__hint">²</kbd>
            </div>

            {matrixOn && <MatrixRain />}
            <div className="term__body" ref={body} onClick={onBodyClick} data-lenis-prevent>
              {lines.map((l) =>
                l.kind === 'in' ? (
                  <div key={l.id} className="t-line t-in">
                    <span className="t-prompt">{l.prompt}</span> {l.node}
                  </div>
                ) : (
                  <div key={l.id} className="t-line">
                    {l.node}
                  </div>
                ),
              )}
              <div className="t-line t-in t-input">
                <label htmlFor="term-input" className="t-prompt">
                  {prompt}
                </label>
                <input
                  id="term-input"
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  aria-label="Commande"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Pluie de caractères façon « Matrix » derrière le texte. */
function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const g = c.getContext('2d')
    if (!g) return
    const w = (c.width = c.offsetWidth)
    const h = (c.height = c.offsetHeight)
    const size = 14
    const cols = Math.ceil(w / size)
    const drops = Array.from({ length: cols }, () => Math.random() * -40)
    const chars = 'アイウエオカキクケコサシスセソ0123456789MKD<>/{}'
    const color = getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim() || '#3fd68f'
    let raf = 0
    const draw = () => {
      g.fillStyle = 'rgba(0,0,0,0.12)'
      g.fillRect(0, 0, w, h)
      g.fillStyle = color
      g.font = `${size}px monospace`
      drops.forEach((y, i) => {
        g.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size)
        drops[i] = y * size > h && Math.random() > 0.97 ? 0 : y + 1
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className="term__matrix" aria-hidden />
}
