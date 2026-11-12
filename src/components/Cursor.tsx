import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, .pcard'
const MAGNETIC = '.btn, .nav__link, .theme-switch__btn, .to-top, [data-magnetic]'
const SPOTLIGHT = '.skill, .service, .cform'

/**
 * Effets pointeur (souris uniquement, désactivés si « réduire les animations ») :
 *  - curseur personnalisé : point + anneau qui suit avec inertie et grossit sur les liens ;
 *  - boutons « magnétiques » qui se laissent attirer par le curseur ;
 *  - halo lumineux qui suit la souris sur les cartes (variables --mx / --my).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    document.documentElement.classList.add('has-cursor')
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { ...pos }
    let visible = false
    let magnet: HTMLElement | null = null
    let raf = 0

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!visible) {
        visible = true
        ringPos.x = pos.x
        ringPos.y = pos.y
        document.documentElement.classList.add('cursor-visible')
      }
      const t = e.target as Element | null

      // survol d'un élément interactif
      const hot = t?.closest?.(INTERACTIVE)
      ring.current?.classList.toggle('is-hover', !!hot)
      ring.current?.classList.toggle('is-text', !!t?.closest?.('input, textarea'))

      // halo sur les cartes
      const card = t?.closest?.(SPOTLIGHT) as HTMLElement | null
      if (card) {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${e.clientX - r.left}px`)
        card.style.setProperty('--my', `${e.clientY - r.top}px`)
      }

      // boutons magnétiques
      const m = t?.closest?.(MAGNETIC) as HTMLElement | null
      if (magnet && magnet !== m) {
        magnet.style.transform = ''
        magnet = null
      }
      if (m) {
        magnet = m
        const r = m.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        m.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`
      }
    }

    const onLeave = () => {
      visible = false
      document.documentElement.classList.remove('cursor-visible')
    }
    const onDown = () => ring.current?.classList.add('is-down')
    const onUp = () => ring.current?.classList.remove('is-down')

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-cursor', 'cursor-visible')
      if (magnet) magnet.style.transform = ''
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden>
        <span />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden>
        <span />
      </div>
    </>
  )
}
