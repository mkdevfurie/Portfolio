import { useEffect, useRef, useState } from 'react'
import { onSceneReady } from '@/lib/sceneReady'
import { Logo } from './Logo'
import { useT } from '@/i18n'

const MIN_MS = 900
const HARD_CAP_MS = 3500
const FADE_MS = 600

export function Loader() {
  const [gone, setGone] = useState(false)
  const t = useT()
  const [leaving, setLeaving] = useState(false)
  const [pct, setPct] = useState(8)
  const mounted = useRef(performance.now())

  useEffect(() => {
    const tick = window.setInterval(() => {
      setPct((p) => (p < 90 ? p + Math.max(1, (92 - p) * 0.08) : p))
    }, 90)

    let removeTimer = 0
    const finish = () => {
      window.clearInterval(tick)
      setPct(100)
      const wait = Math.max(0, MIN_MS - (performance.now() - mounted.current))
      window.setTimeout(() => {
        setLeaving(true)
        removeTimer = window.setTimeout(() => setGone(true), FADE_MS)
      }, wait)
    }

    const off = onSceneReady(finish)
    const cap = window.setTimeout(finish, HARD_CAP_MS)
    return () => {
      off()
      window.clearInterval(tick)
      window.clearTimeout(cap)
      window.clearTimeout(removeTimer)
    }
  }, [])

  if (gone) return null

  return (
    <div className={`loader${leaving ? ' loader--leaving' : ''}`} aria-hidden={leaving}>
      <div className="loader__mark">
        <Logo size={64} draw />
      </div>
      <p className="loader__label">
        {t('Construction de l’espace…')} <span className="loader__pct">{Math.round(pct)}%</span>
      </p>
      <div className="loader__bar">
        <span className="loader__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
