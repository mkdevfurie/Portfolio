/**
 * Modele de contenu du portfolio.
 * Ces types sont la source de verite cote front. Ils correspondent
 * aux schemas Sanity definis dans studio/schemaTypes/*.
 * Le contenu vient de Sanity si VITE_SANITY_PROJECT_ID est defini,
 * sinon de src/content/fallback.ts (memes formes).
 */

export type ProjectStatus = 'Livré' | 'En cours' | 'Pause'

export interface ImageRef {
  /** URL prete a l'emploi (fallback) ou construite via urlFor() (Sanity). */
  src: string
  alt: string
  /** Ratio largeur/hauteur si connu, sert a reserver l'espace. */
  aspect?: number
  /** Couleur dominante pour les placeholders / halos 3D. */
  dominant?: string
}

export interface Project {
  _id: string
  title: string
  slug: string
  /** Nom court affiche sur la vignette 3D. */
  shortName: string
  subtitle: string
  description: string
  /** Paragraphes longs (optionnel). */
  body?: string[]
  status: ProjectStatus
  year?: string
  role?: string
  client?: string
  tags: string[]
  cover?: ImageRef
  gallery?: ImageRef[]
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  order: number
  /** Couleurs de la vignette / de l'ilot 3D. */
  bgColor: string
  nameColor: string
}

export interface Skill {
  _id: string
  name: string
  detail: string
  category?: string
  icon?: ImageRef
  order: number
}

export interface ExperienceEntry {
  _id: string
  title: string
  organization?: string
  period: string
  description: string
  type: 'work' | 'education'
  order: number
}

export interface Service {
  _id: string
  title: string
  subtitle: string
  emoji: string
  accent: string
  order: number
}

export interface Stat {
  value: string
  label: string
}

export interface SocialLinks {
  linkedin?: string
  github?: string
  twitter?: string
}

export interface SiteSettings {
  firstName: string
  lastName: string
  initials: string
  /** Titre du hero, "\n" autorise pour un retour a la ligne. */
  title: string
  tagline: string
  bio1: string
  bio2: string
  email: string
  /** Numero WhatsApp au format international sans "+". */
  whatsapp?: string
  /** Cle d'acces Web3Forms pour le formulaire de contact. */
  web3formsKey?: string
  cvUrl?: string
  year: string
  socials: SocialLinks
  stats: Stat[]
  /** Palette (hex). */
  theme: {
    dark: string
    darker: string
    mid: string
    primary: string
    accent: string
    light: string
    pale: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
  }
}

export interface PortfolioContent {
  settings: SiteSettings
  projects: Project[]
  skills: Skill[]
  experience: ExperienceEntry[]
  services: Service[]
}

export type ContentSource = 'sanity' | 'fallback'
