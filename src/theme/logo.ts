/**
 * Logo de KPEMOUA David — symbole sans lettres « < ◆ > ».
 * Deux chevrons de code (le développeur) encadrent un losange rouge, repris du
 * motif brodé de sa tenue traditionnelle (l'identité). Couleurs de marque
 * fixes : bleu, noir, une touche de rouge — indépendantes du thème du site.
 *
 * Repère : viewBox "0 0 100 100".
 */
export const LOGO_VIEWBOX = '0 0 100 100'

export const BRAND = {
  blueLight: '#4c8dff',
  blue: '#1650d6',
  red: '#e5283a',
  black: '#0a0e16',
}

export const LOGO_PATHS = {
  left: 'M36 18L10 50L36 82',
  right: 'M64 18L90 50L64 82',
  gem: 'M50 34L64 50L50 66L36 50Z',
}

/** Logo en SVG brut (favicon, exports). */
export function logoMarkSvg(o: { w?: number; id?: string } = {}) {
  const { w = 11, id = 'logo' } = o
  const p = LOGO_PATHS
  return `<defs><linearGradient id="${id}-g" gradientUnits="userSpaceOnUse" x1="8" y1="10" x2="92" y2="90"><stop offset="0" stop-color="${BRAND.blueLight}"/><stop offset="1" stop-color="${BRAND.blue}"/></linearGradient></defs>
<g fill="none" stroke="url(#${id}-g)" stroke-width="${w}" stroke-linejoin="miter" stroke-linecap="square">
<path d="${p.left}"/><path d="${p.right}"/>
</g>
<path d="${p.gem}" fill="${BRAND.red}"/>`
}
