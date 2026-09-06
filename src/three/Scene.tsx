import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useProjects, useSettings } from '@/content/hooks'
import { markSceneReady } from '@/lib/sceneReady'
import { useQuality } from './useQuality'
import { setSceneColors } from './config'
import { World } from './World'

/** Canvas 3D plein écran, fixe derrière le contenu (pointer-events: none). */
export function Scene() {
  const quality = useQuality()
  const settings = useSettings()
  const projects = useProjects()

  // synchronise la palette de la scène avec les réglages CMS
  useMemo(() => setSceneColors(settings.theme), [settings.theme])

  return (
    <Canvas
      className="scene-canvas"
      style={{ pointerEvents: 'none' }}
      dpr={quality.dpr}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0.4, 9], fov: 45, near: 0.1, far: 120 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        requestAnimationFrame(() => requestAnimationFrame(markSceneReady))
      }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <World projects={projects} quality={quality} />
      </Suspense>
    </Canvas>
  )
}
