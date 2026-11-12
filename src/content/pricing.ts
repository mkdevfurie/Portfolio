/**
 * Grille de l'estimateur de projet — fourchettes INDICATIVES en FCFA.
 * ⚠️ À ajuster selon tes vrais tarifs : c'est le seul fichier à modifier.
 */
export interface ProjectType {
  id: string
  label: string
  emoji: string
  min: number
  max: number
  /** durée de base en semaines */
  weeks: [number, number]
}

export const PROJECT_TYPES: ProjectType[] = [
  { id: 'vitrine', label: 'Site vitrine', emoji: '🌐', min: 150_000, max: 400_000, weeks: [1, 3] },
  { id: 'ecommerce', label: 'Boutique en ligne', emoji: '🛒', min: 400_000, max: 1_200_000, weeks: [3, 6] },
  { id: 'webapp', label: 'Application web / SaaS', emoji: '🧩', min: 700_000, max: 2_500_000, weeks: [4, 10] },
  { id: 'mobile', label: 'Application mobile', emoji: '📱', min: 900_000, max: 3_000_000, weeks: [5, 12] },
  { id: 'api', label: 'API / back-end', emoji: '⚙️', min: 300_000, max: 1_200_000, weeks: [2, 6] },
]

export interface Feature {
  id: string
  label: string
  /** majoration en % du prix de base */
  pct: number
  weeks: number
}

export const FEATURES: Feature[] = [
  { id: 'auth', label: 'Comptes utilisateurs', pct: 10, weeks: 1 },
  { id: 'payment', label: 'Paiement (Mobile Money, carte)', pct: 15, weeks: 1 },
  { id: 'admin', label: "Tableau de bord d'administration", pct: 20, weeks: 2 },
  { id: 'i18n', label: 'Plusieurs langues', pct: 8, weeks: 0.5 },
  { id: 'offline', label: 'Fonctionne hors ligne', pct: 15, weeks: 1.5 },
  { id: 'ai', label: 'Intelligence artificielle', pct: 25, weeks: 2 },
  { id: 'notif', label: 'Notifications (push, SMS, email)', pct: 8, weeks: 0.5 },
  { id: 'map', label: 'Carte & géolocalisation', pct: 10, weeks: 1 },
]

export const DESIGN = [
  { id: 'have', label: "J'ai déjà les maquettes", pct: 0 },
  { id: 'need', label: 'Design à créer', pct: 15 },
]

export const TIMING = [
  { id: 'urgent', label: 'Urgent (moins d’un mois)', pct: 25 },
  { id: 'normal', label: 'Normal (1 à 3 mois)', pct: 0 },
  { id: 'flex', label: 'Flexible', pct: -5 },
]

/** Arrondit à 25 000 FCFA près. */
export const roundPrice = (n: number) => Math.round(n / 25_000) * 25_000
