import { defineField, defineType } from 'sanity'

export const skill = defineType({
  name: 'skill',
  title: 'Compétence',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Détail',
      type: 'string',
      description: 'Courte phrase sous le nom.',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: ['Front-end', 'Back-end', 'Mobile', 'Base de données', 'Design', 'Outils'],
      },
    }),
    defineField({
      name: 'icon',
      title: 'Logo',
      type: 'image',
      options: { hotspot: false },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 10 }),
  ],
  orderings: [{ title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'detail', media: 'icon' } },
})
