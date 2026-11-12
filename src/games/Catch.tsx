import { useEffect, useRef, useState } from 'react'
import { useSkills } from '@/content/hooks'
import { useT } from '@/i18n'
import { unlock } from '@/lib/achievements'
import { getBest, saveBest } from './storage'

interface Drop {
  x: number
  y: number
  vy: number
  bug: boolean
  img: number
  rot: number
}

const W = 640
const H = 400

/** Stack Catch : attraper les logos de la stack, éviter les bugs 🐛. */
export function Catch() {
  const t = useT()
  const skills = useSkills()
  const canvas = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<'idle' | 'play' | 'over'>('idle')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [record, setRecord] = useState(false)
  const imgs = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    imgs.current = skills
      .filter((s) => s.icon?.src)
      .map((s) => {
        const im = new Image()
        im.src = s.icon!.src
        return im
      })
  }, [skills])

  useEffect(() => {
    if (state !== 'play') return
    const c = canvas.current!
    const g = c.getContext('2d')!
    const css = getComputedStyle(document.documentElement)
    const accent = css.getPropertyValue('--c-accent').trim() || '#378add'
    const light = css.getPropertyValue('--c-light').trim() || '#85b7eb'

    let paddle = W / 2
    let target = W / 2
    let drops: Drop[] = []
    let sc = 0
    let lv = 3
    let spawn = 0
    let last = performance.now()
    let raf = 0
    let flash = 0
    const keys = { l: false, r: false }

    const toLocal = (clientX: number) => {
      const r = c.getBoundingClientRect()
      return ((clientX - r.left) / r.width) * W
    }
    const onMove = (e: PointerEvent) => (target = toLocal(e.clientX))
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'q') keys.l = down
      if (e.key === 'ArrowRight' || e.key === 'd') keys.r = down
      if (e.key.startsWith('Arrow')) e.preventDefault()
    }
    const kd = (e: KeyboardEvent) => onKey(e, true)
    const ku = (e: KeyboardEvent) => onKey(e, false)
    c.addEventListener('pointermove', onMove)
    c.addEventListener('pointerdown', onMove)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const level = 1 + sc / 12

      if (keys.l) target -= 520 * dt
      if (keys.r) target += 520 * dt
      target = Math.max(45, Math.min(W - 45, target))
      paddle += (target - paddle) * Math.min(1, dt * 14)

      spawn -= dt
      if (spawn <= 0) {
        spawn = Math.max(0.32, 0.95 - level * 0.08)
        drops.push({
          x: 30 + Math.random() * (W - 60),
          y: -30,
          vy: 120 + Math.random() * 60 + level * 28,
          bug: Math.random() < Math.min(0.38, 0.18 + level * 0.03),
          img: Math.floor(Math.random() * Math.max(1, imgs.current.length)),
          rot: Math.random() * 6,
        })
      }

      // logique
      const PY = H - 34
      drops = drops.filter((d) => {
        d.y += d.vy * dt
        d.rot += dt * 2
        if (d.y > PY - 16 && d.y < PY + 14 && Math.abs(d.x - paddle) < 52) {
          if (d.bug) {
            lv -= 1
            flash = 0.35
            setLives(lv)
          } else {
            sc += 1
            setScore(sc)
            if (sc === 25) unlock('catcher')
          }
          return false
        }
        if (d.y > H + 30) {
          return false
        }
        return true
      })

      // rendu
      g.clearRect(0, 0, W, H)
      if (flash > 0) {
        flash -= dt
        g.fillStyle = `rgba(255, 80, 80, ${flash})`
        g.fillRect(0, 0, W, H)
      }
      for (const d of drops) {
        g.save()
        g.translate(d.x, d.y)
        if (d.bug) {
          g.font = '30px serif'
          g.textAlign = 'center'
          g.textBaseline = 'middle'
          g.fillText('🐛', 0, 0)
        } else {
          g.rotate(Math.sin(d.rot) * 0.3)
          g.fillStyle = 'rgba(255,255,255,0.92)'
          g.beginPath()
          g.roundRect(-20, -20, 40, 40, 10)
          g.fill()
          const im = imgs.current[d.img]
          if (im?.complete && im.naturalWidth) g.drawImage(im, -14, -14, 28, 28)
        }
        g.restore()
      }
      // panier
      const grad = g.createLinearGradient(paddle - 50, 0, paddle + 50, 0)
      grad.addColorStop(0, light)
      grad.addColorStop(1, accent)
      g.fillStyle = grad
      g.beginPath()
      g.roundRect(paddle - 50, PY, 100, 14, 7)
      g.fill()
      // losange rouge du logo au centre du panier
      g.fillStyle = '#e5283a'
      g.beginPath()
      g.moveTo(paddle, PY + 1.5)
      g.lineTo(paddle + 6, PY + 7)
      g.lineTo(paddle, PY + 12.5)
      g.lineTo(paddle - 6, PY + 7)
      g.closePath()
      g.fill()

      if (lv <= 0) {
        setState('over')
        setRecord(saveBest('catch', sc))
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      c.removeEventListener('pointermove', onMove)
      c.removeEventListener('pointerdown', onMove)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [state])

  const start = () => {
    setScore(0)
    setLives(3)
    setRecord(false)
    setState('play')
  }

  const best = getBest('catch')

  return (
    <div className="game">
      <div className="game__hud">
        <span>
          {t('Score')} <strong>{score}</strong>
        </span>
        <span>
          {t('Vies')} <strong>{'❤️'.repeat(Math.max(0, lives)) || '—'}</strong>
        </span>
        <span>
          {t('Record')} <strong>{best ?? '—'}</strong>
        </span>
      </div>
      <div className="catch">
        <canvas ref={canvas} width={W} height={H} className="catch__canvas" />
        {state !== 'play' && (
          <div className="catch__overlay">
            {state === 'over' ? (
              <>
                <p className="catch__big">{t('Partie terminée')}</p>
                <p>
                  {t('Score : {n}', { n: score })} {record && `🏆 ${t('Nouveau record !')}`}
                </p>
              </>
            ) : (
              <>
                <p className="catch__big">Stack Catch</p>
                <p>{t('Attrapez les technologies, évitez les bugs 🐛')}</p>
                <p className="catch__hint">{t('Souris / doigt ou flèches ← →')}</p>
              </>
            )}
            <button className="btn btn--primary" onClick={start}>
              {state === 'over' ? t('Rejouer') : t('Jouer')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
