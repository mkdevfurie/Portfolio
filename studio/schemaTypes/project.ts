import { defineArrayMember, defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Nom court (vignette 3D)',
      type: 'string',
      description: 'Affiché sur le monolithe dans la scène. Ex : SAE, KOOGWE.',
      validation: (r) => r.required().max(14),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'subtitle', title: 'Sous-titre', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: 'body',
      title: 'Description longue',
      type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
      description: 'Un ou plusieurs paragraphes affichés dans la fiche détaillée.',
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: 'Livré', value: 'Livré' },
          { title: 'En cours', value: 'En cours' },
          { title: 'Pause', value: 'Pause' },
        ],
        layout: 'radio',
      },
      initialValue: 'Livré',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'year', title: 'Année', type: 'string' }),
    defineField({ name: 'role', title: 'Rôle', type: 'string' }),
    defineField({ name: 'client', title: 'Client', type: 'string' }),
    defineField({
      name: 'tags',
      title: 'Technologies',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'cover',
      title: 'Visuel principal',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
        }),
      ],
    }),
    defineField({ name: 'liveUrl', title: 'Lien en ligne', type: 'url' }),
    defineField({ name: 'repoUrl', title: 'Lien du code', type: 'url' }),
    defineField({
      name: 'featured',
      title: 'Mis en avant (apparaît dans la scène 3D)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'bgColor',
      title: 'Couleur du monolithe (hex)',
      type: 'string',
      initialValue: '#0c447c',
      validation: (r) => r.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: 'hex' }),
    }),
    defineField({
      name: 'nameColor',
      title: 'Couleur du nom sur le monolithe (hex)',
      type: 'string',
      initialValue: '#e6f1fb',
      validation: (r) => r.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: 'hex' }),
    }),
  ],
  orderings: [
    {
      title: 'Ordre manuel',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'cover' },
  },
})
