import { client, sanityEnabled } from './sanity'
import { contentQuery } from './queries'
import { fallbackContent } from '@/content/fallback'
import { stackLogo } from '@/content/stackLogos'
import type {
  ContentSource,
  GeoPoint,
  ImageRef,
  PortfolioContent,
  Project,
  Skill,
} from '@/types/content'

export interface LoadResult {
  content: PortfolioContent
  source: ContentSource
}

/** Nettoie une image brute venue de GROQ (peut etre partielle). */
function cleanImage(raw: unknown): ImageRef | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Record<string, unknown>
  if (typeof r.src !== 'string' || !r.src) return undefined
  return {
    src: r.src,
    alt: typeof r.alt === 'string' ? r.alt : '',
    aspect: typeof r.aspect === 'number' ? r.aspect : undefined,
    dominant: typeof r.dominant === 'string' ? r.dominant : undefined,
  }
}

const localOf = (raw: Record<string, unknown>) =>
  fallbackContent.projects.find((p) => p.slug === String(raw.slug ?? ''))

function cleanGeo(raw: unknown): GeoPoint | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Record<string, unknown>
  if (typeof r.lat !== 'number' || typeof r.lon !== 'number') return undefined
  return { label: String(r.label ?? ''), lat: r.lat, lon: r.lon }
}

/** Applique des valeurs par defaut a un projet Sanity potentiellement incomplet. */
function normaliseProject(raw: Record<string, unknown>, index: number): Project {
  const fb = fallbackContent.projects[index % fallbackContent.projects.length]
  return {
    _id: String(raw._id ?? `p-${index}`),
    title: String(raw.title ?? 'Projet'),
    slug: String(raw.slug ?? `projet-${index}`),
    shortName: String(raw.shortName ?? raw.title ?? 'Projet'),
    subtitle: String(raw.subtitle ?? ''),
    description: String(raw.description ?? ''),
    body: Array.isArray(raw.body) ? (raw.body as string[]) : undefined,
    status: (raw.status as Project['status']) ?? 'Livré',
    year: raw.year ? String(raw.year) : undefined,
    role: raw.role ? String(raw.role) : undefined,
    client: raw.client ? String(raw.client) : undefined,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    cover:
      cleanImage(raw.cover) ??
      fallbackContent.projects.find((p) => p.slug === String(raw.slug ?? ''))?.cover,
    gallery: Array.isArray(raw.gallery)
      ? (raw.gallery as unknown[]).map(cleanImage).filter(Boolean) as ImageRef[]
      : undefined,
    liveUrl: raw.liveUrl ? String(raw.liveUrl) : undefined,
    repoUrl: raw.repoUrl ? String(raw.repoUrl) : undefined,
    featured: Boolean(raw.featured),
    order: typeof raw.order === 'number' ? raw.order : index + 1,
    bgColor: String(raw.bgColor ?? fb.bgColor),
    nameColor: String(raw.nameColor ?? fb.nameColor),
    challenge: raw.challenge ? String(raw.challenge) : localOf(raw)?.challenge,
    results: Array.isArray(raw.results) ? (raw.results as string[]) : localOf(raw)?.results,
    location: cleanGeo(raw.location) ?? localOf(raw)?.location,
  }
}

/**
 * Projets du CMS + projets locaux pas encore saisis dans le CMS (comparaison par slug).
 * Les entrées du CMS restent prioritaires.
 */
function mergeProjects(fromCms: Project[]): Project[] {
  const slugs = new Set(fromCms.map((p) => p.slug))
  const missing = fallbackContent.projects.filter((p) => !slugs.has(p.slug))
  return [...fromCms, ...missing]
}

/** Entrées du CMS + entrées locales absentes du CMS (le CMS reste prioritaire). */
function mergeByKey<T>(fromCms: T[], local: T[], key: (item: T) => string): T[] {
  if (!fromCms.length) return local
  const keys = new Set(fromCms.map(key))
  return [...fromCms, ...local.filter((item) => !keys.has(key(item)))]
}

