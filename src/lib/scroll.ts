import Lenis from 'lenis'
import { SECTIONS } from '@/three/config'

let lenis: Lenis | null = null
let rafId = 0

/** Progression globale du scroll, 0 (haut) → 1 (bas). Lue chaque frame par la 3D. */
const state = { progress: 0, velocity: 0 }

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initScroll() {
  if (lenis || typeof window === 'undefined') return

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !prefersReduced,
    syncTouch: false,
    touchMultiplier: 1.4,
  })

  lenis.on('scroll', (inst: Lenis) => {
    state.progress = Number.isFinite(inst.progress) ? inst.progress : 0
    state.velocity = inst.velocity
  })

  const raf = (time: number) => {
    lenis?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
}

export function destroyScroll() {
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  lenis = null
}

export function getScroll() {
  return state
}

/** Défilement animé vers une section par son id. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  // cible numérique absolue -> insensible à un éventuel désync interne de Lenis
  const top = el.getBoundingClientRect().top + window.scrollY
  if (lenis) lenis.scrollTo(top, { duration: 1.2 })
  else window.scrollTo({ top, behavior: 'smooth' })
}

/** Index de la section actuellement la plus visible (pour l'état actif du menu). */
export function currentSectionIndex() {
  if (typeof window === 'undefined') return 0
  const mid = window.scrollY + window.innerHeight * 0.4
  let idx = 0
  SECTIONS.forEach((s, i) => {
    const el = document.getElementById(s.id)
    if (el && el.offsetTop <= mid) idx = i
  })
  return idx
}
