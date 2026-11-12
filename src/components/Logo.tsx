import { useId } from 'react'
import { BRAND, LOGO_PATHS, LOGO_VIEWBOX } from '@/theme/logo'

interface Props {
  /** taille en px (symbole carré) */
  size?: number
  /** anime le tracé (écran de chargement) */
  draw?: boolean
  /** une seule couleur (currentColor) — pour les filigranes */
  mono?: boolean
  className?: string
  title?: string
}

/** Symbole « < ◆ > » : chevrons de code bleus et losange rouge. Couleurs de marque fixes. */
export function Logo({ size = 28, draw = false, mono = false, className = '', title = 'KPEMOUA David' }: Props) {
  const uid = useId().replace(/:/g, '')
  const blue = mono ? 'currentColor' : `url(#${uid}-g)`
  const red = mono ? 'currentColor' : BRAND.red
  const stroke = (i: number) =>
    draw ? { pathLength: 1, className: 'logo__stroke', style: { ['--i' as string]: i } } : {}

  return (
    <svg
      className={`logo ${draw ? 'logo--draw' : ''} ${className}`}
      viewBox={LOGO_VIEWBOX}
      width={size}
      height={size}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={`${uid}-g`} gradientUnits="userSpaceOnUse" x1="8" y1="10" x2="92" y2="90">
          <stop offset="0" stopColor={BRAND.blueLight} />
          <stop offset="1" stopColor={BRAND.blue} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={blue} strokeWidth={11} strokeLinejoin="miter" strokeLinecap="square">
        <g className="logo__left">
          <path d={LOGO_PATHS.left} {...stroke(0)} />
        </g>
        <g className="logo__right">
          <path d={LOGO_PATHS.right} {...stroke(1)} />
        </g>
      </g>
      <path className="logo__gem" d={LOGO_PATHS.gem} fill={red} />
    </svg>
  )
}
