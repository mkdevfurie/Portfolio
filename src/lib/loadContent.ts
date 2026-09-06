import { client, sanityEnabled } from './sanity'
import { contentQuery } from './queries'
import { fallbackContent } from '@/content/fallback'
import type {
  ContentSource,
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
    cover: cleanImage(raw.cover),
    gallery: Array.isArray(raw.gallery)
      ? (raw.gallery as unknown[]).map(cleanImage).filter(Boolean) as ImageRef[]
      : undefined,
    liveUrl: raw.liveUrl ? String(raw.liveUrl) : undefined,
    repoUrl: raw.repoUrl ? String(raw.repoUrl) : undefined,
    featured: Boolean(raw.featured),
    order: typeof raw.order === 'number' ? raw.order : index + 1,
    bgColor: String(raw.bgColor ?? fb.bgColor),
    nameColor: String(raw.nameColor ?? fb.nameColor),
  }
}

function normaliseSkill(raw: Record<string, unknown>, index: number): Skill {
  return {
    _id: String(raw._id ?? `s-${index}`),
    name: String(raw.name ?? 'Compétence'),
    detail: String(raw.detail ?? ''),
    category: raw.category ? String(raw.category) : undefined,
    icon: cleanImage(raw.icon),
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
      projects: rawProjects.length
        ? (rawProjects as Record<string, unknown>[]).map(normaliseProject)
        : fallbackContent.projects,
      skills: rawSkills.length
        ? (rawSkills as Record<string, unknown>[]).map(normaliseSkill)
        : fallbackContent.skills,
      experience: Array.isArray(raw.experience) && raw.experience.length
        ? (raw.experience as PortfolioContent['experience'])
        : fallbackContent.experience,
      services: Array.isArray(raw.services) && raw.services.length
        ? (raw.services as PortfolioContent['services'])
        : fallbackContent.services,
    }

    return { content, source: 'sanity' }
  } catch (err) {
    console.warn('[portfolio] Sanity indisponible, contenu de repli utilisé.', err)
    return { content: fallbackContent, source: 'fallback' }
  }
}
