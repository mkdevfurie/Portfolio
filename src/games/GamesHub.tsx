import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Overlay, onPanel } from '@/components/Overlay'
import { useT } from '@/i18n'
import { ACHIEVEMENTS, getUnlocked, onAchievements, unlock } from '@/lib/achievements'

const Memory = lazy(() => import('./Memory').then((m) => ({ default: m.Memory })))
const Catch = lazy(() => import('./Catch').then((m) => ({ default: m.Catch })))
const Quiz = lazy(() => import('./Quiz').then((m) => ({ default: m.Quiz })))

type Tab = 'memory' | 'catch' | 'quiz' | 'achievements'

const TABS: { id: Tab; emoji: string; label: string; desc: string }[] = [
  { id: 'catch', emoji: '🧺', label: 'Stack Catch', desc: 'Attrapez les technos, évitez les bugs' },
  { id: 'memory', emoji: '🧠', label: 'Memory', desc: 'Retrouvez les paires de la stack' },
  { id: 'quiz', emoji: '❓', label: 'Quiz tech', desc: '8 questions, un sans-faute ?' },
  { id: 'achievements', emoji: '🏆', label: 'Succès', desc: 'Vos badges débloqués' },
]

/** Liste des succès (débloqués / à découvrir). */
export function AchievementsList() {
  const t = useT()
  const [got, setGot] = useState(getUnlocked)
  useEffect(() => onAchievements(() => setGot(getUnlocked())), [])
  const pct = Math.round((got.size / ACHIEVEMENTS.length) * 100)

  return (
    <div className="ach">
      <div className="ach__progress">
        <span>
          {t('{a} / {b} succès débloqués', { a: got.size, b: ACHIEVEMENTS.length })}
        </span>
        <div className="ach__bar">
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ul className="ach__grid">
        {ACHIEVEMENTS.map((a) => {
          const on = got.has(a.id)
          const hidden = a.secret && !on
          return (
            <li key={a.id} className={`ach__item ${on ? 'is-on' : ''}`}>
              <span className="ach__emoji">{hidden ? '❔' : a.emoji}</span>
              <span>
                <strong>{hidden ? t('Succès secret') : t(a.title)}</strong>
                <em>{hidden ? t('Continuez à explorer…') : t(a.desc)}</em>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Salle d'arcade : mini-jeux + succès. */
export function GamesHub() {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('catch')

  useEffect(
    () =>
      onPanel((id) => {
        if (id === 'games') setOpen(true)
        if (id === 'achievements') {
          setTab('achievements')
          setOpen(true)
        }
      }),
    [],
  )
  useEffect(() => {
    if (open && tab !== 'achievements') unlock('gamer')
  }, [open, tab])
  const close = useCallback(() => setOpen(false), [])

  return (
    <Overlay open={open} onClose={close} title={t('Arcade MKD')} width={760}>
      <div className="hub__tabs" role="tablist">
        {TABS.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={tab === g.id}
            className={`hub__tab ${tab === g.id ? 'is-on' : ''}`}
            onClick={() => setTab(g.id)}
          >
            <span className="hub__emoji">{g.emoji}</span>
            <span>
              <strong>{t(g.label)}</strong>
              <em>{t(g.desc)}</em>
            </span>
          </button>
        ))}
      </div>
      <Suspense fallback={<p className="hub__loading">…</p>}>
        {tab === 'memory' && <Memory />}
        {tab === 'catch' && <Catch />}
        {tab === 'quiz' && <Quiz />}
        {tab === 'achievements' && <AchievementsList />}
      </Suspense>
    </Overlay>
  )
}
