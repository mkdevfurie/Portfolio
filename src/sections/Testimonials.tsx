import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTestimonials } from '@/content/hooks'
import { useT } from '@/i18n'
import { EASE } from '@/lib/motion'

/** Carrousel de témoignages clients — masqué tant qu'il n'y en a aucun. */
export function Testimonials() {
  const items = useTestimonials()
  const t = useT()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (items.length < 2 || paused) return
    const id = window.setInterval(() => setI((v) => (v + 1) % items.length), 7000)
    return () => window.clearInterval(id)
  }, [items.length, paused])

  if (!items.length) return null
  const cur = items[i % items.length]

  return (
    <div className="testi" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <span className="eyebrow">{t('Ils me font confiance')}</span>
      <div className="testi__stage">
        <AnimatePresence mode="wait">
          <motion.figure
            key={cur._id}
            className="testi__card"
            initial={{ opacity: 0, y: 16, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <span className="testi__quote" aria-hidden>
              “
            </span>
            <blockquote>{cur.quote}</blockquote>
            <figcaption>
              {cur.avatar?.src ? (
                <img src={cur.avatar.src} alt="" />
              ) : (
                <span className="testi__initial">{cur.name.slice(0, 1)}</span>
              )}
              <span>
                <strong>{cur.name}</strong>
                <em>
                  {cur.role}
                  {cur.company ? ` · ${cur.company}` : ''}
                </em>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      {items.length > 1 && (
        <div className="testi__dots" role="tablist">
          {items.map((it, k) => (
            <button
              key={it._id}
              role="tab"
              aria-selected={k === i}
              aria-label={it.name}
              className={k === i ? 'is-on' : ''}
              onClick={() => setI(k)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
