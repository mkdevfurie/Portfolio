import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { getScroll } from '@/lib/scroll'

/** Post-traitement : bloom + aberration réactive au scroll + vignette + grain. */
export function Effects() {
  const ca = useRef<{ offset: THREE.Vector2 } | null>(null)
  const offset = useRef(new THREE.Vector2(0.0006, 0.0006))

  useFrame((_, delta) => {
    if (!ca.current) return
    const v = Math.min(Math.abs(getScroll().velocity) * 0.00025, 0.004)
    offset.current.x = THREE.MathUtils.damp(offset.current.x, 0.0006 + v, 6, delta)
    offset.current.y = offset.current.x
    ca.current.offset = offset.current
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.3}
        mipmapBlur
        radius={0.7}
      />
      <ChromaticAberration
        ref={ca as never}
        blendFunction={BlendFunction.NORMAL}
        offset={offset.current}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.22} darkness={0.72} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.28} />
    </EffectComposer>
  )
}
