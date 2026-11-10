import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useProjects } from '@/content/hooks'
import { markSceneReady } from '@/lib/sceneReady'
import { useTheme } from '@/theme/ThemeProvider'
import { useQuality } from './useQuality'
import { setSceneColors } from './config'
import { World } from './World'

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Fond de secours (dégradé animé en CSS) quand WebGL est indisponible. */
function SceneFallback() {
  useEffect(() => markSceneReady(), [])
  return <div className="scene-canvas scene-fallback" aria-hidden />
}

/** Si la création du contexte WebGL échoue, on bascule sur le fond CSS au lieu de planter. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.warn('[portfolio] Scène 3D désactivée :', err)
  }
  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children
  }
}

/** Canvas 3D plein écran, fixe derrière le contenu (pointer-events: none). */
export function Scene() {
  const [webgl] = useState(hasWebGL)
  return (
    <SceneBoundary>{webgl ? <SceneCanvas /> : <SceneFallback />}</SceneBoundary>
  )
}

function SceneCanvas() {
  const quality = useQuality()
  const { theme } = useTheme()
  const projects = useProjects()

  // synchronise la palette de la scène avec le thème actif, avant le rendu de World
  const themeKey = useMemo(() => {
    setSceneColors(theme.palette, theme.ui.bg, theme.isLight)
    return `${theme.id}-${theme.palette.primary}-${theme.palette.accent}`
  }, [theme])

  return (
    <Canvas
      className="scene-canvas"
      // R3F impose `position: relative` en inline sur son conteneur : on force ici
      // le plein écran fixe, sinon la scène n'occupe que 150 px en haut de page.
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100lvh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
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
        {/* remonté à chaque changement de thème pour reprendre les nouvelles couleurs */}
        <World key={themeKey} projects={projects} quality={quality} />
      </Suspense>
    </Canvas>
  )
}
