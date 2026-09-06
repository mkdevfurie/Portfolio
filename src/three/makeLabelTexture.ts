import * as THREE from 'three'

/**
 * Génère une texture de texte via un canvas 2D (aucune police à charger).
 * Utilisé pour étiqueter les monolithes de projet dans la scène.
 */
export function makeLabelTexture(text: string, color = '#eaf3ff'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = color
  ctx.font = '600 130px "Space Grotesk", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(55,138,221,0.6)'
  ctx.shadowBlur = 28
  ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
