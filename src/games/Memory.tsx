import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useSkills } from '@/content/hooks'
import { useT } from '@/i18n'
import { unlock } from '@/lib/achievements'
import { getBest, saveBest } from './storage'
import { Logo } from '@/components/Logo'

interface Card {
  id: number
  key: string
  img?: string
  label: string
}

function shuffle<T>(a: T[]) {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

/** Memory : retrouver les paires de logos de la stack. */
export function Memory() {
  const t = useT()
  const skills = useSkills()
  const faces = useMemo(() => skills.slice(0, 6).map((s) => ({ key: s._id, img: s.icon?.src, label: s.name })), [skills])

  const deal = () => shuffle([...faces, ...faces]).map((f, id) => ({ ...f, id }))
  const [cards, setCards] = useState<Card[]>(deal)
  const [flipped, setFlipped] = useState<number[]>([])
  const [found, setFound] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [start, setStart] = useState<number | null>(null)
  const [time, setTime] = useState(0)
  const [record, setRecord] = useState(false)
  const done = found.size === faces.length && faces.length > 0

  useEffect(() => {
    if (!start || done) return
    const id = window.setInterval(() => setTime(Math.floor((Date.now() - start) / 1000)), 250)
    return () => window.clearInterval(id)
  }, [start, done])

  useEffect(() => {
    if (!done) return
    unlock('memory')
    setRecord(saveBest('memory', moves, true))
  }, [done, moves])

  const flip = (c: Card) => {
    if (flipped.length === 2 || flipped.includes(c.id) || found.has(c.key)) return
    if (!start) setStart(Date.now())
    const next = [...flipped, c.id]
    setFlipped(next)
    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = next.map((id) => cards.find((x) => x.id === id)!)
      window.setTimeout(
        () => {
          if (a.key === b.key) setFound((f) => new Set(f).add(a.key))
          setFlipped([])
        },
        a.key === b.key ? 350 : 800,
      )
    }
  }

  const restart = () => {
    setCards(deal())
    setFlipped([])
    setFound(new Set())
    setMoves(0)
    setStart(null)
    setTime(0)
    setRecord(false)
  }

  const best = getBest('memory')

  return (
    <div className="game">
      <div className="game__hud">
        <span>
          {t('Coups')} <strong>{moves}</strong>
        </span>
        <span>
          {t('Temps')} <strong>{time}s</strong>
        </span>
        <span>
          {t('Record')} <strong>{best ? t('{n} coups', { n: best }) : '—'}</strong>
        </span>
        <button className="game__btn" onClick={restart}>
          ↻ {t('Rejouer')}
        </button>
      </div>

      <div className="memory">
        {cards.map((c) => {
          const open = flipped.includes(c.id) || found.has(c.key)
          return (
            <button
              key={c.id}
              className={`memory__card ${open ? 'is-open' : ''} ${found.has(c.key) ? 'is-found' : ''}`}
              onClick={() => flip(c)}
              aria-label={open ? c.label : t('Carte cachée')}
            >
              <span className="memory__inner">
                <span className="memory__back">
                  <Logo size={36} />
                </span>
                <span className="memory__front">
                  {c.img ? <img src={c.img} alt="" /> : <b>{c.label.slice(0, 2)}</b>}
                  <small>{c.label}</small>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {done && (
        <motion.p className="game__win" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          🎉 {t('Gagné en {m} coups et {s} s !', { m: moves, s: time })} {record && `🏆 ${t('Nouveau record !')}`}
        </motion.p>
      )}
    </div>
  )
}
