/**
 * Monogramme « MKD » — géométrie partagée par le composant <Logo>, le favicon
 * et les icônes exportées. Le M et le K partagent le même fût ; les extrémités
 * sont coupées à l'horizontale par un masque (bande y ∈ [10, 56]).
 *
 * Repère : viewBox "0 0 146 66" (le point final occupe x ∈ [133, 141]).
 */
export const LOGO_VIEWBOX = '0 0 146 66'
export const LOGO_RATIO = 146 / 66

/** Tracés du monogramme pour une épaisseur de trait donnée. */
export function logoPaths(w = 9) {
  const t = 10 + w / 2
  const b = 56 - w / 2
  return {
    m: 'M10 70V4L32 36L54 4V70',
    kArm: 'M50 46.75L86 4',
    kLeg: 'M56 20L90 70',
    d: `M102 ${t}V${b}H108C121 ${b} 125 44 125 33C125 22 121 ${t} 108 ${t}Z`,
  }
}

/** Les trois masques utilisés par le monogramme. */
export const LOGO_CLIPS = {
  band: { x: 0, y: 10, width: 146, height: 46 },
  arm: { x: 54, y: 0, width: 92, height: 70 },
  leg: '54,42 86,4 146,4 146,66 54,66',
}

/** Monogramme en SVG brut (pour le favicon / les exports). */
export function logoMarkSvg(o: { stroke: string; w?: number; dot?: string | null; id?: string }) {
  const { stroke, w = 9, dot = null, id = 'mkd' } = o
  const p = logoPaths(w)
  const c = LOGO_CLIPS
  return `<clipPath id="${id}-band"><rect x="${c.band.x}" y="${c.band.y}" width="${c.band.width}" height="${c.band.height}"/></clipPath>
<clipPath id="${id}-arm"><rect x="${c.arm.x}" y="${c.arm.y}" width="${c.arm.width}" height="${c.arm.height}"/></clipPath>
<clipPath id="${id}-leg"><polygon points="${c.leg}"/></clipPath>
<g clip-path="url(#${id}-band)" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="miter" stroke-miterlimit="20">
<path d="${p.m}"/>
<g clip-path="url(#${id}-arm)"><path d="${p.kArm}"/></g>
<g clip-path="url(#${id}-leg)"><path d="${p.kLeg}"/></g>
<path d="${p.d}"/>
</g>${dot ? `<rect x="133" y="48" width="8" height="8" fill="${dot}"/>` : ''}`
}
