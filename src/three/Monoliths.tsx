import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { Project } from '@/types/content'
import { getScroll } from '@/lib/scroll'
import { MAX_MONOLITHS, MONOLITH_SPACING, sceneColors } from './config'
import { makeLabelTexture } from './makeLabelTexture'

const TRANSPARENT_PX =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

interface Props {
  projects: Project[]
  reducedMotion: boolean
}

function Monolith({
  project,
  texture,
  index,
  reducedMotion,
}: {
  project: Project
  texture: THREE.Texture
  index: number
  reducedMotion: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const reveal = useRef(0)
  const side = index % 2 === 0 ? -1 : 1
  const z = -3.2 - index * MONOLITH_SPACING
  const baseY = Math.sin(index) * 0.3
  const x = side * (1.9 + (index % 3) * 0.25)
  const rotY = -side * 0.32

  const label = useMemo(
    () => makeLabelTexture(project.shortName, project.nameColor || '#eaf3ff'),
    [project.shortName, project.nameColor],
  )
  const frameColor = useMemo(() => new THREE.Color(project.bgColor || '#0c447c'), [project.bgColor])
  const hasCover = Boolean(project.cover?.src)

  useFrame((state, delta) => {
    const g = group.current
    if (!g || reducedMotion) return
    const t = state.clock.elapsedTime
    // Apparition quand la caméra approche : le monolithe sort du sol,
    // pivote face à l'allée et grandit. Il replonge une fois dépassé.
    const dist = state.camera.position.z - z
    const goal =
      THREE.MathUtils.smoothstep(dist, 1.5, 9) * (1 - THREE.MathUtils.smoothstep(dist, 16, 24)) +
      (dist < 1.5 ? THREE.MathUtils.smoothstep(dist, -4, 1.5) : 0)
    // présents seulement autour de la section Projets
    const lp = getScroll().local.projects
    const presence = THREE.MathUtils.smoothstep(lp, 0.06, 0.22) * (1 - THREE.MathUtils.smoothstep(lp, 0.7, 0.86))
    reveal.current = THREE.MathUtils.damp(reveal.current, goal * presence, 3.5, Math.min(delta, 1 / 30))
    const r = reveal.current

    g.position.y = baseY + (1 - r) * -4.2
    g.rotation.y = rotY + (1 - r) * side * 1.4 + Math.sin(t * 0.4 + index) * 0.05
    g.rotation.z = (1 - r) * side * 0.25
    g.scale.setScalar(0.55 + 0.45 * r)
    g.visible = r > 0.02
  })

  return (
    <Float
      speed={reducedMotion ? 0 : 1.4}
      rotationIntensity={reducedMotion ? 0 : 0.25}
      floatIntensity={reducedMotion ? 0 : 0.7}
    >
      <group ref={group} position={[x, baseY, z]} rotation={[0, rotY, 0]}>
        {/* cadre */}
        <RoundedBox args={[2.5, 3.4, 0.16]} radius={0.09} smoothness={4}>
          <meshStandardMaterial
            color={frameColor}
            emissive={sceneColors.accent}
            emissiveIntensity={sceneColors.isLight ? 0.05 : 0.18}
            metalness={0.85}
            roughness={0.25}
          />
        </RoundedBox>

        {/* visuel du projet */}
        <mesh position={[0, 0.25, 0.11]}>
          <planeGeometry args={[2.16, 2.5]} />
          {hasCover ? (
            <meshBasicMaterial map={texture} toneMapped={false} />
          ) : (
            <meshStandardMaterial
              color={frameColor}
              emissive={frameColor}
              emissiveIntensity={0.4}
            />
          )}
        </mesh>

        {/* étiquette nom */}
        <mesh position={[0, -1.32, 0.12]}>
          <planeGeometry args={[2.2, 0.55]} />
          <meshBasicMaterial map={label} transparent depthWrite={false} toneMapped={false} />
        </mesh>

        {/* halo (un monolithe sur deux, pour limiter le nombre de lumières) */}
        {index % 2 === 0 && <pointLight
          position={[0, 0, 1.4]}
          color={sceneColors.accent}
          intensity={reducedMotion ? 3 : 6}
          distance={7}
        />}
      </group>
    </Float>
  )
}

/** Allée de monolithes, un par projet mis en avant. */
export function Monoliths({ projects, reducedMotion }: Props) {
  const list = useMemo(() => {
    const featured = projects.filter((p) => p.featured)
    return (featured.length ? featured : projects).slice(0, MAX_MONOLITHS)
  }, [projects])

  const urls = useMemo(
    () => list.map((p) => p.cover?.src || TRANSPARENT_PX),
    [list],
  )
  const textures = useTexture(urls)
  const texArray = Array.isArray(textures) ? textures : [textures]
  texArray.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace
  })

  return (
    <group>
      {list.map((project, i) => (
        <Monolith
          key={project._id}
          project={project}
          texture={texArray[i]}
          index={i}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  )
}
