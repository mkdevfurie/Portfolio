import type { PortfolioContent, Project, SiteSettings } from '@/types/content'

/**
 * Traduction anglaise du contenu (repérée par slug / _id, local et Sanity).
 * Un élément absent d'ici reste en français (ex. contenu ajouté plus tard dans Sanity) :
 * pensez à ajouter sa traduction ici.
 */
type ProjectEN = Partial<Pick<Project, 'title' | 'subtitle' | 'description' | 'body' | 'role' | 'challenge' | 'results' | 'client'>>

const SETTINGS: Partial<SiteSettings> = {
  title: 'Web & mobile\ndeveloper',
  tagline: 'Available for new projects',
  bio1: 'With 4 years of experience, I build fast, reliable web and mobile applications with ReactJS, Flutter and NestJS.',
  bio2: 'I create robust business solutions with a clear approach focused on user experience.',
}

const SEO: Partial<SiteSettings['seo']> = {
  metaTitle: 'KPEMOUA David — Web & mobile developer',
  metaDescription:
    '3D portfolio of KPEMOUA David, web and mobile developer based in Lomé, Togo: ReactJS, Flutter, NestJS, PostgreSQL.',
}

const STAT_LABELS: Record<string, string> = {
  'Projets livrés': 'Projects shipped',
  Expérience: 'Experience',
  'Clients satisfaits': 'Happy clients',
  'Note moyenne': 'Average rating',
}
const STAT_VALUES: Record<string, string> = {
  '4 ans': '4 yrs',
}

