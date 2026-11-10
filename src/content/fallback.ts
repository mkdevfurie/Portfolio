/**
 * Contenu de repli — utilise tant que Sanity n'est pas connecte
 * (VITE_SANITY_PROJECT_ID absent) ou si la requete Sanity echoue.
 * Reprend les donnees de l'ancien portfolio mono-fichier.
 */
import type { PortfolioContent } from '@/types/content'

import projectStock from '@/assets/SAE.png'
import projectVTC from '@/assets/KOOGWE.png'
import projectShowcase from '@/assets/sitevitrine.png'
import coverForum from '@/assets/projects/forum.webp'
import coverNova from '@/assets/projects/nova.webp'
import coverTaara from '@/assets/projects/taara.webp'
import coverSukuu from '@/assets/projects/sukuu.webp'
import coverEdaoba from '@/assets/projects/edaoba.webp'
import coverAtlas from '@/assets/projects/atlas.webp'
import coverTracteur from '@/assets/projects/tracteur.webp'
import coverPeya from '@/assets/projects/peya.webp'
import coverMpl from '@/assets/projects/mpl.webp'
import logoReact from '@/assets/logo-react.svg'
import logoPostgres from '@/assets/logo-postgres.svg'
import logoFlutter from '@/assets/logo-flutter.svg'
import logoFigma from '@/assets/logo-figma.svg'
import logoAppInventor from '@/assets/logo-appinventor.svg'
import logoNestJS from '@/assets/logo-nestjs.svg'
import logoAngular from '@/assets/logo-angular.svg'

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
      { value: '12+', label: 'Projets livrés' },
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
      _id: 'p-forum',
      title: 'Forum Panafricain des Leaders 2026',
      slug: 'forum-2026',
      shortName: 'FORUM',
      subtitle: 'Badges QR, inscriptions et contrôle des présences',
      description:
        "Système complet pour le 8e Forum Panafricain des Leaders (Lomé, 26–30 oct. 2026) : inscription publique, badges QR et scan des présences.",
      body: [
        "Page d'inscription publique avec scène 3D, génération automatique des badges (VIP, staff, international, fonction) avec QR code.",
        'Application Flutter pour les agents : scan des badges hors ligne puis synchronisation, pour contrôler les accès même sans réseau.',
        "Dashboard organisateur : suivi des présences en temps réel, gestion des inscriptions et export. API NestJS + Prisma avec chiffrement des données personnelles.",
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur full-stack & mobile',
      client: 'Mouvement Panafricain des Leaders',
      tags: ['ReactTS', 'Flutter', 'NestJS', 'Prisma', 'PostgreSQL'],
      cover: { src: coverForum, alt: "Dashboard du Forum 2026 et badge organisateur", dominant: '#0F6E56' },
      liveUrl: 'https://forum-administration.vercel.app',
      featured: true,
      order: 1,
      bgColor: '#0B5E47',
      nameColor: '#E6FBF2',
    },
    {
      _id: 'p-nova',
      title: 'NOVA — plateforme VTC',
      slug: 'nova-vtc',
      shortName: 'NOVA',
      subtitle: 'Apps passager & chauffeur + portail d’administration',
      description:
        'Plateforme VTC complète : application passager, application chauffeur, API et portail administrateur.',
      body: [
        'Deux applications Flutter (passager et chauffeur) avec réservation, suivi de course en temps réel et notifications Firebase.',
        "Back-end NestJS et portail d'administration React pour gérer chauffeurs, tarifs, courses et facturation.",
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur mobile & back-end',
      tags: ['Flutter', 'NestJS', 'React', 'Firebase', 'PostgreSQL'],
      cover: { src: coverNova, alt: "Portail administrateur NOVA", dominant: '#1D7FD6' },
      liveUrl: 'https://nova-admin-rouge-alpha.vercel.app',
      featured: true,
      order: 2,
      bgColor: '#1B5FA8',
      nameColor: '#E6F1FB',
    },
    {
      _id: 'p-taara',
      title: 'Taara — diagnostic de pannes par IA',
      slug: 'taara',
      shortName: 'TAARA',
      subtitle: 'Une photo, un diagnostic, un réparateur vérifié',
      description:
        "Application mobile qui identifie une panne à partir d'une photo grâce à l'IA (Gemma), même hors ligne, et met en relation avec des réparateurs vérifiés.",
      body: [
        "Diagnostic guidé étape par étape à partir d'une photo ou d'une description, fonctionnant sans connexion grâce au modèle Gemma embarqué.",
        "Mise en relation avec des réparateurs vérifiés près de l'utilisateur, site vitrine avec téléchargement de l'APK et dashboard d'administration.",
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur mobile, IA & full-stack',
      tags: ['Flutter', 'Gemma (IA)', 'NestJS', 'ReactTS'],
      cover: { src: coverTaara, alt: "Site de présentation de Taara", dominant: '#C98A2B' },
      liveUrl: 'https://taara-site.vercel.app',
      featured: true,
      order: 3,
      bgColor: '#3A2A12',
      nameColor: '#FFE7B8',
    },
    {
      _id: 'p-sukuu',
      title: 'Sukuu Campus',
      slug: 'sukuu-campus',
      shortName: 'SUKUU',
      subtitle: 'La scolarité universitaire, du premier cours à la délibération',
      description:
        "Plateforme universitaire : application étudiant (Android & PWA) et administration web pour la scolarité LMD.",
      body: [
        'Structure LMD, emplois du temps, pointage des présences par QR code, notes, jurys et délibérations.',
        "Application étudiant Flutter (Android et PWA) et interface web pour le secrétariat et la direction, sur une API commune.",
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur full-stack & mobile',
      tags: ['Flutter', 'PWA', 'ReactTS', 'NestJS'],
      cover: { src: coverSukuu, alt: 'Accueil de Sukuu Campus', dominant: '#E0A325' },
      liveUrl: 'https://sukuu-admin-uni.vercel.app',
      featured: true,
      order: 4,
      bgColor: '#13234A',
      nameColor: '#FFD98A',
    },
    {
      _id: 'p-koogwe',
      title: 'KOOGWE — transport VTC',
      slug: 'koogwe',
      shortName: 'KOOGWE',
      subtitle: 'Plateforme VTC pour la Guyane',
      description:
        'Application de transport VTC développée avec Flutter, NestJS et Neon PostgreSQL.',
      body: [
        'Applications mobiles passager et chauffeur avec géolocalisation, suivi en temps réel et paiement intégré.',
        "Back-office React et API NestJS pour la gestion des chauffeurs, des tarifs et des trajets, avec un package Dart partagé entre les apps.",
      ],
      status: 'Livré',
      year: '2025',
      role: 'Développeur mobile & back-end',
      tags: ['Flutter', 'NestJS', 'React', 'PostgreSQL'],
      cover: { src: projectVTC, alt: 'Écran de KOOGWE', dominant: '#185FA5' },
      liveUrl: 'https://administration-koogwe.vercel.app',
      featured: true,
      order: 5,
      bgColor: '#185FA5',
      nameColor: '#E6F1FB',
    },
    {
      _id: 'p-edaoba',
      title: 'Hôtel Eda-Oba',
      slug: 'hotel-eda-oba',
      shortName: 'EDA-OBA',
      subtitle: 'Site de réservation avec visite 3D',
      description:
        "Site de l'hôtel Eda-Oba à Lomé : chambres, suites, restaurant, réservation en ligne et visite 3D de l'établissement.",
      body: [
        "Site vitrine haut de gamme avec visite 3D interactive de l'hôtel, présentation des chambres, du restaurant et des salles de séminaire.",
        "Réservation en ligne et dashboard d'administration pour gérer les disponibilités et les demandes.",
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur full-stack',
      client: 'Hôtel Eda-Oba, Lomé',
      tags: ['ReactTS', 'Three.js', 'NestJS', 'PostgreSQL'],
      cover: { src: coverEdaoba, alt: "Page d'accueil de l'hôtel Eda-Oba", dominant: '#1F3550' },
      liveUrl: 'https://edaobaweb.vercel.app',
      featured: true,
      order: 6,
      bgColor: '#1F3550',
      nameColor: '#F5E9D3',
    },
    {
      _id: 'p-atlas',
      title: 'ATLAS — bases de données & IA',
      slug: 'atlas',
      shortName: 'ATLAS',
      subtitle: 'Analyse, audit et maintenance de bases de données par l’IA',
      description:
        "Plateforme qui analyse, audite et aide à maintenir des bases de données grâce à un service d'IA dédié.",
      body: [
        "Interface web pour connecter une base, lancer des audits (structure, performances, sécurité) et suivre les recommandations.",
        'Architecture en trois briques : front-end, API back-end et service IA en Python.',
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur full-stack & IA',
      tags: ['React', 'NestJS', 'Python', 'IA'],
      cover: { src: coverAtlas, alt: 'Écran de connexion ATLAS', dominant: '#0AB7D6' },
      liveUrl: 'https://atlas-frontend-nine-murex.vercel.app',
      featured: true,
      order: 7,
      bgColor: '#071E33',
      nameColor: '#7FE6FF',
    },
    {
      _id: 'p-tracteur',
      title: 'TracteurShare',
      slug: 'tracteurshare',
      shortName: 'TRACTEUR',
      subtitle: "Location d'équipements agricoles au Togo",
      description:
        "Plateforme de location peer-to-peer d'équipements agricoles, des champs urbains aux villages isolés, avec paiement sécurisé par séquestre.",
      body: [
        "Catalogue d'équipements, réservation, paiement sécurisé par séquestre et mise en relation agriculteurs / propriétaires.",
        "Dashboard d'administration et API dédiée.",
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur full-stack',
      tags: ['ReactTS', 'NestJS', 'PostgreSQL'],
      cover: { src: coverTracteur, alt: "Page d'accueil TracteurShare", dominant: '#16A34A' },
      liveUrl: 'https://tracteur-share.vercel.app',
      featured: true,
      order: 8,
      bgColor: '#14532D',
      nameColor: '#DCFCE7',
    },
    {
      _id: 'p-peya',
      title: 'PEYA — marketplace agricole',
      slug: 'peya',
      shortName: 'PEYA',
      subtitle: 'Applications client & livreur + admin',
      description:
        'Marketplace agricole premium : application client, application livreur, back-end et centre d’administration.',
      body: [
        'Deux applications Flutter (client et livreur) issues d’un design system complet de 13 écrans.',
        "Back-end dédié et centre d'administration web pour gérer produits, commandes et livraisons.",
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur mobile & full-stack',
      tags: ['Flutter', 'NestJS', 'React'],
      cover: { src: coverPeya, alt: "Centre d'administration PEYA", dominant: '#B08D2E' },
      liveUrl: 'https://peya-admin-mobile.vercel.app',
      featured: false,
      order: 9,
      bgColor: '#2F3A1A',
      nameColor: '#F4E3A1',
    },
    {
      _id: 'p-mpl',
      title: 'MPL — Mouvement Panafricain des Leaders',
      slug: 'mpl',
      shortName: 'MPL',
      subtitle: 'Site institutionnel + administration',
      description:
        "Site du Mouvement Panafricain des Leaders : fédérations, événements, actualités, galerie et adhésion, avec back-office.",
      body: [
        'Site institutionnel multilingue présentant le mouvement, ses fédérations, commissions et partenaires.',
        "Back-office pour publier événements et actualités et gérer les demandes d'adhésion.",
      ],
      status: 'Livré',
      year: '2026',
      role: 'Développeur full-stack',
      client: 'Mouvement Panafricain des Leaders',
      tags: ['React', 'NestJS', 'PostgreSQL'],
      cover: { src: coverMpl, alt: "Page d'accueil du MPL", dominant: '#15803D' },
      liveUrl: 'https://mpl-site-psi.vercel.app',
      featured: false,
      order: 10,
      bgColor: '#166534',
      nameColor: '#FDE68A',
    },
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
      featured: false,
      order: 11,
      bgColor: '#0C447C',
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
      order: 12,
      bgColor: '#378ADD',
      nameColor: '#FFFFFF',
    },
  ],

  skills: [
    { _id: 's-react', name: 'ReactJS / TS', detail: 'Applications web modernes', icon: { src: logoReact, alt: 'React' }, order: 1 },
    { _id: 's-angular', name: 'Angular', detail: 'Applications web structurées (TypeScript)', icon: { src: logoAngular, alt: 'Angular' }, order: 2 },
    { _id: 's-postgres', name: 'PostgreSQL', detail: 'Bases de données relationnelles', icon: { src: logoPostgres, alt: 'PostgreSQL' }, order: 3 },
    { _id: 's-flutter', name: 'Flutter', detail: 'Applications mobiles multiplateformes', icon: { src: logoFlutter, alt: 'Flutter' }, order: 4 },
    { _id: 's-nestjs', name: 'NestJS', detail: 'API backend modulaires', icon: { src: logoNestJS, alt: 'NestJS' }, order: 5 },
    { _id: 's-figma', name: 'Figma', detail: 'Design UI/UX', icon: { src: logoFigma, alt: 'Figma' }, order: 6 },
    { _id: 's-appinventor', name: 'App Inventor', detail: 'Prototypage rapide', icon: { src: logoAppInventor, alt: 'App Inventor' }, order: 7 },
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
      title: 'Attestation de formation en développement web & mobile',
      organization: "D-CLIC : Formez-vous au numérique avec l'OIF",
      period: 'Janvier 2026 – Mars 2026',
      description:
        "Formation en développement web et mobile du programme D-CLIC de l'Organisation internationale de la Francophonie, validée par une attestation de formation.",
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
