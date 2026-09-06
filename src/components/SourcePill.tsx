import { useContent } from '@/content/hooks'

/** Petit indicateur : d'où vient le contenu affiché. */
export function SourcePill() {
  const { source, loading } = useContent()
  if (loading) return null
  return (
    <span className="source-pill" title="Origine du contenu">
      {source === 'sanity' ? '● CMS Sanity' : '○ contenu local'}
    </span>
  )
}
