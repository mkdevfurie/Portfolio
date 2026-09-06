# Portfolio 3D + CMS — Guide

Portfolio immersif : monde 3D scrollable (React Three Fiber) piloté par un CMS
(Sanity). Tu ajoutes une réalisation dans le CMS → elle apparaît sur le site et
dans la scène 3D, **sans toucher au code**.

---

## 1. Aperçu de l'architecture

```
Portfolio/
├── src/
│   ├── three/            # scène 3D : caméra, cristal, monolithes, post-fx
│   ├── sections/         # DOM par section (Hero, About, Projects, …)
│   ├── components/       # Nav, Loader, badges, Reveal…
│   ├── content/          # ContentProvider + fallback.ts (contenu local de secours)
│   ├── lib/              # sanity client, requêtes GROQ, scroll (Lenis)
│   ├── types/content.ts  # modèle de données (source de vérité côté front)
│   └── styles/           # global.css + ui.css
└── studio/               # Sanity Studio (CMS) — projet séparé
    └── schemaTypes/      # schémas : siteSettings, project, skill, experience, service
```

**Le site fonctionne sans CMS** : tant que `VITE_SANITY_PROJECT_ID` n'est pas
défini, il utilise `src/content/fallback.ts`. La pastille en bas à droite
indique la source active (`○ contenu local` / `● CMS Sanity`).

---

## 2. Lancer le site en local

```bash
npm install
npm run dev
```

→ http://localhost:5173

Autres commandes :

| Commande             | Rôle                                   |
| -------------------- | -------------------------------------- |
| `npm run build`      | build de production (`dist/`)          |
| `npm run preview`    | sert le build                          |
| `npm run typecheck`  | vérifie les types                      |
| `npm run lint`       | ESLint                                 |

---

## 3. Brancher le CMS Sanity

### 3.1 Créer le projet Sanity

1. Compte gratuit sur https://www.sanity.io/manage
2. **Create new project** → note le **Project ID**
3. Le dataset `production` est créé automatiquement.

### 3.2 Configurer le Studio (dossier `studio/`)

```bash
cd studio
npm install
cp .env.example .env.local
# renseigne SANITY_STUDIO_PROJECT_ID dans .env.local
npm run dev            # http://localhost:3333
```

Au premier lancement, Sanity demande de te connecter (navigateur).

### 3.3 Importer le contenu de départ (optionnel mais pratique)

Reprend le contenu actuel (textes, projets, compétences…) — **les images sont à
ré-uploader dans le Studio** (elles ne sont pas incluses dans l'import).

```bash
cd studio
npx sanity dataset import seed/portfolio-seed.ndjson production
```

### 3.4 Déployer le Studio en ligne

```bash
cd studio
npm run deploy        # -> https://<nom>.sanity.studio
```

Tu pourras alors éditer ton contenu depuis n'importe où (y compris mobile).

### 3.5 Connecter le site au CMS

À la racine du projet :

```bash
cp .env.example .env
```

```dotenv
VITE_SANITY_PROJECT_ID=xxxxxxxx      # ton Project ID
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-10-01
```

Relance `npm run dev`. La pastille passe à `● CMS Sanity`.

> Le contenu est lu **au chargement de la page** via le CDN Sanity : une
> modification publiée est visible sans redéploiement du site.

---

## 4. Ajouter / modifier une réalisation

Dans le Studio → **Projets** → *Créer* :

| Champ                | Effet                                                        |
| -------------------- | ----------------------------------------------------------- |
| Nom court            | texte sur le monolithe dans la scène 3D                     |
| Mis en avant         | le projet obtient un monolithe dans la scène (max 5)        |
| Ordre                | position dans la grille et dans l'allée 3D                  |
| Couleur du monolithe | teinte du bloc 3D + fond de la vignette                     |
| Visuel principal     | image de la vignette + texture du monolithe                 |

*Publier* → visible immédiatement sur le site.

Les sections **Compétences**, **Parcours**, **Services** et **Réglages du site**
(identité, contact, chiffres, palette de couleurs, SEO) se gèrent de la même
façon.

### Types TypeScript à jour (après un changement de schéma)

```bash
npm run sanity:typegen
```

---

## 5. Déploiement du site (Netlify)

`netlify.toml` est déjà configuré (`npm run build` → `dist/`).

1. Connecte le repo à Netlify.
2. Ajoute les variables d'environnement `VITE_SANITY_*` dans
   *Site settings → Environment variables*.
3. Déploie.

Chaque `git push` redéploie le site. Les changements de **contenu** ne
nécessitent pas de redéploiement.

---

## 6. Réglages 3D utiles

| Fichier                     | À ajuster                                             |
| --------------------------- | ---------------------------------------------------- |
| `src/three/config.ts`       | `CAMERA_PATH` : trajectoire caméra (1 clé/section)   |
| `src/three/Crystal.tsx`     | objet central (taille, position, matière)            |
| `src/three/Monoliths.tsx`   | disposition de l'allée de projets                    |
| `src/three/useQuality.ts`   | seuils mobile / post-traitement / nb de particules   |
| `src/three/Effects.tsx`     | bloom, vignette, aberration chromatique              |

La scène s'allège automatiquement sur mobile et respecte
`prefers-reduced-motion`.
