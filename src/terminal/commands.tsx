/* eslint-disable react-refresh/only-export-components -- module de commandes, pas un composant */
import type { ReactNode } from 'react'
import type { ExperienceEntry, Project, Service, SiteSettings, Skill } from '@/types/content'
import { THEMES, type ThemeId } from '@/theme/themes'
import { scrollToSection } from '@/lib/scroll'
import { copyText } from '@/lib/toast'
import { openPanel } from '@/components/Overlay'
import { unlock } from '@/lib/achievements'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface TermCtx {
  settings: SiteSettings
  projects: Project[]
  skills: Skill[]
  experience: ExperienceEntry[]
  services: Service[]
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
  history: string[]
  clear: () => void
  close: () => void
  matrix: () => void
  startGame: () => void
  startSnake: () => ReactNode
  posts: { slug: string; title: string }[]
  t: (fr: string, vars?: Record<string, string | number>) => string
}

export interface Command {
  name: string
  aliases?: string[]
  /** une ligne pour « aide » ; absent = commande cachée */
  help?: string
  usage?: string
  /** suggestions d'arguments pour l'auto-complétion */
  args?: (ctx: TermCtx) => string[]
  run: (args: string[], ctx: TermCtx) => ReactNode | void
}

/* ------------------------------------------------------------------ */
/* Petits composants de mise en forme                                  */
/* ------------------------------------------------------------------ */

export const Hl = ({ children }: { children: ReactNode }) => <span className="t-hl">{children}</span>
export const Dim = ({ children }: { children: ReactNode }) => <span className="t-dim">{children}</span>
export const Ok = ({ children }: { children: ReactNode }) => <span className="t-ok">{children}</span>
export const Err = ({ children }: { children: ReactNode }) => <span className="t-err">{children}</span>
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a className="t-link" href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
)

/** Bouton cliquable qui tape une commande à la place du visiteur. */
export const Cmd = ({ c }: { c: string }) => (
  <button type="button" className="t-cmd" data-cmd={c}>
    {c}
  </button>
)

const pad = (s: string, n: number) => (s.length >= n ? s + ' ' : s + ' '.repeat(n - s.length))

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/* ------------------------------------------------------------------ */
/* Données dérivées                                                    */
/* ------------------------------------------------------------------ */

/** « Dossiers » du terminal → sections du site. */
const DIRS: Record<string, string> = {
  accueil: 'hero',
  'a-propos': 'about',
  projets: 'projects',
  competences: 'skills',
  parcours: 'journey',
  contact: 'contact',
}
const DIR_ALIASES: Record<string, string> = {
  '~': 'hero',
  '/': 'hero',
  '..': 'hero',
  home: 'hero',
  hero: 'hero',
  about: 'about',
  apropos: 'about',
  projects: 'projects',
  skills: 'skills',
  stack: 'skills',
  journey: 'journey',
  experience: 'journey',
}

function resolveDir(raw?: string) {
  if (!raw) return 'hero'
  const k = norm(raw).replace(/\/$/, '')
  return DIRS[k] ?? DIR_ALIASES[k]
}

export const ASCII_LOGO = String.raw` __  __ _  ______
|  \/  | |/ /  _ \
| |\/| | ' /| | | |
| |  | | . \| |_| |
|_|  |_|_|\_\____/`

function findProject(q: string, projects: Project[]) {
  const n = Number(q)
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1]
  const k = norm(q)
  return (
    projects.find((p) => p.slug === k) ??
    projects.find((p) => norm(p.title).includes(k) || norm(p.shortName).includes(k))
  )
}

export function openProject(slug: string) {
  scrollToSection('projects')
  window.setTimeout(() => window.dispatchEvent(new CustomEvent('open-project', { detail: slug })), 700)
}

/* ------------------------------------------------------------------ */
/* Commandes                                                           */
/* ------------------------------------------------------------------ */

