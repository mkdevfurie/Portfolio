/**
 * Contenu de repli — utilise tant que Sanity n'est pas connecte
 * (VITE_SANITY_PROJECT_ID absent) ou si la requete Sanity echoue.
 * Reprend les donnees de l'ancien portfolio mono-fichier.
 */
import type { PortfolioContent } from '@/types/content'

import projectStock from '@/assets/SAE.png'
import projectVTC from '@/assets/KOOGWE.png'
import projectShowcase from '@/assets/sitevitrine.png'
import logoReact from '@/assets/logo-react.svg'
import logoPostgres from '@/assets/logo-postgres.svg'
import logoFlutter from '@/assets/logo-flutter.svg'
import logoFigma from '@/assets/logo-figma.svg'
import logoAppInventor from '@/assets/logo-appinventor.svg'
import logoNestJS from '@/assets/logo-nestjs.svg'

export const fallbackContent: PortfolioContent = {
  settings: {
    firstName: 'KPEMOUA',
    lastName: 'David',
    initials: 'MK',
    title: 'Développeur web\n& mobile',
    tagline: 'Disponible pour de nouveaux projets',
    bio1: "Fort de 4 ans d'expérience, je conçois des applications web et mobiles performantes avec ReactJS, Flutter et NestJS.",
    bio2: "Je crée des solutions métiers robustes, avec une approche claire et axée sur l'expérience utilisateur.",
    email: 'mambizahkpemoua@gmail.com',
    whatsapp: '22896558081',
    web3formsKey: '35da6fc1-104a-463b-8305-db47886b934c',
    cvUrl: '',
    year: '2026',
    socials: {
      linkedin: 'https://linkedin.com/in/kpemoua',
      github: 'https://github.com/Mamfurie',
      twitter: 'https://twitter.com/kpemoua',
    },
    stats: [
      { value: '3+', label: 'Projets livrés' },
      { value: '4 ans', label: 'Expérience' },
      { value: '3', label: 'Clients satisfaits' },
      { value: '4.8/5', label: 'Note moyenne' },
    ],
    theme: {
      dark: '#042C53',
      darker: '#02192E',
      mid: '#0C447C',
      primary: '#185FA5',
      accent: '#378ADD',
      light: '#85B7EB',
      pale: '#B5D4F4',
    },
    seo: {
      metaTitle: 'KPEMOUA David — Développeur web & mobile',
      metaDescription:
        'Portfolio 3D de KPEMOUA David, développeur web et mobile : ReactJS, Flutter, NestJS, PostgreSQL.',
    },
  },

  projects: [
    {
      _id: 'p-sae',
      title: 'Plateforme de gestion de stock',
      slug: 'sae',
      shortName: 'SAE',
      subtitle: 'Gestion de stock pour boutique de vêtements',
      description:
        'Gestion de stock pour une boutique de vêtements avec ReactJS et Node.js.',
      body: [
        "Application interne permettant de suivre les entrées et sorties de stock, les alertes de réapprovisionnement et les ventes.",
        'Tableau de bord temps réel, gestion multi-utilisateurs et export comptable.',
      ],
      status: 'Livré',
      year: '2025',
      role: 'Développeur full-stack',
      tags: ['ReactJS', 'Node.js', 'PostgreSQL'],
      cover: { src: projectStock, alt: 'Capture de la plateforme SAE', dominant: '#0C447C' },
      featured: true,
      order: 1,
      bgColor: '#0C447C',
      nameColor: '#E6F1FB',
    },
    {
      _id: 'p-koogwe',
      title: 'Application de transport VTC',
      slug: 'koogwe',
      shortName: 'KOOGWE',
      subtitle: 'Réservation VTC mobile',
      description:
        'Application de transport VTC développée avec Flutter, NestJS et Neon PostgreSQL.',
      body: [
        'Application mobile de réservation de courses avec géolocalisation, suivi en temps réel et paiement intégré.',
        'Back-office NestJS pour la gestion des chauffeurs, des tarifs et des trajets.',
      ],
      status: 'Livré',
      year: '2025',
      role: 'Développeur mobile & back-end',
      tags: ['Flutter', 'NestJS', 'PostgreSQL'],
      cover: { src: projectVTC, alt: 'Écran de KOOGWE', dominant: '#185FA5' },
      featured: true,
      order: 2,
      bgColor: '#185FA5',
      nameColor: '#E6F1FB',
    },
    {
      _id: 'p-vitrinepro',
      title: 'Site vitrine + dashboard',
      slug: 'vitrinepro',
      shortName: 'VitrinePro',
      subtitle: 'Site vitrine avec back-office',
      description:
        'Site vitrine pour entreprise avec back-office ReactTS, NestJS et Neon PostgreSQL.',
      body: [
        'Site vitrine performant et responsive, avec un back-office sur mesure pour gérer le contenu, les demandes de devis et les statistiques.',
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur full-stack',
      tags: ['ReactTS', 'NestJS', 'PostgreSQL'],
      cover: { src: projectShowcase, alt: 'Aperçu du site vitrine', dominant: '#378ADD' },
      featured: false,
      order: 3,
      bgColor: '#378ADD',
      nameColor: '#FFFFFF',
    },
  ],

  skills: [
    { _id: 's-react', name: 'ReactJS / TS', detail: 'Applications web modernes', icon: { src: logoReact, alt: 'React' }, order: 1 },
    { _id: 's-postgres', name: 'PostgreSQL', detail: 'Bases de données relationnelles', icon: { src: logoPostgres, alt: 'PostgreSQL' }, order: 2 },
    { _id: 's-flutter', name: 'Flutter', detail: 'Applications mobiles multiplateformes', icon: { src: logoFlutter, alt: 'Flutter' }, order: 3 },
    { _id: 's-nestjs', name: 'NestJS', detail: 'API backend modulaires', icon: { src: logoNestJS, alt: 'NestJS' }, order: 4 },
    { _id: 's-figma', name: 'Figma', detail: 'Design UI/UX', icon: { src: logoFigma, alt: 'Figma' }, order: 5 },
    { _id: 's-appinventor', name: 'App Inventor', detail: 'Prototypage rapide', icon: { src: logoAppInventor, alt: 'App Inventor' }, order: 6 },
  ],

  experience: [
    {
      _id: 'e-freelance',
      title: 'Freelance développeur web & mobile',
      period: "Décembre 2025 – aujourd'hui",
      description:
        'Développement de solutions web et mobiles avec ReactJS, Flutter, NestJS et PostgreSQL.',
      type: 'work',
      order: 1,
    },
    {
      _id: 'e-dclic',
      title: 'Formation en développement mobile — DCLIC',
      period: 'Janvier 2026 – Mars 2026',
      description:
        "Formation intensive en développement mobile et architecture d'applications.",
      type: 'education',
      order: 2,
    },
  ],

  services: [
    { _id: 'sv-mobile', title: 'Développement mobile', subtitle: 'React Native · Flutter · iOS · Android', emoji: '📱', accent: '#185FA5', order: 1 },
    { _id: 'sv-api', title: 'APIs & back-end', subtitle: 'NestJS · Node.js · PostgreSQL · Firebase', emoji: '⚙️', accent: '#3B6D11', order: 2 },
    { _id: 'sv-design', title: 'UI/UX & design', subtitle: 'Figma · Prototypage · Design system', emoji: '🎨', accent: '#0F6E56', order: 3 },
  ],
}
