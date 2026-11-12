import { useEffect, useMemo, useState } from 'react'
import { useSettings } from '@/content/hooks'
import { useI18n } from '@/i18n'
import { fetchGithub, LANG_COLORS, type GhData } from '@/lib/github'
import { Reveal } from './Reveal'

const WEEKS = 13

function ago(iso: string, lang: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  const rtf = new Intl.RelativeTimeFormat(lang === 'en' ? 'en' : 'fr', { numeric: 'auto' })
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), 'minute')
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour')
  if (diff < 86400 * 30) return rtf.format(-Math.round(diff / 86400), 'day')
  if (diff < 86400 * 365) return rtf.format(-Math.round(diff / 86400 / 30), 'month')
  return rtf.format(-Math.round(diff / 86400 / 365), 'year')
}

/** Activité GitHub en direct : chiffres, langages, dépôts récents, carte d'activité. */
export function GithubActivity() {
  const s = useSettings()
  const { t, lang } = useI18n()
  const user = s.githubUser || s.socials.github?.split('/').filter(Boolean).pop()
  const [data, setData] = useState<GhData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!user) return
    let alive = true
    fetchGithub(user)
      .then((d) => alive && setData(d))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [user])

  const langs = useMemo(() => {
    if (!data) return []
    const count: Record<string, number> = {}
    data.repos.forEach((r) => r.language && (count[r.language] = (count[r.language] ?? 0) + 1))
    const total = Object.values(count).reduce((a, b) => a + b, 0) || 1
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, n]) => ({ name, pct: (n / total) * 100 }))
  }, [data])

  const grid = useMemo(() => {
    const days: { date: string; n: number }[] = []
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - (WEEKS * 7 - 1) - today.getDay())
    for (let i = 0; i < WEEKS * 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      days.push({ date: key, n: data?.activity[key] ?? 0 })
    }
    return days
  }, [data])

  if (!user || error) return null

  const stars = data?.repos.reduce((a, r) => a + r.stargazers_count, 0) ?? 0
  const lastPush = data?.repos[0]?.pushed_at
  const contributions = grid.reduce((a, d) => a + d.n, 0)
  const level = (n: number) => (n === 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 8 ? 3 : 4)

  return (
    <Reveal className="gh">
      <div className="gh__head">
        <div className="gh__title">
          <span className="gh__live">
            <i /> {t('En direct')}
          </span>
          <h3>{t('Activité GitHub')}</h3>
        </div>
        <a className="gh__user" href={`https://github.com/${user}`} target="_blank" rel="noreferrer">
          {data && <img src={data.user.avatar_url} alt="" width={28} height={28} />}@{user} ↗
        </a>
      </div>

      <div className="gh__stats">
        <div>
          <strong>{data ? data.user.public_repos : '—'}</strong>
          <span>{t('dépôts publics')}</span>
        </div>
        <div>
          <strong>{data ? stars : '—'}</strong>
          <span>{t('étoiles')}</span>
        </div>
        <div>
          <strong>{data ? contributions : '—'}</strong>
          <span>{t('actions ({w} sem.)', { w: WEEKS })}</span>
        </div>
        <div>
          <strong>{lastPush ? ago(lastPush, lang) : '—'}</strong>
          <span>{t('dernier push')}</span>
        </div>
      </div>

      <div className="gh__body">
        <div className="gh__cal" aria-label={t('Carte d’activité des {w} dernières semaines', { w: WEEKS })}>
          {grid.map((d) => (
            <i key={d.date} data-l={level(d.n)} title={`${d.date} · ${d.n}`} />
          ))}
        </div>

        {langs.length > 0 && (
          <div className="gh__langs">
            <div className="gh__bar">
              {langs.map((l) => (
                <span key={l.name} style={{ width: `${l.pct}%`, background: LANG_COLORS[l.name] ?? 'var(--c-accent)' }} />
              ))}
            </div>
            <ul>
              {langs.map((l) => (
                <li key={l.name}>
                  <i style={{ background: LANG_COLORS[l.name] ?? 'var(--c-accent)' }} />
                  {l.name} <em>{Math.round(l.pct)}%</em>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data && data.repos.length > 0 && (
        <div className="gh__repos">
          {data.repos.slice(0, 3).map((r) => (
            <a key={r.name} className="gh__repo" href={r.html_url} target="_blank" rel="noreferrer">
              <strong>{r.name}</strong>
              <p>{r.description ?? t('Pas de description')}</p>
              <span>
                {r.language && (
                  <>
                    <i style={{ background: LANG_COLORS[r.language] ?? 'var(--c-accent)' }} /> {r.language} ·{' '}
                  </>
                )}
                ★ {r.stargazers_count} · {ago(r.pushed_at, lang)}
              </span>
            </a>
          ))}
        </div>
      )}
    </Reveal>
  )
}
