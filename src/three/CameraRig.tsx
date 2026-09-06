import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CAMERA_PATH } from './config'
import { getScroll } from '@/lib/scroll'

const tmpPos = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()
const lookTarget = new THREE.Vector3(0, 0.2, 0)

interface Props {
  reducedMotion: boolean
}

/**
 * Déplace la caméra le long de CAMERA_PATH selon la progression du scroll,
 * avec une légère parallaxe à la souris.
 */
export function CameraRig({ reducedMotion }: Props) {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const smoothProgress = useRef(0)

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

    const target = getScroll().progress
    smoothProgress.current = THREE.MathUtils.damp(smoothProgress.current, target, 6, d)
    const p = THREE.MathUtils.clamp(smoothProgress.current, 0, 1)

    const seg = p * (CAMERA_PATH.length - 1)
    const i = Math.min(Math.floor(seg), CAMERA_PATH.length - 2)
    const f = THREE.MathUtils.smoothstep(seg - i, 0, 1)

    tmpPos.lerpVectors(CAMERA_PATH[i].pos, CAMERA_PATH[i + 1].pos, f)
    tmpTarget.lerpVectors(CAMERA_PATH[i].target, CAMERA_PATH[i + 1].target, f)

    if (!reducedMotion) {
      tmpPos.x += pointer.current.x * 0.6
      tmpPos.y += pointer.current.y * 0.4
    }

    const k = 1 - Math.exp(-7 * d)
    camera.position.lerp(tmpPos, k)
    lookTarget.lerp(tmpTarget, k)
    camera.lookAt(lookTarget)
  })

  return null
}
