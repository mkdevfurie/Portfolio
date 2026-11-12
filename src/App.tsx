import { lazy, Suspense, useEffect, useState } from 'react'
import { ContentProvider } from '@/content/ContentProvider'
import { useSettings } from '@/content/hooks'
import { initScroll, destroyScroll } from '@/lib/scroll'
import { Loader } from '@/components/Loader'
import { Nav } from '@/components/Nav'
import { SourcePill } from '@/components/SourcePill'
import { ScrollProgress } from '@/components/ScrollProgress'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { I18nProvider } from '@/i18n'
import { Cursor } from '@/components/Cursor'
import { CommandPalette } from '@/components/CommandPalette'
import { BackToTop } from '@/components/BackToTop'
import { Toaster } from '@/components/Toaster'
import { Terminal } from '@/components/Terminal'
import { Estimator } from '@/components/Estimator'
import { Booking } from '@/components/Booking'
import { RecruiterMode } from '@/components/RecruiterMode'
import { Arcade } from '@/components/Arcade'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Projects } from '@/sections/Projects'
import { Skills } from '@/sections/Skills'
import { Journey } from '@/sections/Journey'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'

// La scène 3D (three.js, ~1 Mo) est chargée après le premier affichage du texte.
const Scene = lazy(() => import('@/three/Scene').then((m) => ({ default: m.Scene })))

function DeferredScene() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const start = () => setReady(true)
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback
    const id = ric ? ric(start, { timeout: 1200 }) : window.setTimeout(start, 300)
    return () => {
      if (!ric) window.clearTimeout(id)
    }
  }, [])
  if (!ready) return <div className="scene-fallback" aria-hidden />
  return (
    <Suspense fallback={<div className="scene-fallback" aria-hidden />}>
      <Scene />
    </Suspense>
  )
}

/** Met à jour <title>/<meta> depuis les réglages CMS (les couleurs passent par ThemeProvider). */
function DocumentChrome() {
  const s = useSettings()
  useEffect(() => {
    document.title = s.seo.metaTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', s.seo.metaDescription)
  }, [s])
  return null
}

function Shell() {
  useEffect(() => {
    initScroll()
    return () => destroyScroll()
  }, [])

  return (
    <>
      <DocumentChrome />
      <Loader />
      <DeferredScene />
      <ScrollProgress />
      <Nav />

      <main className="scroll-dom">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Journey />
        <Contact />
        <Footer />
      </main>

      <BackToTop />
      <CommandPalette />
      <Terminal />
      <Estimator />
      <Booking />
      <RecruiterMode />
      <Arcade />
      <Toaster />
      <Cursor />
      {import.meta.env.DEV && <SourcePill />}
    </>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <ContentProvider>
        <ThemeProvider>
          <Shell />
        </ThemeProvider>
      </ContentProvider>
    </I18nProvider>
  )
}
