import { useId } from 'react'
import { LOGO_CLIPS, LOGO_VIEWBOX, logoPaths } from '@/theme/logo'

interface Props {
  /** hauteur en px (la largeur suit le ratio) */
  size?: number
  /** anime le tracé des lettres (écran de chargement) */
  draw?: boolean
  /** affiche le point d'accent final */
  dot?: boolean
  className?: string
  title?: string
}

/**
 * Monogramme « MKD » en SVG inline, coloré par les variables du thème
 * (dégradé --c-pale → --c-accent, point en --c-accent).
 */
export function Logo({ size = 28, draw = false, dot = true, className = '', title = 'MKD' }: Props) {
  const uid = useId().replace(/:/g, '')
  const p = logoPaths(9)
  const c = LOGO_CLIPS
  const stroke = `url(#${uid}-g)`
  const pathProps = draw ? { pathLength: 1, className: 'logo__stroke' } : {}

  return (
    <svg
      className={`logo ${draw ? 'logo--draw' : ''} ${className}`}
      viewBox={LOGO_VIEWBOX}
      height={size}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={`${uid}-g`} gradientUnits="userSpaceOnUse" x1="10" y1="10" x2="125" y2="56">
          <stop offset="0" stopColor="var(--logo-from, var(--c-pale))" />
          <stop offset="1" stopColor="var(--logo-to, var(--c-accent))" />
        </linearGradient>
        <clipPath id={`${uid}-band`}>
          <rect {...c.band} />
        </clipPath>
        <clipPath id={`${uid}-arm`}>
          <rect {...c.arm} />
        </clipPath>
        <clipPath id={`${uid}-leg`}>
          <polygon points={c.leg} />
        </clipPath>
      </defs>
      <g
        clipPath={`url(#${uid}-band)`}
        fill="none"
        stroke={stroke}
        strokeWidth={9}
        strokeLinejoin="miter"
        strokeMiterlimit={20}
      >
        <path d={p.m} {...pathProps} style={{ ['--i' as string]: 0 }} />
        <g clipPath={`url(#${uid}-arm)`}>
          <path d={p.kArm} {...pathProps} style={{ ['--i' as string]: 1 }} />
        </g>
        <g clipPath={`url(#${uid}-leg)`}>
          <path d={p.kLeg} {...pathProps} style={{ ['--i' as string]: 2 }} />
        </g>
        <path d={p.d} {...pathProps} style={{ ['--i' as string]: 3 }} />
      </g>
      {dot && <rect className="logo__dot" x="133" y="48" width="8" height="8" fill="var(--c-accent)" />}
    </svg>
  )
}
