import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'
import '@/styles/ui.css'
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Application installable / hors ligne (production uniquement)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* pas de mode hors ligne : le site fonctionne normalement */
    })
  })
}

// Statistiques de visite respectueuses de la vie privée (Plausible), si configurées :
// VITE_PLAUSIBLE_DOMAIN=mon-site.netlify.app dans les variables d'environnement Netlify.
const plausible = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined
if (import.meta.env.PROD && plausible) {
  const sc = document.createElement('script')
  sc.defer = true
  sc.dataset.domain = plausible
  sc.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(sc)
}
