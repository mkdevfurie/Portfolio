import { BRAND, logoMarkSvg } from './logo'

/** Icône de marque : symbole « < ◆ > » sur tuile noire (traits épaissis pour rester lisibles à 16 px). */
export function faviconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BRAND.black}"/>
  <rect x="0.5" y="0.5" width="63" height="63" rx="13.5" fill="none" stroke="#fff" stroke-opacity=".08"/>
  <g transform="translate(9 9) scale(0.46)">${logoMarkSvg({ w: 14, id: 'fav' })}</g>
</svg>`
}
