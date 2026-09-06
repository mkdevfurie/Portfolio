# Portfolio — KPEMOUA David

Portfolio 3D immersif, piloté par un CMS.

- **Front** : React 19 + TypeScript + Vite
- **3D** : React Three Fiber / three.js / postprocessing — monde scrollable,
  caméra animée par section, cristal central, allée de monolithes de projets
- **Animations** : Motion (Framer Motion) + Lenis (smooth scroll)
- **CMS** : Sanity (`studio/`) — projets, compétences, parcours, services,
  réglages ; contenu de repli local si le CMS n'est pas branché
- **Contact** : Web3Forms + lien WhatsApp
- **Déploiement** : Netlify

## Démarrage rapide

```bash
npm install
npm run dev
```

Le site tourne immédiatement avec le contenu de `src/content/fallback.ts`.

👉 **Configuration complète (CMS, ajout de projets, déploiement) : voir
[`SETUP.md`](./SETUP.md).**
