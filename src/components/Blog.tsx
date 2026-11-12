import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Overlay, onPanel, openPanel } from './Overlay'
import { Reveal } from './Reveal'
import { usePosts } from '@/content/hooks'
import { formatDate, useI18n } from '@/i18n'
import { unlock } from '@/lib/achievements'
import type { Post } from '@/types/content'

const readingTime = (p: Post) => Math.max(1, Math.round(p.body.join(' ').split(/\s+/).length / 200))

/** Transforme les paragraphes (avec « ## » et blocs ```) en éléments. */
function renderBody(body: string[]) {
  const out: ReactNode[] = []
  let code: string[] | null = null
  body.forEach((line, i) => {
    if (line.trim() === '```') {
      if (code) {
        out.push(
          <pre key={`c${i}`} className="post__code">
            <code>{code.join('\n')}</code>
          </pre>,
        )
        code = null
      } else code = []
      return
    }
    if (code) {
      code.push(line)
      return
    }
    if (line.startsWith('## ')) out.push(<h3 key={i}>{line.slice(3)}</h3>)
    else out.push(<p key={i}>{line}</p>)
  })
  return out
}

/** Liste des derniers articles (masquée s'il n'y en a pas) + lecteur d'article. */
export function Blog() {
  const posts = usePosts()
  const { t, lang } = useI18n()
  const [slug, setSlug] = useState<string | null>(null)

  useEffect(
    () =>
      onPanel((id) => {
        if (id.startsWith('post:')) setSlug(id.slice(5))
      }),
    [],
  )
  const close = useCallback(() => setSlug(null), [])
  const post = posts.find((p) => p.slug === slug)

  useEffect(() => {
    if (!post) return
    const id = window.setTimeout(() => unlock('reader'), 8000)
    return () => window.clearTimeout(id)
  }, [post])

  if (!posts.length) return null

  return (
    <div className="blog">
      <Reveal>
        <span className="eyebrow">{t('Blog')}</span>
        <h3 className="blog__title">{t('Ce que j’apprends en construisant')}</h3>
      </Reveal>
      <div className="blog__grid">
        {posts.slice(0, 3).map((p, i) => (
          <Reveal key={p._id} delay={i * 0.08}>
            <button className="post-card" onClick={() => openPanel(`post:${p.slug}`)}>
              <span className="post-card__meta">
                {formatDate(p.date, lang)} · {t('{n} min de lecture', { n: readingTime(p) })}
              </span>
              <strong>{p.title}</strong>
              <p>{p.excerpt}</p>
              <span className="post-card__tags">
                {p.tags.map((tg) => (
                  <em key={tg}>#{tg}</em>
                ))}
              </span>
              <span className="post-card__more">{t('Lire l’article')} →</span>
            </button>
          </Reveal>
        ))}
      </div>

      <Overlay open={!!post} onClose={close} title={post?.title ?? ''} width={760}>
        {post && (
          <article className="post">
            <p className="post__meta">
              {formatDate(post.date, lang)} · {t('{n} min de lecture', { n: readingTime(post) })} ·{' '}
              {post.tags.map((tg) => `#${tg}`).join(' ')}
            </p>
            <p className="post__lead">{post.excerpt}</p>
            {renderBody(post.body)}
          </article>
        )}
      </Overlay>
    </div>
  )
}
