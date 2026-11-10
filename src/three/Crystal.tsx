import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { sceneColors } from './config'
import { getScroll } from '@/lib/scroll'

interface Props {
  reducedMotion: boolean
}

/** Placement du cristal pour chaque section (même ordre que SECTIONS). */
const KEYS: { pos: [number, number, number]; scale: number }[] = [
  { pos: [2.9, 0.1, -1.2], scale: 0.72 }, // hero — à droite du titre
  { pos: [-0.6, -0.4, -4.5], scale: 0.6 }, // about — en retrait entre le texte et les cartes
  { pos: [0, 1.6, -9], scale: 0.5 }, // projects — au fond de l'allée
  { pos: [1.8, 1.4, -7], scale: 0.7 }, // skills — en hauteur, derrière la grille
  { pos: [3.4, 0.2, -2.5], scale: 0.62 }, // journey — à droite de la frise
  { pos: [-0.5, 0.2, -4], scale: 0.75 }, // contact — derrière, entre texte et formulaire
]

const tmp = new THREE.Vector3()
const a = new THREE.Vector3()
const b = new THREE.Vector3()

/**
 * Objet central : noyau déformé + cage filaire + halo.
 * Il voyage d'une section à l'autre, tourne avec le scroll
 * et se déforme davantage quand on défile vite.
 */
export function Crystal({ reducedMotion }: Props) {
  const root = useRef<THREE.Group>(null)
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const cage = useRef<THREE.Mesh>(null)
  const rings = useRef<THREE.Group>(null)
  const anim = useRef({ distort: 0.32, section: 0, spin: 0, cage: 1.55 })

  useFrame((state, delta) => {
    if (!group.current || !root.current) return
    const d = Math.min(delta, 1 / 30)
    const t = state.clock.elapsedTime
    const sc = getScroll()
    const s = anim.current

    // déplacement entre les positions-clés
    s.section = THREE.MathUtils.damp(s.section, sc.section, 4, d)
    const last = KEYS.length - 1
    const seg = THREE.MathUtils.clamp(s.section, 0, last)
    const i = Math.min(Math.floor(seg), last - 1)
    const f = THREE.MathUtils.smoothstep(seg - i, 0, 1)
    a.fromArray(KEYS[i].pos)
    b.fromArray(KEYS[i + 1].pos)
    tmp.lerpVectors(a, b, f)
    root.current.position.copy(tmp)
    const keyScale = THREE.MathUtils.lerp(KEYS[i].scale, KEYS[i + 1].scale, f)

    const vel = Math.min(Math.abs(sc.velocity) * 0.02, 0.6)
    if (!reducedMotion) {
      // la rotation suit la progression du scroll + une dérive continue
      s.spin += d * (0.16 + vel * 1.4)
      group.current.rotation.y = s.spin
      group.current.rotation.x = sc.progress * Math.PI * 1.5
      group.current.rotation.z = Math.sin(t * 0.12) * 0.12

      s.distort = THREE.MathUtils.damp(s.distort, 0.3 + vel, 4, d)
      const mat = core.current?.material as { distort?: number } | undefined
      if (mat && typeof mat.distort === 'number') mat.distort = s.distort

      // la cage s'ouvre quand on défile vite et tourne en sens inverse
      s.cage = THREE.MathUtils.damp(s.cage, 1.55 + vel * 0.6, 5, d)
      if (cage.current) {
        cage.current.scale.setScalar(s.cage)
        cage.current.rotation.y = -s.spin * 1.6
        cage.current.rotation.x = -sc.progress * Math.PI
      }
    }
    // anneaux gyroscopiques : ils s'inclinent et s'écartent avec le scroll
    if (rings.current) {
      rings.current.scale.setScalar(keyScale)
      rings.current.children.forEach((ring, k) => {
        const dir = k % 2 === 0 ? 1 : -1
        ring.rotation.x = Math.PI / 2 + sc.progress * Math.PI * (k + 1) * dir * 0.8
        ring.rotation.y = reducedMotion ? k * 0.6 : t * 0.1 * (k + 1) * dir + k * 0.6
        const m = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial
        // plus visibles hors de l'allée de projets
        m.opacity = THREE.MathUtils.damp(m.opacity, (1 - sc.local.projects * 0.9) * (0.5 - k * 0.1), 4, d)
      })
    }

    const breathe = 1 + Math.sin(t * 0.5) * 0.03
    group.current.scale.setScalar(breathe * keyScale)
  })

  return (
    <group ref={root} position={KEYS[0].pos}>
      <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={0.3} floatIntensity={0.5}>
        <group ref={group}>
          <mesh ref={core}>
            <icosahedronGeometry args={[1.35, 12]} />
            <MeshDistortMaterial
              color={sceneColors.primary}
              emissive={sceneColors.accent}
              emissiveIntensity={sceneColors.isLight ? 0.15 : 0.35}
              roughness={0.15}
              metalness={0.9}
              distort={0.32}
              speed={1.6}
            />
          </mesh>

          <mesh ref={cage} scale={1.55}>
            <icosahedronGeometry args={[1.35, 2]} />
            <meshBasicMaterial
              color={sceneColors.isLight ? sceneColors.primary : sceneColors.light}
              wireframe
              transparent
              opacity={sceneColors.isLight ? 0.3 : 0.14}
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

      <group ref={rings}>
        {[2.55, 2.95, 3.4].map((r, k) => (
          <mesh key={r} rotation={[Math.PI / 2, k * 0.6, 0]}>
            <torusGeometry args={[r, 0.012 + k * 0.004, 8, 160]} />
            <meshBasicMaterial
              color={k === 1 ? sceneColors.light : sceneColors.accent}
              transparent
              opacity={0.4}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
