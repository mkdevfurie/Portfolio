import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Reveal } from '@/components/Reveal'
import { Tag, StatusBadge } from '@/components/Badges'
import { useProjects } from '@/content/hooks'
import { EASE } from '@/lib/motion'
import type { Project } from '@/types/content'

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.article
      className="pcard"
      onClick={onOpen}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{ ['--pc-bg' as string]: project.bgColor }}
    >
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
  const open = projects.find((p) => p._id === openId) ?? null

  return (
    <section id="projects" className="section">
      <div className="section__inner">
        <Reveal>
          <span className="eyebrow">Projets</span>
          <h2 className="section__title">Réalisations sélectionnées</h2>
          <p className="section__lead">
            Chaque projet est géré depuis le CMS — il suffit d'y ajouter une entrée
            pour qu'elle apparaisse ici et dans la scène 3D.
          </p>
        </Reveal>

        <div className="pgrid">
          {projects.map((p, i) => (
            <Reveal key={p._id} delay={i * 0.06}>
              <ProjectCard project={p} onOpen={() => setOpenId(p._id)} />
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectModal project={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </section>
  )
}
