import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { GamesHub } from '@/games/GamesHub'
import { openPanel } from './Overlay'
import { ACHIEVEMENTS, getUnlocked, onAchievements, setAchievementTranslator, unlock } from '@/lib/achievements'
import { useT } from '@/i18n'
import { isTyping } from '@/lib/toast'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

/** Pluie de confettis plein écran (code Konami). */
function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const c = document.createElement('canvas')
  c.className = 'confetti'
  c.width = innerWidth
  c.height = innerHeight
  document.body.appendChild(c)
  const g = c.getContext('2d')!
  const css = getComputedStyle(document.documentElement)
  const colors = ['--c-accent', '--c-light', '--c-pale', '--c-primary'].map((v) => css.getPropertyValue(v).trim())
  colors.push('#ffd166', '#3fd68f', '#ff6b6b')
  const parts = Array.from({ length: 180 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200,
    y: innerHeight * 0.6,
    vx: (Math.random() - 0.5) * 16,
    vy: -Math.random() * 18 - 6,
    r: Math.random() * 6 + 4,
    c: colors[Math.floor(Math.random() * colors.length)],
    a: Math.random() * Math.PI,
  }))
  let frames = 0
  const loop = () => {
    g.clearRect(0, 0, c.width, c.height)
    parts.forEach((p) => {
      p.vy += 0.45
      p.vx *= 0.99
      p.x += p.vx
      p.y += p.vy
      p.a += 0.2
      g.save()
      g.translate(p.x, p.y)
      g.rotate(p.a)
      g.fillStyle = p.c
      g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2)
      g.restore()
    })
    if (++frames < 220) requestAnimationFrame(loop)
    else c.remove()
  }
  loop()
}

/**
 * Bouton flottant de l'arcade (jeux + succès) et déclencheurs globaux des succès :
 * code Konami, visite nocturne, exploration jusqu'au Contact.
 */
export function Arcade() {
  const t = useT()
  const [count, setCount] = useState(() => getUnlocked().size)
  const [bump, setBump] = useState(0)
  const seq = useRef<string[]>([])

  useEffect(() => setAchievementTranslator(t), [t])

  useEffect(
    () =>
      onAchievements(() => {
        setCount(getUnlocked().size)
        setBump((b) => b + 1)
      }),
    [],
  )

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 5) window.setTimeout(() => unlock('nightowl'), 4000)

    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e)) return
      seq.current = [...seq.current, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length)
      if (seq.current.join() === KONAMI.join()) {
        confetti()
        unlock('konami')
        seq.current = []
      }
    }
    window.addEventListener('keydown', onKey)

    const contact = document.getElementById('contact')
    const io = contact
      ? new IntersectionObserver(([e]) => e.isIntersecting && unlock('explorer'), { threshold: 0.35 })
      : null
    if (contact) io!.observe(contact)

    return () => {
      window.removeEventListener('keydown', onKey)
      io?.disconnect()
    }
  }, [])

  return (
    <>
      <motion.button
        className="arcade-btn"
        onClick={() => openPanel('games')}
        aria-label={t('Arcade : mini-jeux et succès')}
        title={t('Arcade : mini-jeux et succès')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <span className="arcade-btn__icon">🎮</span>
        <span className="arcade-btn__label">{t('Arcade')}</span>
        <motion.span
          key={bump}
          className="arcade-btn__count"
          initial={{ scale: bump ? 1.6 : 1 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14 }}
        >
          🏆 {count}/{ACHIEVEMENTS.length}
        </motion.span>
      </motion.button>
      <GamesHub />
    </>
  )
}
