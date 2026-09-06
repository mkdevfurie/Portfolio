import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { sceneColors } from './config'
import { getScroll } from '@/lib/scroll'

interface Props {
  reducedMotion: boolean
}

/**
 * Objet central : un noyau qui se déforme lentement, entouré d'une
 * cage filaire. Il tourne et réagit un peu à la vitesse de scroll.
 */
export function Crystal({ reducedMotion }: Props) {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const distort = useRef<number>(0.32)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    if (!reducedMotion) {
      group.current.rotation.y += delta * 0.16
      group.current.rotation.z = Math.sin(t * 0.12) * 0.12
      const vel = Math.min(Math.abs(getScroll().velocity) * 0.02, 0.5)
      distort.current = THREE.MathUtils.damp(distort.current, 0.3 + vel, 4, delta)
      const mat = core.current?.material as { distort?: number } | undefined
      if (mat && typeof mat.distort === 'number') mat.distort = distort.current
    }
    const breathe = 1 + Math.sin(t * 0.5) * 0.03
    group.current.scale.setScalar(breathe)
  })

  return (
    <group position={[1.8, -0.2, 0]}>
    <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={group}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.35, 12]} />
          <MeshDistortMaterial
            color={sceneColors.primary}
            emissive={sceneColors.accent}
            emissiveIntensity={0.35}
            roughness={0.15}
            metalness={0.9}
            distort={0.32}
            speed={1.6}
          />
        </mesh>

        <mesh scale={1.55}>
          <icosahedronGeometry args={[1.35, 2]} />
          <meshBasicMaterial
            color={sceneColors.light}
            wireframe
            transparent
            opacity={0.14}
          />
        </mesh>

        <mesh scale={2.1}>
          <sphereGeometry args={[1.35, 32, 32]} />
          <meshBasicMaterial
            color={sceneColors.accent}
            transparent
            opacity={0.04}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </Float>
    </group>
  )
}
