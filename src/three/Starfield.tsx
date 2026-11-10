import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneColors } from './config'
import { getScroll } from '@/lib/scroll'

interface Props {
  count: number
  reducedMotion: boolean
}

/** Champ d'étoiles enveloppant, rotation très lente + respiration. */
export function Starfield({ count, reducedMotion }: Props) {
  const ref = useRef<THREE.Points>(null)
  const warp = useRef(1)
  const spin = useRef(0)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = [
      sceneColors.light,
      sceneColors.accent,
      sceneColors.primary,
      sceneColors.isLight ? sceneColors.mid : new THREE.Color('#ffffff'),
    ]

    for (let i = 0; i < count; i++) {
      // coquille sphérique
      const r = 14 + Math.random() * 30
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
      positions[i * 3 + 2] = r * Math.cos(phi)

      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current || reducedMotion) return
    const sc = getScroll()
    // rotation liée à la progression du scroll + dérive lente
    spin.current += delta * 0.012
    ref.current.rotation.y = spin.current + sc.progress * Math.PI * 0.6
    ref.current.rotation.x = spin.current * 0.33 - sc.progress * 0.4
    // effet "hyperespace" : le champ s'étire en profondeur quand on défile vite
    const v = Math.min(Math.abs(sc.velocity) * 0.035, 1.6)
    warp.current = THREE.MathUtils.damp(warp.current, 1 + v, 5, Math.min(delta, 1 / 30))
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02
    ref.current.scale.set(s, s / (1 + (warp.current - 1) * 0.3), s * warp.current)
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.08}
        sizeAttenuation
        vertexColors
        transparent
        opacity={sceneColors.isLight ? 0.55 : 0.9}
        depthWrite={false}
        blending={sceneColors.isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  )
}
