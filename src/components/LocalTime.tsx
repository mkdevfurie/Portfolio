import { useEffect, useState } from 'react'
import { useT } from '@/i18n'

/** Lomé est en GMT toute l'année (pas d'heure d'été). */
const TZ = 'Africa/Lome'

function now() {
  const d = new Date()
  const time = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(d)
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: TZ }).format(d))
  return { time, awake: hour >= 8 && hour < 21 }
}

/** Heure locale à Lomé + indicateur de disponibilité. */
export function LocalTime() {
  const [t, setT] = useState(now)
  const tr = useT()
  useEffect(() => {
    const id = window.setInterval(() => setT(now()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <p className="localtime">
      <span className={`localtime__dot ${t.awake ? 'is-on' : ''}`} />
      <span>
        {tr('Il est')} <strong>{t.time}</strong> {tr('à Lomé')} ·{' '}
        {t.awake ? tr('je suis probablement en ligne') : tr('je vous réponds dès demain matin')}
      </span>
    </p>
  )
}
