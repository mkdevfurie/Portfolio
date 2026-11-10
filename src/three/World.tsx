import { Suspense } from 'react'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import type { Project } from '@/types/content'
import type { Quality } from './useQuality'
import { CameraRig } from './CameraRig'
import { Stage } from './Stage'
import { Starfield } from './Starfield'
import { Globe } from './Globe'
import { Monoliths } from './Monoliths'
import { Effects } from './Effects'
import { FloatingShapes } from './FloatingShapes'
import { sceneColors } from './config'

interface Props {
  projects: Project[]
  quality: Quality
}

export function World({ projects, quality }: Props) {
  return (
    <>
      <CameraRig reducedMotion={quality.reducedMotion} />
      <Stage quality={quality} />
      <Starfield count={quality.starCount} reducedMotion={quality.reducedMotion} />
      <Suspense fallback={null}>
        <Globe reducedMotion={quality.reducedMotion} />
      </Suspense>
      <FloatingShapes count={quality.isMobile ? 10 : 18} reducedMotion={quality.reducedMotion} />

      <Suspense fallback={null}>
        {projects.length > 0 && (
          <Monoliths projects={projects} reducedMotion={quality.reducedMotion} />
        )}
        <Preload all />
      </Suspense>

      {quality.postFx && !sceneColors.isLight && <Effects />}
      <AdaptiveDpr pixelated />
    </>
  )
}
