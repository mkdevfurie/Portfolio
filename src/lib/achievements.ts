import { toast } from './toast'

/** Succès à débloquer en explorant le portfolio (sauvegardés dans le navigateur). */
export interface Achievement {
  id: string
  emoji: string
  title: string
  desc: string
  /** caché : description masquée tant que non débloqué */
  secret?: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'explorer', emoji: '🧭', title: 'Explorateur', desc: 'Parcourir le site jusqu’à la section Contact' },
  { id: 'curious', emoji: '🔍', title: 'Curieux', desc: 'Ouvrir 3 fiches projet' },
  { id: 'palette', emoji: '⌨️', title: 'Raccourci clavier', desc: 'Ouvrir la palette de commandes' },
  { id: 'terminal', emoji: '💻', title: 'Hacker', desc: 'Ouvrir le terminal' },
  { id: 'chameleon', emoji: '🎨', title: 'Caméléon', desc: 'Essayer les 5 thèmes' },
  { id: 'polyglot', emoji: '🌍', title: 'Polyglotte', desc: 'Passer le site dans l’autre langue' },
  { id: 'estimator', emoji: '🧮', title: 'Visionnaire', desc: 'Estimer un projet' },
  { id: 'reader', emoji: '📖', title: 'Lecteur', desc: 'Lire un article du blog' },
  { id: 'globetrotter', emoji: '📍', title: 'Globe-trotter', desc: 'Cliquer sur une épingle du globe' },
  { id: 'gamer', emoji: '🎮', title: 'Joueur', desc: 'Lancer un mini-jeu' },
  { id: 'memory', emoji: '🧠', title: 'Mémoire d’éléphant', desc: 'Gagner au Memory de la stack' },
  { id: 'catcher', emoji: '🧺', title: 'Attrape-tout', desc: 'Marquer 25 points à Stack Catch' },
  { id: 'quizmaster', emoji: '🏅', title: 'Expert tech', desc: 'Faire un sans-faute au quiz' },
  { id: 'snake', emoji: '🐍', title: 'Charmeur de serpent', desc: 'Atteindre 10 au Snake du terminal' },
  { id: 'guesser', emoji: '🎯', title: 'Devin', desc: 'Trouver le nombre en 7 essais ou moins' },
  { id: 'secret', emoji: '🕵️', title: 'Agent secret', desc: 'Trouver une commande cachée du terminal', secret: true },
  { id: 'konami', emoji: '🕹️', title: 'Old school', desc: 'Taper le code Konami', secret: true },
  { id: 'nightowl', emoji: '🦉', title: 'Oiseau de nuit', desc: 'Visiter le site entre minuit et 5 h', secret: true },
  { id: 'completionist', emoji: '👑', title: 'Complétionniste', desc: 'Débloquer tous les autres succès', secret: true },
]

const KEY = 'mkd-achievements'
const EVENT = 'achievements-change'

export function getUnlocked(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]') as string[])
  } catch {
    return new Set()
  }
}

function save(set: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]))
  } catch {
    /* stockage indisponible */
  }
}

/** Traduction optionnelle injectée par l'interface (évite une dépendance au contexte React). */
let translate: (s: string) => string = (s) => s
export function setAchievementTranslator(fn: (s: string) => string) {
  translate = fn
}

export function unlock(id: string) {
  const set = getUnlocked()
  if (set.has(id)) return
  const a = ACHIEVEMENTS.find((x) => x.id === id)
  if (!a) return
  set.add(id)
  save(set)
  toast(`🏆 ${translate('Succès débloqué')} : ${a.emoji} ${translate(a.title)}`)
  window.dispatchEvent(new Event(EVENT))
  const others = ACHIEVEMENTS.filter((x) => x.id !== 'completionist')
  if (others.every((x) => set.has(x.id))) window.setTimeout(() => unlock('completionist'), 1200)
}

export function onAchievements(cb: () => void) {
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}

/** Compteurs persistants (projets ouverts, thèmes essayés…). */
export function trackSet(key: string, value: string, target: number, achievement: string) {
  try {
    const k = `mkd-track-${key}`
    const set = new Set(JSON.parse(localStorage.getItem(k) || '[]') as string[])
    set.add(value)
    localStorage.setItem(k, JSON.stringify([...set]))
    if (set.size >= target) unlock(achievement)
  } catch {
    /* stockage indisponible */
  }
}