function normaliseSkill(raw: Record<string, unknown>, index: number): Skill {
  return {
    _id: String(raw._id ?? `s-${index}`),
    name: String(raw.name ?? 'Compétence'),
    detail: String(raw.detail ?? ''),
    category: raw.category ? String(raw.category) : undefined,
    icon: cleanImage(raw.icon) ?? stackLogo(String(raw.name ?? '')),
    order: typeof raw.order === 'number' ? raw.order : index + 1,
  }
}

/**
 * Charge le contenu du portfolio.
 * - Sanity configure + requete OK -> contenu Sanity (complete par les defauts).
 * - Sinon -> contenu de repli local.
 */
export async function loadContent(): Promise<LoadResult> {
  if (!sanityEnabled || !client) {
    return { content: fallbackContent, source: 'fallback' }
  }

  try {
    const raw = await client.fetch<Record<string, unknown>>(contentQuery)
    const rawProjects = Array.isArray(raw.projects) ? raw.projects : []
    const rawSkills = Array.isArray(raw.skills) ? raw.skills : []

    const content: PortfolioContent = {
      settings: {
        ...fallbackContent.settings,
        ...(raw.settings as object | null),
        socials: {
          ...fallbackContent.settings.socials,
          ...((raw.settings as Record<string, unknown> | null)?.socials as object | undefined),
        },
        theme: {
          ...fallbackContent.settings.theme,
          ...((raw.settings as Record<string, unknown> | null)?.theme as object | undefined),
        },
        stats:
          (raw.settings as Record<string, unknown> | null)?.stats instanceof Array
            ? ((raw.settings as Record<string, unknown>).stats as PortfolioContent['settings']['stats'])
            : fallbackContent.settings.stats,
        seo: {
          ...fallbackContent.settings.seo,
          ...((raw.settings as Record<string, unknown> | null)?.seo as object | undefined),
        },
      },
      projects: mergeProjects(
        (rawProjects as Record<string, unknown>[]).map(normaliseProject),
      ),
      skills: mergeByKey(
        (rawSkills as Record<string, unknown>[]).map(normaliseSkill),
        fallbackContent.skills,
        (s) => s.name.trim().toLowerCase(),
      ),
      experience: Array.isArray(raw.experience) && raw.experience.length
        ? (raw.experience as PortfolioContent['experience'])
        : fallbackContent.experience,
      services: Array.isArray(raw.services) && raw.services.length
        ? (raw.services as PortfolioContent['services'])
        : fallbackContent.services,
      testimonials: Array.isArray(raw.testimonials)
        ? (raw.testimonials as Record<string, unknown>[]).map((t, i) => ({
            _id: String(t._id ?? `t-${i}`),
            name: String(t.name ?? ''),
            role: String(t.role ?? ''),
            company: t.company ? String(t.company) : undefined,
            quote: String(t.quote ?? ''),
            avatar: cleanImage(t.avatar),
            order: typeof t.order === 'number' ? t.order : i + 1,
          })).filter((t) => t.name && t.quote)
        : fallbackContent.testimonials,
      posts: mergeByKey(
        Array.isArray(raw.posts)
          ? (raw.posts as Record<string, unknown>[]).map((p, i) => ({
              _id: String(p._id ?? `post-${i}`),
              title: String(p.title ?? ''),
              slug: String(p.slug ?? `article-${i}`),
              excerpt: String(p.excerpt ?? ''),
              date: String(p.date ?? ''),
              tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
              body: Array.isArray(p.body) ? (p.body as string[]) : [],
            }))
          : [],
        fallbackContent.posts,
        (p) => p.slug,
      ),
    }

    return { content, source: 'sanity' }
  } catch (err) {
    console.warn('[portfolio] Sanity indisponible, contenu de repli utilisé.', err)
    return { content: fallbackContent, source: 'fallback' }
  }
}
