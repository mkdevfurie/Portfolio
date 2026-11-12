import { logoMarkSvg } from './logo'

/**
 * Favicon : monogramme « MKD » blanc sur une tuile en dégradé aux couleurs du thème.
 * Trait plus épais que dans le logo pour rester lisible à 16 px.
 */
export function faviconSvg(c: { bg: string; primary: string; accent: string; light: string }): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.accent}"/>
      <stop offset="1" stop-color="${c.primary}"/>
    </linearGradient>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".22"/>
      <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <rect width="64" height="64" rx="14" fill="url(#s)"/>
  <g transform="translate(5.5 17.5) scale(0.405)">${logoMarkSvg({ stroke: '#fff', w: 12 })}</g>
</svg>`
}

export function faviconDataUrl(c: Parameters<typeof faviconSvg>[0]): string {
  return `data:image/svg+xml,${encodeURIComponent(faviconSvg(c))}`
}
