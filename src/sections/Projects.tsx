import { useEffect, useMemo, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Reveal } from '@/components/Reveal'
import { Tag, StatusBadge } from '@/components/Badges'
import { useProjects } from '@/content/hooks'
import { EASE } from '@/lib/motion'
import type { Project } from '@/types/content'
import { ScrambleText } from '@/components/ScrambleText'

type Filter = 'all' | 'web' | 'mobile' | 'ia'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'ia', label: 'IA' },
]

/** Catégories déduites des tags (aucun champ CMS supplémentaire nécessaire). */
function matches(project: Project, f: Filter) {
  if (f === 'all') return true
  const tags = project.tags.map((t) => t.toLowerCase())
  if (f === 'mobile') return tags.some((t) => /flutter|react native|android|ios|pwa/.test(t))
  if (f === 'ia') return tags.some((t) => /\bia\b|gemma|llm|python|openai/.test(t))
  return tags.some((t) => /react|next|vue|site|web|vite/.test(t))
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  // inclinaison 3D qui suit le pointeur
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 220, damping: 20 })
  const sy = useSpring(my, { stiffness: 220, damping: 20 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9])
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8])
  const glareX = useTransform(sx, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(sy, [-0.5, 0.5], ['0%', '100%'])

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.article
      className="pcard"
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        ['--pc-bg' as string]: project.bgColor,
        ['--gx' as string]: glareX,
        ['--gy' as string]: glareY,
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
      aria-label={`${project.title} — voir les détails`}
    >
      <span className="pcard__glare" aria-hidden />
      <div className="pcard__media">
        {project.cover?.src ? (
          <img src={project.cover.src} alt={project.cover.alt} loading="lazy" />
        ) : (
          <span className="pcard__ph" style={{ color: project.nameColor }}>
            {project.shortName}
          </span>
        )}
        <span className="pcard__status">
          <StatusBadge status={project.status} />
        </span>
      </div>

      <div className="pcard__body">
        <div className="pcard__head">
          <h3>{project.title}</h3>
          {project.year && <span className="pcard__year">{project.year}</span>}
        </div>
        <p>{project.subtitle || project.description}</p>
        <div className="pcard__tags">
          {project.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
        <span className="pcard__more">Détails →</span>
      </div>
    </motion.article>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal__panel"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Fermer">
          ×
        </button>

        {project.cover?.src && (
          <div className="modal__cover">
            <img src={project.cover.src} alt={project.cover.alt} />
          </div>
        )}

        <div className="modal__content">
          <div className="modal__meta">
            <StatusBadge status={project.status} />
            {project.role && <span>{project.role}</span>}
            {project.client && <span>· {project.client}</span>}
            {project.year && <span>· {project.year}</span>}
          </div>
          <h3>{project.title}</h3>
          <p className="modal__sub">{project.subtitle}</p>

          {(project.body?.length ? project.body : [project.description]).map((p, i) => (
            <p key={i} className="modal__p">
              {p}
            </p>
          ))}

          <div className="modal__tags">
            {project.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>

          {(project.liveUrl || project.repoUrl) && (
            <div className="modal__links">
              {project.liveUrl && (
                <a className="btn btn--primary" href={project.liveUrl} target="_blank" rel="noreferrer">
                  Voir en ligne →
                </a>
              )}
              {project.repoUrl && (
                <a className="btn btn--ghost" href={project.repoUrl} target="_blank" rel="noreferrer">
                  Code source
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Projects() {
  const projects = useProjects()
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  // ouverture d'un projet depuis le terminal (« ouvrir <projet> »)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail
      const p = projects.find((x) => x.slug === slug)
      if (p) {
        setFilter('all')
        setOpenId(p._id)
      }
    }
    window.addEventListener('open-project', onOpen)
    return () => window.removeEventListener('open-project', onOpen)
  }, [projects])
  const open = projects.find((p) => p._id === openId) ?? null
  const shown = useMemo(() => projects.filter((p) => matches(p, filter)), [projects, filter])
  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.id, projects.filter((p) => matches(p, f.id)).length])),
    [projects],
  )

  return (
    <section id="projects" className="section">
      <div className="section__inner">
        <Reveal>
          <span className="eyebrow"><ScrambleText text="Projets" /></span>
          <h2 className="section__title">Réalisations sélectionnées</h2>
          <p className="section__lead">
            Plateformes web, applications mobiles et outils IA : {projects.length} projets
            conçus de la maquette à la mise en production.
          </p>
        </Reveal>

        <div className="pfilters" role="tablist" aria-label="Filtrer les projets">
          {FILTERS.filter((f) => f.id === 'all' || counts[f.id] > 0).map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`pfilter ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {filter === f.id && (
                <motion.span layoutId="pfilter-bg" className="pfilter__bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
              )}
              <span className="pfilter__label">
                {f.label} <small>{counts[f.id]}</small>
              </span>
            </button>
          ))}
        </div>

        <motion.div className="pgrid" layout>
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, y: 40, rotateX: -14 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: EASE }}
                style={{ transformPerspective: 1000 }}
              >
                <ProjectCard project={p} onOpen={() => setOpenId(p._id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && <ProjectModal project={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </section>
  )
}