export const COMMANDS: Command[] = [
  {
    name: 'aide',
    aliases: ['help', '?', 'man'],
    help: 'liste des commandes',
    run: (_, { t }) => (
      <div className="t-help">
        {COMMANDS.filter((c) => c.help).map((c) => (
          <div key={c.name}>
            <Cmd c={c.name} />
            <span className="t-pad">{' '.repeat(Math.max(1, 13 - c.name.length))}</span>
            <Dim>{c.usage ? `${c.usage} — ` : ''}</Dim>
            {t(c.help!)}
          </div>
        ))}
        <div className="t-gap">
          <Dim>{t('Astuces : Tab complète, ↑ ↓ parcourent l’historique, Ctrl+L efface. Il y a aussi des commandes cachées…')}</Dim>
        </div>
      </div>
    ),
  },
  {
    name: 'whoami',
    aliases: ['moi'],
    help: 'qui suis-je ?',
    run: (_, { settings: s, t }) => (
      <>
        <div>
          <Hl>
            {s.firstName} {s.lastName}
          </Hl>{' '}
          — {s.title.replace(/\n/g, ' ')}
        </div>
        <div>{s.bio1}</div>
        <div className="t-gap">
          <Dim>{t('Pour en savoir plus :')} </Dim>
          <Cmd c="apropos" /> <Cmd c="projets" /> <Cmd c="neofetch" />
        </div>
      </>
    ),
  },
  {
    name: 'apropos',
    aliases: ['about', 'bio'],
    help: 'mon parcours en quelques lignes',
    run: (_, { settings: s }) => (
      <>
        <div>{s.bio1}</div>
        {s.bio2 && <div className="t-gap">{s.bio2}</div>}
      </>
    ),
  },
  {
    name: 'neofetch',
    aliases: ['fetch', 'info'],
    help: 'fiche système du développeur',
    run: (_, { settings: s, projects, skills, themeId }) => {
      const rows: [string, string][] = [
        ['OS', 'Développeur web & mobile'],
        ['Hôte', 'Lomé, Togo 🇹🇬'],
        ['Uptime', s.stats.find((x) => /exp/i.test(x.label))?.value ?? '—'],
        ['Projets', String(projects.length)],
        ['Stack', skills.slice(0, 5).map((k) => k.name).join(', ')],
        ['Thème', THEMES.find((t) => t.id === themeId)?.label ?? themeId],
        ['Shell', 'mkd-sh 1.0'],
        ['Contact', s.email],
      ]
      return (
        <div className="t-neofetch">
          <pre className="t-ascii">{ASCII_LOGO}</pre>
          <div>
            <div>
              <Hl>
                {s.firstName.toLowerCase()}@portfolio
              </Hl>
            </div>
            <div className="t-dim">{'-'.repeat(18)}</div>
            {rows.map(([k, v]) => (
              <div key={k}>
                <Hl>{k}</Hl>: {v}
              </div>
            ))}
            <div className="t-swatches">
              {['--c-darker', '--c-mid', '--c-primary', '--c-accent', '--c-light', '--c-pale'].map((v) => (
                <i key={v} style={{ background: `var(${v})` }} />
              ))}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    name: 'ls',
    aliases: ['dir'],
    help: 'contenu du portfolio',
    run: () => (
      <div className="t-ls">
        {Object.keys(DIRS).map((d) => (
          <Cmd key={d} c={`cd ${d}`} />
        ))}
        <Cmd c="cat bio.txt" />
        <Cmd c="cat README.md" />
      </div>
    ),
  },
  {
    name: 'cd',
    aliases: ['goto', 'aller'],
    help: 'aller à une section',
    usage: 'cd <section>',
    args: () => Object.keys(DIRS),
    run: ([d], ctx) => {
      const id = resolveDir(d)
      if (!id)
        return (
          <Err>
            cd: {d}: dossier introuvable. Essayez <Cmd c="ls" />
          </Err>
        )
      ctx.close()
      window.setTimeout(() => scrollToSection(id), 120)
      return <Ok>→ {d ?? '~'}</Ok>
    },
  },
  {
    name: 'cat',
    usage: 'cat <fichier>',
    help: 'lire un fichier',
    args: () => ['bio.txt', 'README.md'],
    run: ([f], ctx) => {
      if (f === 'bio.txt') return COMMANDS.find((c) => c.name === 'apropos')!.run([], ctx)
      if (f === 'README.md')
        return (
          <>
            <div>
              <Hl># Bienvenue 👋</Hl>
            </div>
            <div>Ce terminal est une autre façon de visiter mon portfolio.</div>
            <div>
              Commencez par <Cmd c="aide" />, ou testez votre chance avec <Cmd c="jeu" />.
            </div>
          </>
        )
      return <Err>cat: {f ?? ''}: fichier introuvable</Err>
    },
  },
  {
    name: 'projets',
    aliases: ['projects', 'p'],
    help: 'mes réalisations (filtre possible)',
    usage: 'projets [web|mobile|ia…]',
    args: () => ['web', 'mobile', 'ia'],
    run: ([q], { projects, t }) => {
      const list = projects
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => !q || norm(`${p.tags.join(' ')} ${p.title} ${p.subtitle}`).includes(norm(q)))
      if (!list.length) return <Err>Aucun projet ne correspond à « {q} ».</Err>
      const w = Math.max(...list.map(({ p }) => p.title.length)) + 2
      return (
        <>
          {list.map(({ p, i }) => (
            <div key={p._id} className="t-row">
              <Dim>{String(i + 1).padStart(2, '0')}</Dim>{' '}
              <button type="button" className="t-cmd" data-cmd={`ouvrir ${p.slug}`}>
                {p.title}
              </button>
              {' '.repeat(w - p.title.length)}
              <Dim>{p.tags.slice(0, 3).join(' · ')}</Dim>
            </div>
          ))}
          <div className="t-gap">
            <Dim>{t('Cliquez sur un projet ou tapez')} </Dim>
            <Hl>ouvrir {'<n°>'}</Hl>
          </div>
        </>
      )
    },
  },
  {
    name: 'ouvrir',
    aliases: ['open'],
    help: 'voir le détail d’un projet',
    usage: 'ouvrir <n°|nom>',
    args: (ctx) => ctx.projects.map((p) => p.slug),
    run: ([q], ctx) => {
      if (!q) return <Err>Usage : ouvrir {'<n°|nom>'} — voir <Cmd c="projets" /></Err>
      const p = findProject(q, ctx.projects)
      if (!p) return <Err>Projet « {q} » introuvable.</Err>
      ctx.close()
      openProject(p.slug)
      return <Ok>Ouverture de {p.title}…</Ok>
    },
  },
  {
    name: 'stack',
    aliases: ['skills', 'competences'],
    help: 'technologies maîtrisées',
    run: (_, { skills }) => (
      <>
        {skills.map((s) => (
          <div key={s._id}>
            <Ok>✔</Ok> <Hl>{pad(s.name, 16)}</Hl>
            <Dim>{s.detail}</Dim>
          </div>
        ))}
      </>
    ),
  },
  {
    name: 'parcours',
    aliases: ['experience', 'cv-text'],
    help: 'expérience & formation',
    run: (_, { experience }) => (
      <>
        {experience.map((e) => (
          <div key={e._id} className="t-gap">
            <div>
              <Dim>[{e.period}]</Dim> <Hl>{e.title}</Hl>
            </div>
            {e.organization && <div className="t-dim">  {e.organization}</div>}
          </div>
        ))}
      </>
    ),
  },
  {
    name: 'services',
    help: 'ce que je peux faire pour vous',
    run: (_, { services }) => (
      <>
        {services.map((s) => (
          <div key={s._id}>
            {s.emoji} <Hl>{s.title}</Hl> <Dim>— {s.subtitle}</Dim>
          </div>
        ))}
      </>
    ),
  },
  {
    name: 'contact',
    help: 'me joindre',
    run: (_, { settings: s }) => (
      <>
        <div>
          <Hl>email   </Hl> {s.email} <Cmd c="email" />
        </div>
        {s.whatsapp && (
          <div>
            <Hl>whatsapp</Hl> <Ext href={`https://wa.me/${s.whatsapp}`}>+{s.whatsapp}</Ext>
          </div>
        )}
        {s.socials.github && (
          <div>
            <Hl>github  </Hl> <Ext href={s.socials.github}>{s.socials.github.replace('https://', '')}</Ext>
          </div>
        )}
        {s.socials.linkedin && (
          <div>
            <Hl>linkedin</Hl> <Ext href={s.socials.linkedin}>{s.socials.linkedin.replace('https://', '')}</Ext>
          </div>
        )}
        <div className="t-gap">
          <Dim>Ou directement : </Dim>
          <Cmd c="cd contact" />
        </div>
      </>
    ),
  },
  {
    name: 'email',
    aliases: ['mail'],
    help: 'copier mon adresse email',
    run: (_, { settings: s }) => {
      void copyText(s.email, 'Email copié dans le presse-papiers')
      return <Ok>✔ {s.email} copié dans le presse-papiers</Ok>
    },
  },
  {
    name: 'cv',
    aliases: ['resume'],
    help: 'télécharger mon CV',
    run: (_, { settings: s }) => {
      if (!s.cvUrl) return <Dim>Le CV arrive bientôt — en attendant : <Cmd c="contact" /></Dim>
      window.open(s.cvUrl, '_blank', 'noopener')
      return <Ok>Ouverture du CV…</Ok>
    },
  },
  {
    name: 'theme',
    aliases: ['themes'],
    help: 'changer de thème',
    usage: 'theme [nom]',
    args: () => THEMES.map((t) => t.id),
    run: ([q], ctx) => {
      if (!q)
        return (
          <>
            {THEMES.map((t) => (
              <div key={t.id}>
                <span className="t-swatch" style={{ background: t.palette.accent }} />{' '}
                <button type="button" className="t-cmd" data-cmd={`theme ${t.id}`}>
                  {t.id}
                </button>
                {' '.repeat(10 - t.id.length)}
                <Dim>{t.label}</Dim>
                {t.id === ctx.themeId && <Ok> ← actif</Ok>}
              </div>
            ))}
          </>
        )
      const t = THEMES.find((x) => x.id === norm(q) || norm(x.label) === norm(q))
      if (!t) return <Err>Thème « {q} » inconnu. Tapez <Cmd c="theme" /></Err>
      ctx.setTheme(t.id)
      return <Ok>✔ Thème {t.label} appliqué</Ok>
    },
  },
  {
    name: 'lome',
    aliases: ['heure', 'date'],
    help: 'heure locale à Lomé',
    run: () => {
      const f = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Lome',
      }).format(new Date())
      return (
        <>
          🇹🇬 Lomé : <Hl>{f}</Hl>
        </>
      )
    },
  },
  {
    name: 'jeu',
    aliases: ['game', 'play', 'jouer'],
    help: 'devinez le nombre (record sauvegardé)',
    run: (_, ctx) => ctx.startGame(),
  },
  {
    name: 'snake',
    aliases: ['serpent'],
    help: 'le Snake, version terminal',
    run: (_, ctx) => ctx.startSnake(),
  },
  {
    name: 'arcade',
    aliases: ['jeux', 'games'],
    help: 'Stack Catch, Memory, Quiz…',
    run: (_, ctx) => {
      ctx.close()
      openPanel('games')
      return <Ok>Ouverture de l’arcade 🎮</Ok>
    },
  },
  {
    name: 'succes',
    aliases: ['achievements', 'badges', 'trophees'],
    help: 'mes succès débloqués',
    run: (_, ctx) => {
      ctx.close()
      openPanel('achievements')
      return <Ok>🏆</Ok>
    },
  },
  {
    name: 'devis',
    aliases: ['estimer', 'prix', 'budget'],
    help: 'estimer le prix de votre projet',
    run: (_, ctx) => {
      ctx.close()
      openPanel('estimator')
      return <Ok>Ouverture de l’estimateur 🧮</Ok>
    },
  },
  {
    name: 'rdv',
    aliases: ['appel', 'call', 'booking'],
    help: 'réserver un appel',
    run: (_, ctx) => {
      ctx.close()
      openPanel('booking')
      return <Ok>📅</Ok>
    },
  },
  {
    name: 'recruteur',
    aliases: ['recruiter', 'resume-print'],
    help: 'mon CV en une page (imprimable)',
    run: (_, ctx) => {
      ctx.close()
      openPanel('recruiter')
      return <Ok>📄</Ok>
    },
  },
  {
    name: 'blog',
    aliases: ['articles'],
    help: 'mes derniers articles',
    run: (_, ctx) => {
      const posts = ctx.posts
      if (!posts.length) return <Dim>Aucun article pour le moment.</Dim>
      return (
        <>
          {posts.map((p) => (
            <div key={p.slug}>
              <Dim>›</Dim>{' '}
              <button type="button" className="t-cmd" data-cmd={`lire ${p.slug}`}>
                {p.title}
              </button>
            </div>
          ))}
        </>
      )
    },
  },
  {
    name: 'lire',
    aliases: ['read'],
    usage: 'lire <article>',
    args: (ctx) => ctx.posts.map((p) => p.slug),
    run: ([slug], ctx) => {
      if (!slug) return <Err>Usage : lire {'<article>'} — voir <Cmd c="blog" /></Err>
      ctx.close()
      openPanel(`post:${slug}`)
      return <Ok>📖</Ok>
    },
  },
  {
    name: 'historique',
    aliases: ['history'],
    help: 'commandes déjà tapées',
    run: (_, { history }) =>
      history.length ? (
        <>
          {history.map((h, i) => (
            <div key={i}>
              <Dim>{String(i + 1).padStart(3, ' ')}</Dim> {h}
            </div>
          ))}
        </>
      ) : (
        <Dim>Historique vide.</Dim>
      ),
  },
  {
    name: 'echo',
    usage: 'echo <texte>',
    run: (args) => args.join(' '),
  },
  {
    name: 'clear',
    aliases: ['cls', 'effacer'],
    help: 'effacer l’écran',
    run: (_, ctx) => ctx.clear(),
  },
  {
    name: 'exit',
    aliases: ['quit', 'quitter', 'q'],
    help: 'fermer le terminal',
    run: (_, ctx) => ctx.close(),
  },

  /* ---------- commandes cachées ---------- */
  {
    name: 'sudo',
    run: (args, { settings: s }) =>
      norm(args.join(' ')).includes('embauche') || norm(args.join(' ')).includes('hire') ? (
        <Ok>
          [sudo] accès accordé. Excellente décision 😄 — écrivez-moi : {s.email}
        </Ok>
      ) : (
        <Err>{s.firstName.toLowerCase()} n’est pas dans le fichier sudoers. Cet incident sera signalé. 🚨</Err>
      ),
  },
  {
    name: 'embaucher',
    aliases: ['hire'],
    run: (_, ctx) => {
      ctx.close()
      window.setTimeout(() => scrollToSection('contact'), 120)
      return <Ok>Excellent choix. Direction le formulaire de contact 🚀</Ok>
    },
  },
  {
    name: 'rm',
    run: (args) =>
      args.join(' ').includes('-rf') ? (
        <Err>Bien essayé 😏 Ce portfolio est protégé par 12 projets et beaucoup de café.</Err>
      ) : (
        <Err>rm : opération non permise</Err>
      ),
  },
  {
    name: 'cafe',
    aliases: ['coffee', 'café'],
    run: () => (
      <pre className="t-ascii">{String.raw`    ( (
     ) )
  ........
  |      |]   Café servi ☕
  \      /    Le carburant de 12+ projets.
   '----'`}</pre>
    ),
  },
  {
    name: 'matrix',
    run: (_, ctx) => {
      ctx.matrix()
      return <Ok>Réveille-toi, Néo…</Ok>
    },
  },
  {
    name: 'blague',
    aliases: ['joke'],
    run: () => {
      const jokes = [
        'Pourquoi les devs confondent Halloween et Noël ? Parce que OCT 31 = DEC 25.',
        'Il y a 10 types de personnes : celles qui comprennent le binaire et les autres.',
        '« Ça marche sur ma machine. » — Alors on livre ta machine.',
        'Un SQL entre dans un bar, va vers deux tables et demande : « Je peux vous JOIN ? »',
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    },
  },
  {
    name: 'mkd',
    run: () => <pre className="t-ascii">{ASCII_LOGO}</pre>,
  },
]

