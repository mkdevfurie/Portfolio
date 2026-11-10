import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneColors } from './config'
import { getScroll } from '@/lib/scroll'

interface Props {
  count: number
  reducedMotion: boolean
}

type Kind = 'octa' | 'torus' | 'tetra' | 'box'
const KINDS: Kind[] = ['octa', 'torus', 'tetra', 'box']

/** Pseudo-aléatoire déterministe (même disposition à chaque chargement). */
function rand(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Petites formes géométriques réparties autour de la scène.
 * Chacune a sa profondeur de parallaxe : elles montent à des vitesses
 * différentes avec le scroll et tournent selon la vitesse de défilement.
 */
export function FloatingShapes({ count, reducedMotion }: Props) {
  const group = useRef<THREE.Group>(null)
  const spin = useRef(0)

  const shapes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1
        return {
          kind: KINDS[i % KINDS.length],
          pos: new THREE.Vector3(
            side * (3.2 + rand(i) * 5),
            -3 + rand(i + 7) * 7,
            4 - rand(i + 13) * 30,
          ),
          scale: 0.16 + rand(i + 3) * 0.32,
          parallax: 2 + rand(i + 5) * 7,
          speed: 0.4 + rand(i + 9) * 1.2,
          wire: i % 3 === 0,
          color: i % 3 === 0 ? 'light' : i % 3 === 1 ? 'accent' : 'primary',
        } as const
      }),
    [count],
  )

  useFrame((state, delta) => {
    const g = group.current
    if (!g || reducedMotion) return
    const sc = getScroll()
    const d = Math.min(delta, 1 / 30)
    spin.current += d * (0.3 + Math.min(Math.abs(sc.velocity) * 0.05, 3))
    const t = state.clock.elapsedTime
    g.children.forEach((m, i) => {
      const s = shapes[i]
      m.position.y = s.pos.y + sc.progress * s.parallax + Math.sin(t * s.speed + i) * 0.15
      m.rotation.x = spin.current * s.speed
      m.rotation.y = spin.current * s.speed * 0.7 + i
    })
  })

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <mesh key={i} position={s.pos} scale={s.scale}>
          {s.kind === 'octa' && <octahedronGeometry args={[1, 0]} />}
          {s.kind === 'torus' && <torusGeometry args={[0.9, 0.28, 12, 32]} />}
          {s.kind === 'tetra' && <tetrahedronGeometry args={[1.1, 0]} />}
          {s.kind === 'box' && <boxGeometry args={[1.2, 1.2, 1.2]} />}
          {s.wire ? (
            <meshBasicMaterial color={sceneColors[s.color]} wireframe transparent opacity={0.5} />
          ) : (
            <meshStandardMaterial
              color={sceneColors[s.color]}
              emissive={sceneColors[s.color]}
              emissiveIntensity={sceneColors.isLight ? 0.1 : 0.45}
              metalness={0.7}
              roughness={0.3}
            />
          )}
        </mesh>
      ))}
    </group>
  )
}
