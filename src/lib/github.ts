/** Données publiques GitHub (API REST sans jeton : 60 requêtes/h par visiteur → cache 30 min). */
export interface GhRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  fork: boolean
}

export interface GhData {
  user: { login: string; avatar_url: string; html_url: string; public_repos: number; followers: number; created_at: string }
  repos: GhRepo[]
  /** nombre d'événements publics par jour (AAAA-MM-JJ) sur ~90 jours */
  activity: Record<string, number>
  fetchedAt: number
}

const TTL = 30 * 60 * 1000

export async function fetchGithub(user: string): Promise<GhData> {
  const key = `gh-cache-${user}`
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || 'null') as GhData | null
    if (cached && Date.now() - cached.fetchedAt < TTL) return cached
  } catch {
    /* cache indisponible */
  }

  const api = (path: string) =>
    fetch(`https://api.github.com${path}`, { headers: { Accept: 'application/vnd.github+json' } }).then((r) => {
      if (!r.ok) throw new Error(`GitHub ${r.status}`)
      return r.json()
    })

  const [u, repos, events] = await Promise.all([
    api(`/users/${user}`),
    api(`/users/${user}/repos?per_page=100&sort=pushed`),
    api(`/users/${user}/events/public?per_page=100`).catch(() => []),
  ])

  const activity: Record<string, number> = {}
  for (const ev of events as { created_at: string; type: string; payload?: { size?: number } }[]) {
    const day = ev.created_at.slice(0, 10)
    activity[day] = (activity[day] ?? 0) + (ev.type === 'PushEvent' ? Math.max(1, ev.payload?.size ?? 1) : 1)
  }

  const data: GhData = {
    user: {
      login: u.login,
      avatar_url: u.avatar_url,
      html_url: u.html_url,
      public_repos: u.public_repos,
      followers: u.followers,
      created_at: u.created_at,
    },
    repos: (repos as GhRepo[]).filter((r) => !r.fork),
    activity,
    fetchedAt: Date.now(),
  }
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch {
    /* cache indisponible */
  }
  return data
}

/** Couleurs officielles (linguist) des langages les plus courants. */
export const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Dart: '#00b4ab',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Vue: '#41b883',
  Shell: '#89e051',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
}
