import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'REPLACE_WITH_PROJECT_ID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

/** Documents uniques (singletons) : une seule fiche, pas de liste. */
const SINGLETONS = new Set(['siteSettings'])

export default defineConfig({
  name: 'portfolio',
  title: 'Portfolio — Contenu',
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Réglages du site')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('project').title('Projets'),
            S.documentTypeListItem('skill').title('Compétences'),
            S.documentTypeListItem('experience').title('Parcours'),
            S.documentTypeListItem('service').title('Services'),
          ]),
    }),
    visionTool({ defaultApiVersion: '2024-10-01' }),
  ],

  schema: {
    types: schemaTypes,
    // masque les singletons du menu "créer"
    templates: (templates) => templates.filter((t) => !SINGLETONS.has(t.schemaType)),
  },

  document: {
    // pas de "supprimer" / "dupliquer" pour les singletons
    actions: (input, context) =>
      SINGLETONS.has(context.schemaType)
        ? input.filter(({ action }) =>
            ['publish', 'discardChanges', 'restore'].includes(action || ''),
          )
        : input,
  },
})