const PROJECTS: Record<string, ProjectEN> = {
  'forum-2026': {
    title: 'Pan-African Leaders Forum 2026',
    subtitle: 'QR badges, registration and attendance control',
    description:
      'End-to-end system for the 8th Pan-African Leaders Forum (Lomé, Oct 26–30, 2026): public registration, QR badges and attendance scanning.',
    role: 'Full-stack & mobile developer',
    client: 'Pan-African Leaders Movement',
    body: [
      'Public registration page with a 3D scene and automatic badge generation (VIP, staff, international, role) with QR codes.',
      'Flutter app for staff: offline badge scanning followed by sync, so access control keeps working without a network.',
      'Organizer dashboard: real-time attendance tracking, registration management and exports. NestJS + Prisma API with personal-data encryption.',
    ],
  },
  'nova-vtc': {
    title: 'NOVA — ride-hailing platform',
    subtitle: 'Rider & driver apps + admin portal',
    description: 'Complete ride-hailing platform: rider app, driver app, API and admin portal.',
    role: 'Mobile & back-end developer',
    body: [
      'Two Flutter apps (rider and driver) with booking, real-time trip tracking and Firebase notifications.',
      'NestJS back-end and React admin portal to manage drivers, fares, trips and billing.',
    ],
  },
  taara: {
    title: 'Taara — AI fault diagnosis',
    subtitle: 'One photo, one diagnosis, a verified repairer',
    description:
      'Mobile app that identifies a fault from a photo using AI (Gemma), even offline, and connects users with verified repairers.',
    role: 'Mobile, AI & full-stack developer',
    body: [
      'Step-by-step guided diagnosis from a photo or description, working offline thanks to the on-device Gemma model.',
      'Matching with verified repairers near the user, a landing site with APK download and an admin dashboard.',
    ],
  },
  'sukuu-campus': {
    title: 'Sukuu Campus',
    subtitle: 'University life, from the first class to final deliberations',
    description: 'University platform: student app (Android & PWA) and web administration for LMD academic management.',
    role: 'Full-stack & mobile developer',
    body: [
      'LMD structure, timetables, QR-code attendance, grades, exam boards and deliberations.',
      'Flutter student app (Android and PWA) and a web interface for the registrar and management, on a shared API.',
    ],
  },
  koogwe: {
    title: 'KOOGWE — ride-hailing',
    subtitle: 'Ride-hailing platform for French Guiana',
    description: 'Ride-hailing app built with Flutter, NestJS and Neon PostgreSQL.',
    role: 'Mobile & back-end developer',
    body: [
      'Rider and driver mobile apps with geolocation, real-time tracking and built-in payments.',
      'React back-office and NestJS API to manage drivers, fares and trips, with a Dart package shared between the apps.',
    ],
  },
  'hotel-eda-oba': {
    title: 'Hôtel Eda-Oba',
    subtitle: 'Booking website with a 3D tour',
    description: 'Website for Hôtel Eda-Oba in Lomé: rooms, suites, restaurant, online booking and a 3D tour of the hotel.',
    role: 'Full-stack developer',
    body: [
      'Premium showcase site with an interactive 3D tour of the hotel, featuring rooms, the restaurant and seminar rooms.',
      'Online booking and an admin dashboard to manage availability and requests.',
    ],
  },
  atlas: {
    title: 'ATLAS — databases & AI',
    subtitle: 'AI-powered database analysis, audit and maintenance',
    description: 'Platform that analyses, audits and helps maintain databases with a dedicated AI service.',
    role: 'Full-stack & AI developer',
    body: [
      'Web interface to connect a database, run audits (structure, performance, security) and track recommendations.',
      'Three-part architecture: front-end, back-end API and a Python AI service.',
    ],
  },
  tracteurshare: {
    title: 'TracteurShare',
    subtitle: 'Farm equipment rental in Togo',
    description:
      'Peer-to-peer farm equipment rental platform, from urban fields to remote villages, with secure escrow payments.',
    role: 'Full-stack developer',
    body: [
      'Equipment catalogue, booking, secure escrow payments and matching between farmers and owners.',
      'Admin dashboard and dedicated API.',
    ],
  },
  peya: {
    title: 'PEYA — agricultural marketplace',
    subtitle: 'Customer & courier apps + admin',
    description: 'Premium agricultural marketplace: customer app, courier app, back-end and admin center.',
    role: 'Mobile & full-stack developer',
    body: [
      'Two Flutter apps (customer and courier) built from a complete 13-screen design system.',
      'Dedicated back-end and web admin center to manage products, orders and deliveries.',
    ],
  },
  mpl: {
    title: 'MPL — Pan-African Leaders Movement',
    subtitle: 'Institutional website + administration',
    description:
      'Website of the Pan-African Leaders Movement: federations, events, news, gallery and membership, with a back-office.',
    role: 'Full-stack developer',
    client: 'Pan-African Leaders Movement',
    body: [
      'Multilingual institutional site presenting the movement, its federations, committees and partners.',
      'Back-office to publish events and news and manage membership requests.',
    ],
  },
  sae: {
    title: 'Inventory management platform',
    subtitle: 'Stock management for a clothing store',
    description: 'Stock management for a clothing store, built with ReactJS and Node.js.',
    role: 'Full-stack developer',
    body: [
      'Internal app to track stock in and out, restocking alerts and sales.',
      'Real-time dashboard, multi-user management and accounting export.',
    ],
  },
  vitrinepro: {
    title: 'Showcase site + dashboard',
    subtitle: 'Showcase website with back-office',
    description: 'Company showcase website with a ReactTS, NestJS and Neon PostgreSQL back-office.',
    role: 'Full-stack developer',
    body: [
      'Fast, responsive showcase site with a custom back-office to manage content, quote requests and analytics.',
    ],
  },
}

const SERVICES: Record<string, { title?: string; subtitle?: string }> = {
  mobile: { title: 'Mobile development' },
  api: { title: 'APIs & back-end' },
  design: { title: 'UI/UX & design', subtitle: 'Figma · Prototyping · Design system' },
}

