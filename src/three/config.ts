import * as THREE from 'three'

/** Identifiants + libellés des sections, dans l'ordre de scroll. */
export const SECTIONS = [
  { id: 'hero', label: 'Accueil' },
  { id: 'about', label: 'À propos' },
  { id: 'projects', label: 'Projets' },
  { id: 'skills', label: 'Compétences' },
  { id: 'journey', label: 'Parcours' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

/**
 * Trajectoire de la caméra : une image-clé par section.
 * `pos` = position de la caméra, `target` = point regardé.
 * Le RIG interpole entre ces images-clés selon la progression du scroll.
 */
export interface CamKey {
  pos: THREE.Vector3
  target: THREE.Vector3
}

export const CAMERA_PATH: CamKey[] = [
  // hero — le cristal flotte à droite du titre
  { pos: new THREE.Vector3(0, 0.3, 7), target: new THREE.Vector3(0, 0.25, 0) },
  // about — on glisse sur la droite, léger recul
  { pos: new THREE.Vector3(3.6, 0.9, 7.6), target: new THREE.Vector3(0.4, 0.2, 0) },
  // projects — on plonge dans l'allée de monolithes
  { pos: new THREE.Vector3(0.4, 0.1, 3.2), target: new THREE.Vector3(0.3, -0.1, -10) },
  // skills — on remonte au-dessus de la grille
  { pos: new THREE.Vector3(-4.4, 2.4, 7), target: new THREE.Vector3(0.2, 0.3, -1) },
  // journey — travelling latéral lent
  { pos: new THREE.Vector3(3.2, 0.5, 7.8), target: new THREE.Vector3(0.1, 0.2, -2) },
  // contact — recentrage, le cristal se rapproche
  { pos: new THREE.Vector3(0, 0.4, 5.6), target: new THREE.Vector3(0, 0.25, 0) },
]

/** Palette par défaut (surchargée par les réglages CMS via setSceneColors). */
export const sceneColors = {
  dark: new THREE.Color('#042c53'),
  mid: new THREE.Color('#0c447c'),
  primary: new THREE.Color('#185fa5'),
  accent: new THREE.Color('#378add'),
  light: new THREE.Color('#85b7eb'),
  bg: new THREE.Color('#030b18'),
}

export function setSceneColors(theme: {
  dark: string
  mid: string
  primary: string
  accent: string
  light: string
}) {
  sceneColors.dark.set(theme.dark)
  sceneColors.mid.set(theme.mid)
  sceneColors.primary.set(theme.primary)
  sceneColors.accent.set(theme.accent)
  sceneColors.light.set(theme.light)
}
