/** Meilleurs scores des mini-jeux (navigateur du visiteur). */
export function getBest(key: string): number | null {
  try {
    const v = Number(localStorage.getItem(`mkd-best-${key}`))
    return Number.isFinite(v) && v > 0 ? v : null
  } catch {
    return null
  }
}

/** Enregistre si meilleur ; `lower` = un score plus bas est meilleur (coups, temps). */
export function saveBest(key: string, score: number, lower = false): boolean {
  const best = getBest(key)
  const better = best === null || (lower ? score < best : score > best)
  if (better)
    try {
      localStorage.setItem(`mkd-best-${key}`, String(score))
    } catch {
      /* stockage indisponible */
    }
  return better
}
