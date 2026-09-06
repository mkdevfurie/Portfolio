import { useEffect, useState, type ReactNode } from 'react'
import { loadContent } from '@/lib/loadContent'
import { fallbackContent } from './fallback'
import { ContentContext, type ContentState } from './context'

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>({
    content: fallbackContent,
    source: 'fallback',
    loading: true,
  })

  useEffect(() => {
    let alive = true
    loadContent().then(({ content, source }) => {
      if (!alive) return
      setState({ content, source, loading: false })
    })
    return () => {
      alive = false
    }
  }, [])

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
}
