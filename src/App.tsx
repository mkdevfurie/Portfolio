import { useEffect } from 'react'
import { ContentProvider } from '@/content/ContentProvider'
import { useSettings } from '@/content/hooks'
import { initScroll, destroyScroll } from '@/lib/scroll'
import { Scene } from '@/three/Scene'
import { Loader } from '@/components/Loader'
import { Nav } from '@/components/Nav'
import { SourcePill } from '@/components/SourcePill'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Projects } from '@/sections/Projects'
import { Skills } from '@/sections/Skills'
import { Journey } from '@/sections/Journey'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'

/** Applique la palette CMS aux variables CSS + <title>/<meta>. */
function DocumentChrome() {
  const s = useSettings()
  useEffect(() => {
    const root = document.documentElement
    const t = s.theme
    root.style.setProperty('--c-dark', t.dark)
    root.style.setProperty('--c-darker', t.darker)
    root.style.setProperty('--c-mid', t.mid)
    root.style.setProperty('--c-primary', t.primary)
    root.style.setProperty('--c-accent', t.accent)
    root.style.setProperty('--c-light', t.light)
    root.style.setProperty('--c-pale', t.pale)

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

      <SourcePill />
    </>
  )
}

export default function App() {
  return (
    <ContentProvider>
      <Shell />
    </ContentProvider>
  )
}
