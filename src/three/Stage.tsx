import { Environment, Grid, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { sceneColors } from './config'

interface Props {
  quality: { isMobile: boolean; reducedMotion: boolean }
}

/** Ambiance : brouillard, lumières, sol en grille, éclairage d'environnement. */
export function Stage({ quality }: Props) {
  return (
    <>
      <fogExp2 attach="fog" args={[sceneColors.bg.getHex(), 0.028]} />
      <color attach="background" args={[sceneColors.bg.getHex()]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.1}
        color={sceneColors.light}
      />
      <pointLight position={[-6, -2, -4]} intensity={30} color={sceneColors.primary} distance={24} />
      <pointLight position={[6, 3, 2]} intensity={22} color={sceneColors.accent} distance={22} />

      <Grid
        position={[0, -3.4, -6]}
        args={[60, 60]}
        cellSize={0.7}
        cellThickness={0.6}
        cellColor={sceneColors.mid.getStyle()}
        sectionSize={3.5}
        sectionThickness={1}
        sectionColor={sceneColors.accent.getStyle()}
        fadeDistance={quality.isMobile ? 26 : 42}
        fadeStrength={2}
        infiniteGrid
        followCamera={false}
      />

      <Environment resolution={quality.isMobile ? 64 : 160} frames={1}>
        <Lightformer
          intensity={2}
          position={[0, 3, -6]}
          scale={[10, 4, 1]}
          color={sceneColors.light.getStyle()}
        />
        <Lightformer
          intensity={1.4}
          position={[-5, 1, 2]}
          scale={[4, 6, 1]}
          color={sceneColors.accent.getStyle()}
        />
        <Lightformer
          intensity={1.1}
          form="ring"
          position={[4, 2, 3]}
          scale={3}
          color={sceneColors.primary.getStyle()}
        />
        <mesh scale={20}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color={sceneColors.dark.getStyle()} side={THREE.BackSide} />
        </mesh>
      </Environment>
    </>
  )
}
