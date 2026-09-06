import { useEffect, useState } from 'react'

export interface Quality {
  /** appareil tactile étroit → on allège tout */
  isMobile: boolean
  /** l'utilisateur a demandé à réduire les animations */
  reducedMotion: boolean
  /** activer le post-traitement (bloom, etc.) */
  postFx: boolean
  /** nombre de particules dans le champ stellaire */
  starCount: number
  /** pixel ratio max */
  dpr: [number, number]
}

function compute(): Quality {
  if (typeof window === 'undefined') {
    return { isMobile: false, reducedMotion: false, postFx: true, starCount: 3500, dpr: [1, 2] }
  }
  const isMobile = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cores = navigator.hardwareConcurrency ?? 4
  const weak = isMobile || cores <= 4

  return {
    isMobile,
    reducedMotion,
    postFx: !weak && !reducedMotion,
    starCount: reducedMotion ? 800 : weak ? 1400 : 4000,
    dpr: [1, isMobile ? 1.5 : 2],
  }
}

export function useQuality(): Quality {
  const [q, setQ] = useState<Quality>(compute)

  useEffect(() => {
    const onChange = () => setQ(compute())
    const mqs = [
      window.matchMedia('(max-width: 820px)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ]
    mqs.forEach((m) => m.addEventListener('change', onChange))
    return () => mqs.forEach((m) => m.removeEventListener('change', onChange))
  }, [])

  return q
}
