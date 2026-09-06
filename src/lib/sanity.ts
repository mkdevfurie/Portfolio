import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID?.trim()
const dataset = import.meta.env.VITE_SANITY_DATASET?.trim() || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION?.trim() || '2024-10-01'

/** true si les variables d'environnement Sanity sont configurees. */
export const sanityEnabled = Boolean(projectId)

export const client: SanityClient | null = sanityEnabled
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null

const builder = client ? imageUrlBuilder(client) : null

/**
 * Construit une URL d'image Sanity optimisee.
 * Retourne '' si Sanity n'est pas configure ou la source est vide.
 */
export function urlFor(source: SanityImageSource | undefined | null) {
  if (!builder || !source) {
    return {
      width: () => ({ height: () => ({ url: () => '' }), url: () => '' }),
      url: () => '',
    }
  }
  return builder.image(source).auto('format').fit('max')
}
