import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useI18n } from '@/i18n'
import { unlock } from '@/lib/achievements'
import { getBest, saveBest } from './storage'
import { EASE } from '@/lib/motion'

interface Q {
  q: string
  a: string[]
  ok: number
  /** version anglaise */
  en?: { q: string; a?: string[] }
}

const BANK: Q[] = [
  { q: 'Quel langage utilise Flutter ?', a: ['Kotlin', 'Dart', 'Swift', 'Go'], ok: 1, en: { q: 'Which language does Flutter use?' } },
  { q: 'Que signifie « API » ?', a: ['Application Programming Interface', 'Advanced Program Integration', 'Automatic Page Index', 'App Protocol Internet'], ok: 0, en: { q: 'What does “API” stand for?' } },
  { q: 'Quelle base de données est relationnelle ?', a: ['MongoDB', 'Redis', 'PostgreSQL', 'Firestore'], ok: 2, en: { q: 'Which database is relational?' } },
  { q: 'NestJS est un framework pour…', a: ['Node.js', 'Python', 'PHP', 'Java'], ok: 0, en: { q: 'NestJS is a framework for…' } },
  { q: 'Quel hook React gère un état local ?', a: ['useEffect', 'useState', 'useRef', 'useMemo'], ok: 1, en: { q: 'Which React hook manages local state?' } },
  { q: 'Le code HTTP 404 signifie…', a: ['Erreur serveur', 'Non autorisé', 'Ressource introuvable', 'Redirection'], ok: 2, en: { q: 'HTTP status 404 means…', a: ['Server error', 'Unauthorized', 'Not found', 'Redirect'] } },
  { q: 'Quelle commande Git envoie les commits vers le dépôt distant ?', a: ['git pull', 'git push', 'git fetch', 'git commit'], ok: 1, en: { q: 'Which Git command sends commits to the remote?' } },
  { q: 'TypeScript ajoute à JavaScript…', a: ['Des types statiques', 'Un moteur 3D', 'Une base de données', 'Un serveur web'], ok: 0, en: { q: 'TypeScript adds to JavaScript…', a: ['Static types', 'A 3D engine', 'A database', 'A web server'] } },
  { q: 'Quel outil sert surtout au design d’interfaces ?', a: ['Docker', 'Figma', 'Postman', 'Jest'], ok: 1, en: { q: 'Which tool is mainly for UI design?' } },
  { q: 'En CSS, quelle propriété crée une grille ?', a: ['display: grid', 'position: grid', 'float: grid', 'layout: grid'], ok: 0, en: { q: 'In CSS, which property creates a grid?' } },
  { q: 'Que fait « SELECT » en SQL ?', a: ['Supprime des lignes', 'Lit des données', 'Crée une table', 'Modifie des données'], ok: 1, en: { q: 'What does “SELECT” do in SQL?', a: ['Deletes rows', 'Reads data', 'Creates a table', 'Updates data'] } },
  { q: 'Une PWA peut…', a: ['S’installer et marcher hors ligne', 'Remplacer le système d’exploitation', 'Fonctionner sans navigateur', 'Compiler du C++'], ok: 0, en: { q: 'A PWA can…', a: ['Install and work offline', 'Replace the operating system', 'Run without a browser', 'Compile C++'] } },
  { q: 'Three.js sert à…', a: ['Faire de la 3D dans le navigateur', 'Gérer des paiements', 'Envoyer des emails', 'Tester une API'], ok: 0, en: { q: 'Three.js is used for…', a: ['3D in the browser', 'Handling payments', 'Sending emails', 'Testing an API'] } },
  { q: 'Le Mobile Money est très utilisé…', a: ['En Afrique de l’Ouest', 'Uniquement en Europe', 'Seulement pour les jeux', 'Pour héberger des sites'], ok: 0, en: { q: 'Mobile Money is widely used…', a: ['In West Africa', 'Only in Europe', 'Only for games', 'To host websites'] } },
  { q: 'JSON signifie…', a: ['Java Source Object Notation', 'JavaScript Object Notation', 'Joined Server Online Network', 'Just Simple Object Names'], ok: 1, en: { q: 'JSON stands for…' } },
  { q: 'Lequel est un framework mobile multiplateforme ?', a: ['Laravel', 'Django', 'Flutter', 'Express'], ok: 2, en: { q: 'Which is a cross-platform mobile framework?' } },
]

const COUNT = 8

/** Quiz tech : 8 questions tirées au hasard. */
export function Quiz() {
  const { t, lang } = useI18n()
  const [seed, setSeed] = useState(0)
  const questions = useMemo(() => {
    void seed
    return [...BANK].sort(() => Math.random() - 0.5).slice(0, COUNT)
  }, [seed])
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [record, setRecord] = useState(false)
  const done = i >= COUNT

  const q = questions[i]
  const text = q && lang === 'en' && q.en ? q.en.q : q?.q
  const answers = q && lang === 'en' && q.en?.a ? q.en.a : q?.a

  const pick = (k: number) => {
    if (picked !== null) return
    setPicked(k)
    const good = k === q.ok
    const nextScore = score + (good ? 1 : 0)
    if (good) setScore(nextScore)
    window.setTimeout(() => {
      setPicked(null)
      setI((v) => v + 1)
      if (i + 1 >= COUNT) {
        setRecord(saveBest('quiz', nextScore))
        if (nextScore === COUNT) unlock('quizmaster')
      }
    }, 900)
  }

  const restart = () => {
    setSeed((s) => s + 1)
    setI(0)
    setScore(0)
    setRecord(false)
  }

  const best = getBest('quiz')

  return (
    <div className="game">
      <div className="game__hud">
        <span>
          {t('Question')} <strong>{Math.min(i + 1, COUNT)}/{COUNT}</strong>
        </span>
        <span>
          {t('Score')} <strong>{score}</strong>
        </span>
        <span>
          {t('Record')} <strong>{best ?? '—'}</strong>
        </span>
        <button className="game__btn" onClick={restart}>
          ↻ {t('Rejouer')}
        </button>
      </div>

      <div className="quiz__bar">
        <span style={{ width: `${(Math.min(i, COUNT) / COUNT) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={i}
            className="quiz"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <h3>{text}</h3>
            <div className="quiz__answers">
              {answers!.map((a, k) => (
                <button
                  key={k}
                  className={`quiz__a ${picked !== null && k === q.ok ? 'is-ok' : ''} ${picked === k && k !== q.ok ? 'is-ko' : ''}`}
                  onClick={() => pick(k)}
                  disabled={picked !== null}
                >
                  <span>{String.fromCharCode(65 + k)}</span>
                  {a}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="end" className="quiz quiz--end" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <p className="quiz__score">
              {score}/{COUNT}
            </p>
            <p>
              {score === COUNT
                ? t('Sans-faute ! Vous parlez couramment le dev. 🏅')
                : score >= 5
                  ? t('Très bien joué ! 👏')
                  : t('Pas mal — retentez votre chance !')}
              {record && ` 🏆 ${t('Nouveau record !')}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
