import { useMemo, useRef, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Project } from '@/types/content'
import { sceneColors } from './config'
import { openProject } from '@/terminal/commands'
import { unlock } from '@/lib/achievements'
import { useT } from '@/i18n'

const LOME = { label: 'Lomé, Togo', lat: 6.13, lon: 1.22 }
const GOLDEN = Math.PI * (3 - Math.sqrt(5))

/** Même convention que le globe (mapping UV de SphereGeometry). */
function latLonToVec(lat: number, lon: number, r: number) {
  const phi = THREE.MathUtils.degToRad(lon + 180)
  const theta = THREE.MathUtils.degToRad(90 - lat)
  return new THREE.Vector3(
    -r * Math.cos(phi) * Math.sin(theta),
    r * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

interface Pin {
  project: Project
  pos: THREE.Vector3
  quat: THREE.Quaternion
}

const UP = new THREE.Vector3(0, 1, 0)
const tmpN = new THREE.Vector3()
const tmpC = new THREE.Vector3()

/**
 * Une épingle par projet sur le globe. Les projets d'un même lieu sont
 * répartis en spirale autour du point. Survol = nom du projet, clic = fiche.
 */
export function ProjectPins({ projects, radius }: { projects: Project[]; radius: number }) {
  const [hover, setHover] = useState<string | null>(null)
  const t = useT()
  const heads = useRef<(THREE.Mesh | null)[]>([])

  const pins = useMemo<Pin[]>(() => {
    const byPlace = new Map<string, number>()
    return projects.map((p) => {
      const loc = p.location ?? LOME
      const key = `${loc.lat.toFixed(2)},${loc.lon.toFixed(2)}`
      const k = byPlace.get(key) ?? 0
      byPlace.set(key, k + 1)
      // spirale de Fermat autour du lieu (≈ 2,2° d'écart)
      const r = k === 0 ? 0 : 2.2 * Math.sqrt(k)
      const a = k * GOLDEN
      const lat = loc.lat + r * Math.sin(a)
      const lon = loc.lon + r * Math.cos(a)
      const pos = latLonToVec(lat, lon, radius)
      const quat = new THREE.Quaternion().setFromUnitVectors(UP, pos.clone().normalize())
      return { project: p, pos, quat }
    })
  }, [projects, radius])

  // les têtes d'épingles pulsent doucement ; celle survolée grossit
  useFrame((state) => {
    const t = state.clock.elapsedTime
    heads.current.forEach((m, i) => {
      if (!m) return
      const target = pins[i]?.project.slug === hover ? 1.8 : 1 + Math.sin(t * 2 + i) * 0.12
      m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, target, 0.15))
    })
  })

  /** l'épingle fait-elle face à la caméra (et n'est-elle pas sous un élément de la page) ? */
  const usable = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    const target = e.nativeEvent.target as HTMLElement | null
    if (target?.closest?.('a, button, input, textarea, select, label, .pcard, .panel, .nav, [role="dialog"]')) return false
    e.object.getWorldPosition(tmpC)
    e.object.parent!.parent!.getWorldPosition(tmpN) // centre du globe
    tmpN.subVectors(tmpC, tmpN).normalize()
    tmpC.subVectors(e.camera.position, tmpC).normalize()
    return tmpN.dot(tmpC) > 0.15
  }

  return (
    <group>
      {pins.map((pin, i) => {
        const on = hover === pin.project.slug
        return (
          <group key={pin.project._id} position={pin.pos} quaternion={pin.quat}>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.12, 6]} />
              <meshBasicMaterial color={sceneColors.light} toneMapped={false} />
            </mesh>
            <mesh
              ref={(m) => {
                heads.current[i] = m
              }}
              position={[0, 0.13, 0]}
              onPointerOver={(e) => {
                if (!usable(e)) return
                e.stopPropagation()
                setHover(pin.project.slug)
                document.documentElement.classList.add('pin-hover')
              }}
              onPointerOut={() => {
                setHover((h) => (h === pin.project.slug ? null : h))
                document.documentElement.classList.remove('pin-hover')
              }}
              onClick={(e) => {
                if (!usable(e)) return
                e.stopPropagation()
                unlock('globetrotter')
                openProject(pin.project.slug)
              }}
            >
              <sphereGeometry args={[0.028, 14, 14]} />
              <meshBasicMaterial color={on ? '#ffffff' : sceneColors.accent} toneMapped={false} />
            </mesh>
            {/* zone de clic élargie, invisible */}
            {on && (
              <Html position={[0, 0.2, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
                <div className="pin-tip">
                  <strong>{pin.project.shortName}</strong>
                  <span>{t(pin.project.location?.label ?? LOME.label)}</span>
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}
