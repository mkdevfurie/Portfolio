import { useEffect, useState } from 'react'

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
  useEffect(() => {
    const id = window.setInterval(() => setT(now()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <p className="localtime">
      <span className={`localtime__dot ${t.awake ? 'is-on' : ''}`} />
      <span>
        Il est <strong>{t.time}</strong> à Lomé ·{' '}
        {t.awake ? 'je suis probablement en ligne' : 'je vous réponds dès demain matin'}
      </span>
    </p>
  )
}