const EXPERIENCE: Record<string, { title?: string; organization?: string; period?: string; description?: string }> = {
  freelance: {
    title: 'Freelance web & mobile developer',
    period: 'December 2025 – present',
    description: 'Building web and mobile solutions with ReactJS, Flutter, NestJS and PostgreSQL.',
  },
  dclic: {
    title: 'Certificate of training in web & mobile development',
    organization: 'D-CLIC: Go digital with the OIF',
    period: 'January 2026 – March 2026',
    description:
      'Web and mobile development training from the D-CLIC programme of the International Organisation of La Francophonie, validated by a certificate.',
  },
}

const SKILLS: Record<string, string> = {
  'ReactJS / TS': 'Modern web applications',
  Angular: 'Structured web apps (TypeScript)',
  PostgreSQL: 'Relational databases',
  Flutter: 'Cross-platform mobile apps',
  NestJS: 'Modular back-end APIs',
  Figma: 'UI/UX design',
  'App Inventor': 'Rapid prototyping',
}

const POSTS: Record<string, { title?: string; excerpt?: string; body?: string[] }> = {
  'scan-qr-hors-ligne-flutter': {
    title: 'Scanning QR badges offline: lessons from the Leaders Forum',
    excerpt: 'How the staff Flutter app keeps controlling access when the network drops, then syncs.',
    body: [
      'At a large event, the mobile network saturates fast: hundreds of phones on the same cell tower. For access control at the Pan-African Leaders Forum, the staff app therefore could not depend on a connection.',
      '## The idea: verify locally, sync later',
      'Before doors open, each phone downloads the attendee list. A badge’s QR code holds a signed identifier: the app checks the signature and the attendee without calling the server.',
      'Every scan goes into a local queue. As soon as the network is back, the queue is sent to the NestJS API, which merges entries and ignores duplicates.',
      '## What I would do the same way again',
      'Design for offline from day one instead of bolting it on later. And clearly show the sync status to staff: a small “12 scans pending” counter reassures more than a long explanation.',
    ],
  },
  'portfolio-3d-rapide': {
    title: 'A 3D portfolio that stays fast: my technical choices',
    excerpt: 'React Three Fiber, deferred loading, dynamic themes: how this site keeps smooth 3D without sacrificing mobile.',
    body: [
      'This portfolio shows an Earth globe, a starfield and a camera that follows the scroll. The challenge: keep it smooth on an entry-level phone over 3G.',
      '## Text first, 3D second',
      'The HTML content shows up immediately; the 3D scene loads afterwards, then automatically lightens itself on small screens (fewer stars, capped resolution).',
      '## A single source of colors',
      'Themes rely on CSS variables that the 3D scene also reads: switching theme recolors the interface, the globe and even the tab icon.',
      '```',
      "root.style.setProperty('--c-accent', palette.accent)",
      '```',
      'The result: one palette to maintain, and five moods for the price of one.',
    ],
  },
}

/** Clé courte d'un document : « experience-dclic », « e-dclic » → « dclic ». */
const short = (id: string) => id.replace(/^(experience|service|sv|e|skill|s|project|p)-/, '')

export function localize(c: PortfolioContent): PortfolioContent {
  return {
    ...c,
    settings: {
      ...c.settings,
      ...SETTINGS,
      stats: c.settings.stats.map((s) => ({
        ...s,
        label: STAT_LABELS[s.label] ?? s.label,
        value: STAT_VALUES[s.value] ?? s.value,
      })),
      seo: { ...c.settings.seo, ...SEO },
    },
    projects: c.projects.map((p) => ({ ...p, ...PROJECTS[p.slug] })),
    services: c.services.map((s) => ({ ...s, ...SERVICES[short(s._id)] })),
    experience: c.experience.map((e) => ({ ...e, ...EXPERIENCE[short(e._id)] })),
    skills: c.skills.map((s) => ({ ...s, detail: SKILLS[s.name] ?? s.detail })),
    posts: c.posts.map((p) => ({ ...p, ...POSTS[p.slug] })),
  }
}
