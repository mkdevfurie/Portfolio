import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'subtitle', title: 'Sous-titre', type: 'string' }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Un seul emoji, affiché en tête de carte.',
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'accent',
      title: 'Couleur d’accent (hex)',
      type: 'string',
      initialValue: '#185fa5',
      validation: (r) => r.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: 'hex' }),
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 10 }),
  ],
  orderings: [{ title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'subtitle' } },
})