// les commandes sans aide (cachées) débloquent le succès « Agent secret »
COMMANDS.forEach((c) => {
  if (c.help || ['echo', 'lire'].includes(c.name)) return
  const run = c.run
  c.run = (args, ctx) => {
    unlock('secret')
    return run(args, ctx)
  }
})

const INDEX = new Map<string, Command>()
COMMANDS.forEach((c) => {
  INDEX.set(c.name, c)
  c.aliases?.forEach((a) => INDEX.set(a, c))
})

export function findCommand(name: string) {
  return INDEX.get(norm(name)) ?? INDEX.get(name)
}

/** Commandes visibles, pour l'auto-complétion. */
export const PUBLIC_NAMES = COMMANDS.filter((c) => c.help).map((c) => c.name)

/** Complète la saisie : renvoie la nouvelle saisie et les candidats. */
export function complete(input: string, ctx: TermCtx): { value: string; options: string[] } {
  const parts = input.split(/\s+/)
  if (parts.length <= 1) {
    const opts = PUBLIC_NAMES.filter((n) => n.startsWith(norm(parts[0] ?? '')))
    if (opts.length === 1) return { value: opts[0] + ' ', options: [] }
    return { value: commonPrefix(opts) || input, options: opts }
  }
  const cmd = findCommand(parts[0])
  const pool = cmd?.args?.(ctx) ?? []
  const last = norm(parts[parts.length - 1])
  const opts = pool.filter((a) => a.startsWith(last))
  const head = parts.slice(0, -1).join(' ')
  if (opts.length === 1) return { value: `${head} ${opts[0]}`, options: [] }
  const cp = commonPrefix(opts)
  return { value: cp ? `${head} ${cp}` : input, options: opts }
}

function commonPrefix(list: string[]) {
  if (!list.length) return ''
  let p = list[0]
  for (const s of list) while (!s.startsWith(p)) p = p.slice(0, -1)
  return p
}
