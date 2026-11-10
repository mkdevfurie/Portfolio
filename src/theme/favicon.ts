/**
 * Logo "KD" (KPEMOUA David) utilisé comme favicon.
 * Les lettres sont des tracés (aucune police nécessaire), lisibles dès 16 px.
 */
export function faviconSvg(c: { bg: string; primary: string; accent: string; light: string }): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.accent}"/>
      <stop offset="1" stop-color="${c.primary}"/>
    </linearGradient>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".28"/>
      <stop offset=".5" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="15" fill="${c.bg}"/>
  <rect x="2" y="2" width="60" height="60" rx="13" fill="url(#g)"/>
  <rect x="2" y="2" width="60" height="60" rx="13" fill="url(#s)"/>
  <g fill="#fff">
    <rect x="9" y="16" width="7" height="32" rx="1"/>
    <polygon points="16,31 25,16 33.5,16 22.5,33"/>
    <polygon points="19.5,29.5 33.5,48 25,48 15.5,35"/>
    <path fill-rule="evenodd" d="M40 16H45C53 16 56 23 56 32C56 41 53 48 45 48H40ZM47 23C51.5 23 51.5 41 47 41Z"/>
  </g>
</svg>`
}

export function faviconDataUrl(c: Parameters<typeof faviconSvg>[0]): string {
  return `data:image/svg+xml,${encodeURIComponent(faviconSvg(c))}`
}
