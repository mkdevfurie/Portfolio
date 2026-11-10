import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ALLEY_DEPTH, CAMERA_PATH } from './config'
import { getScroll } from '@/lib/scroll'

const tmpPos = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()
const lookTarget = new THREE.Vector3(0, 0.2, 0)

interface Props {
  reducedMotion: boolean
}

/**
 * Caméra pilotée par le scroll :
 * - interpolation entre une image-clé par section (positions réelles des sections dans la page)
 * - travelling dans l'allée de monolithes pendant la section Projets (aller puis retour)
 * - léger roulis selon la vitesse de scroll + parallaxe souris
 */
export function CameraRig({ reducedMotion }: Props) {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const smooth = useRef({ section: 0, alley: 0, roll: 0 })

  useEffect(() => {
    if (reducedMotion) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  useFrame((_, delta) => {
    const d = Math.min(delta, 1 / 30)
    const sc = getScroll()
    const s = smooth.current

    s.section = THREE.MathUtils.damp(s.section, sc.section, 5, d)
    const last = CAMERA_PATH.length - 1
    const seg = THREE.MathUtils.clamp(s.section, 0, last)
    const i = Math.min(Math.floor(seg), last - 1)
    const f = THREE.MathUtils.smoothstep(seg - i, 0, 1)

    tmpPos.lerpVectors(CAMERA_PATH[i].pos, CAMERA_PATH[i + 1].pos, f)
    tmpTarget.lerpVectors(CAMERA_PATH[i].target, CAMERA_PATH[i + 1].target, f)

    // Travelling dans l'allée : 0 → 1 → 0 au fil de la section Projets.
    const alleyGoal = reducedMotion ? 0 : Math.sin(Math.PI * sc.local.projects)
    s.alley = THREE.MathUtils.damp(s.alley, alleyGoal, 4, d)
    const dz = -ALLEY_DEPTH * s.alley
    tmpPos.z += dz
    tmpTarget.z += dz
    // slalom doux entre les monolithes
    tmpPos.x += Math.sin(s.alley * Math.PI * 2) * 0.5 * s.alley

    if (!reducedMotion) {
      tmpPos.x += pointer.current.x * 0.6
      tmpPos.y += pointer.current.y * 0.4
    }

    const k = 1 - Math.exp(-7 * d)
    camera.position.lerp(tmpPos, k)
    lookTarget.lerp(tmpTarget, k)
    camera.lookAt(lookTarget)

    // roulis proportionnel à la vitesse du scroll
    const rollGoal = reducedMotion ? 0 : THREE.MathUtils.clamp(sc.velocity * 0.0016, -0.05, 0.05)
    s.roll = THREE.MathUtils.damp(s.roll, rollGoal, 5, d)
    camera.rotateZ(s.roll)
  })

  return null
}
