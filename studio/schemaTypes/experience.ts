import { defineField, defineType } from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Parcours',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Intitulé',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'organization', title: 'Organisation', type: 'string' }),
    defineField({
      name: 'period',
      title: 'Période',
      type: 'string',
      description: "Ex : « Décembre 2025 – aujourd'hui »",
      validation: (r) => r.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Expérience', value: 'work' },
          { title: 'Formation', value: 'education' },
        ],
        layout: 'radio',
      },
      initialValue: 'work',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 10 }),
  ],
  orderings: [{ title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'period' } },
})
