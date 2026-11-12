/* Sans dépendance à three.js : utilisable par l'interface sans charger la 3D. */

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
