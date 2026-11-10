import Lenis from 'lenis'
import { SECTIONS } from '@/three/config'

let lenis: Lenis | null = null
let rafId = 0

/**
 * État du scroll, lu chaque frame par la 3D.
 * - progress : progression globale 0 (haut) → 1 (bas)
 * - velocity : vitesse instantanée (Lenis)
 * - section  : position continue dans les sections, 0 → SECTIONS.length - 1
 *              (entier = milieu de la section, x.5 = passage à la suivante)
 * - local    : progression 0 → 1 à l'intérieur de chaque section (par id)
 */
const state = {
  progress: 0,
  velocity: 0,
  section: 0,
  local: Object.fromEntries(SECTIONS.map((s) => [s.id, 0])) as Record<string, number>,
}

let bounds: { top: number; height: number }[] = []
let resizeObs: ResizeObserver | null = null

function measureSections() {
  bounds = SECTIONS.map((s) => {
    const el = document.getElementById(s.id)
    if (!el) return { top: 0, height: 1 }
    const r = el.getBoundingClientRect()
    return { top: r.top + window.scrollY, height: Math.max(1, r.height) }
  })
  updateSections(window.scrollY)
}

function updateSections(scrollY: number) {
  if (!bounds.length) return
  const vh = window.innerHeight
  const center = scrollY + vh / 2
  const last = SECTIONS.length - 1

  SECTIONS.forEach((s, i) => {
    const b = bounds[i]
    // 0 quand le haut de la section atteint le bas de l'écran, 1 quand son bas quitte le haut
    const t = (scrollY + vh - b.top) / (b.height + vh)
    state.local[s.id] = Math.min(1, Math.max(0, t))
  })

  let idx = 0
  for (let i = 0; i <= last; i++) if (bounds[i].top <= center) idx = i
  const b = bounds[idx]
  const within = (center - b.top) / b.height
  state.section = Math.min(last, Math.max(0, idx + within - 0.5))
}

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
    updateSections(inst.scroll)
  })

  measureSections()
  window.addEventListener('resize', measureSections)
  window.addEventListener('load', measureSections)
  const main = document.querySelector('.scroll-dom')
  if (main && 'ResizeObserver' in window) {
    resizeObs = new ResizeObserver(() => measureSections())
    resizeObs.observe(main)
  }

  const raf = (time: number) => {
    lenis?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
}

export function destroyScroll() {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', measureSections)
  window.removeEventListener('load', measureSections)
  resizeObs?.disconnect()
  resizeObs = null
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
