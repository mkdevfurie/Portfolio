import { useEffect } from 'react'
import { ContentProvider } from '@/content/ContentProvider'
import { useSettings } from '@/content/hooks'
import { initScroll, destroyScroll } from '@/lib/scroll'
import { Scene } from '@/three/Scene'
import { Loader } from '@/components/Loader'
import { Nav } from '@/components/Nav'
import { SourcePill } from '@/components/SourcePill'
import { ScrollProgress } from '@/components/ScrollProgress'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { Cursor } from '@/components/Cursor'
import { CommandPalette } from '@/components/CommandPalette'
import { BackToTop } from '@/components/BackToTop'
import { Toaster } from '@/components/Toaster'
import { Terminal } from '@/components/Terminal'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Projects } from '@/sections/Projects'
import { Skills } from '@/sections/Skills'
import { Journey } from '@/sections/Journey'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'

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
      <Scene />
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
      <Toaster />
      <Cursor />
      {import.meta.env.DEV && <SourcePill />}
    </>
  )
}

export default function App() {
  return (
    <ContentProvider>
      <ThemeProvider>
        <Shell />
      </ThemeProvider>
    </ContentProvider>
  )
}
