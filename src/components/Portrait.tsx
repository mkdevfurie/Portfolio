import { useRef, type PointerEvent } from 'react'
import { ME } from '@/content/me'
import { Logo } from './Logo'
import { useT } from '@/i18n'

interface Props {
  name: string
  role: string
}

/** Carte portrait inclinable (effet 3D au survol) avec reflet et badges. */
export function Portrait({ name, role }: Props) {
  const card = useRef<HTMLDivElement>(null)
  const t = useT()

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = card.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${-y * 10}deg`)
    el.style.setProperty('--ry', `${x * 12}deg`)
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const onLeave = () => {
    card.current?.style.setProperty('--rx', '0deg')
    card.current?.style.setProperty('--ry', '0deg')
  }

  return (
    <figure className="portrait" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="portrait__card" ref={card}>
        <span className="portrait__bg" aria-hidden>
          <Logo size={120} dot={false} className="portrait__mark" />
        </span>
        <img src={ME.portrait} alt={t(ME.alt)} width={640} height={800} loading="lazy" decoding="async" />
        <span className="portrait__glare" aria-hidden />
        <figcaption className="portrait__caption">
          <strong>{name}</strong>
          <span>{role}</span>
        </figcaption>
      </div>
      <span className="portrait__badge portrait__badge--loc">📍 {t('Lomé, Togo')}</span>
      <span className="portrait__badge portrait__badge--status">
        <i /> {t('Disponible')}
      </span>
    </figure>
  )
}
