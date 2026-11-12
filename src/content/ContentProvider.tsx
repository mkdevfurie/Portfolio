import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useI18n } from '@/i18n'
import { localize } from './en'
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

  const { lang } = useI18n()
  const value = useMemo(
    () => (lang === 'en' ? { ...state, content: localize(state.content) } : state),
    [state, lang],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
