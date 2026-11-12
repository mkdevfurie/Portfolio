import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Témoignage',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nom', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Poste', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'company', title: 'Entreprise / projet', type: 'string' }),
    defineField({
      name: 'quote',
      title: 'Témoignage',
      type: 'text',
      rows: 4,
      validation: (r) => r.required().max(420),
    }),
    defineField({
      name: 'avatar',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 10 }),
  ],
  preview: { select: { title: 'name', subtitle: 'company', media: 'avatar' } },
})
