import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identité', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'stats', title: 'Chiffres' },
    { name: 'theme', title: 'Couleurs' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'firstName', title: 'Prénom', type: 'string', group: 'identity' }),
    defineField({ name: 'lastName', title: 'Nom / pseudo', type: 'string', group: 'identity' }),
    defineField({
      name: 'initials',
      title: 'Initiales',
      type: 'string',
      group: 'identity',
      validation: (r) => r.max(3),
    }),
    defineField({
      name: 'title',
      title: 'Titre du hero',
      type: 'text',
      rows: 2,
      description: 'Un retour à la ligne = un saut de ligne visuel.',
      group: 'identity',
    }),
    defineField({ name: 'tagline', title: 'Badge de disponibilité', type: 'string', group: 'identity' }),
    defineField({ name: 'bio1', title: 'Bio — paragraphe 1', type: 'text', rows: 3, group: 'identity' }),
    defineField({ name: 'bio2', title: 'Bio — paragraphe 2', type: 'text', rows: 3, group: 'identity' }),
    defineField({
      name: 'cv',
      title: 'CV (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
      group: 'identity',
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp (format international, sans +)',
      type: 'string',
      group: 'contact',
      description: 'Ex : 22896558081',
    }),
    defineField({
      name: 'web3formsKey',
      title: 'Clé Web3Forms (formulaire de contact)',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'socials',
      title: 'Réseaux',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'github', title: 'GitHub', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter / X', type: 'url' }),
      ],
    }),
    defineField({ name: 'year', title: 'Année (copyright)', type: 'string', group: 'contact' }),

    defineField({
      name: 'stats',
      title: 'Chiffres clés',
      type: 'array',
      group: 'stats',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Valeur', type: 'string' }),
            defineField({ name: 'label', title: 'Libellé', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
      validation: (r) => r.max(4),
    }),

    defineField({
      name: 'theme',
      title: 'Palette (hex)',
      type: 'object',
      group: 'theme',
      description: 'Surcharge les couleurs du site et de la scène 3D.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'dark', title: 'Fond profond', type: 'string', initialValue: '#042c53' }),
        defineField({ name: 'darker', title: 'Fond très profond', type: 'string', initialValue: '#02192e' }),
        defineField({ name: 'mid', title: 'Bleu moyen', type: 'string', initialValue: '#0c447c' }),
        defineField({ name: 'primary', title: 'Bleu principal', type: 'string', initialValue: '#185fa5' }),
        defineField({ name: 'accent', title: 'Bleu accent', type: 'string', initialValue: '#378add' }),
        defineField({ name: 'light', title: 'Bleu clair', type: 'string', initialValue: '#85b7eb' }),
        defineField({ name: 'pale', title: 'Bleu pâle', type: 'string', initialValue: '#b5d4f4' }),
      ],
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({ name: 'metaTitle', title: 'Titre (balise <title>)', type: 'string' }),
        defineField({
          name: 'metaDescription',
          title: 'Description',
          type: 'text',
          rows: 2,
          validation: (r) => r.max(180),
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Réglages du site' }),
  },
})
