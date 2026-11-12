import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Overlay, onPanel } from './Overlay'
import { useExperience, useProjects, useSettings, useSkills } from '@/content/hooks'
import { useT } from '@/i18n'
import { ME } from '@/content/me'

/** Le CV en une page (affiché à l'écran et utilisé pour l'impression / PDF). */
function CvSheet() {
  const s = useSettings()
  const t = useT()
  const projects = useProjects()
  const skills = useSkills()
  const exp = useExperience()

  return (
    <article className="cv">
      <header className="cv__head">
        <img src={ME.avatar} alt="" className="cv__photo" />
        <div>
          <h1>
            {s.firstName} {s.lastName}
          </h1>
          <p className="cv__role">{s.title.replace(/\n/g, ' ')}</p>
          <p className="cv__contact">
            📍 Lomé, Togo · ✉️ {s.email}
            {s.whatsapp ? ` · 📱 +${s.whatsapp}` : ''}
            {s.socials.github ? ` · ${s.socials.github.replace('https://', '')}` : ''}
            {` · ${location.host}`}
          </p>
        </div>
      </header>

      <section>
        <h2>{t('Profil')}</h2>
        <p>
          {s.bio1} {s.bio2}
        </p>
      </section>

      <section>
        <h2>{t('Compétences')}</h2>
        <p className="cv__skills">
          {skills.map((k) => (
            <span key={k._id}>{k.name}</span>
          ))}
        </p>
      </section>

      <section>
        <h2>{t('Expérience & formation')}</h2>
        {exp.map((e) => (
          <div key={e._id} className="cv__item">
            <div className="cv__line">
              <strong>{e.title}</strong>
              <em>{e.period}</em>
            </div>
            {e.organization && <p className="cv__org">{e.organization}</p>}
            <p>{e.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>{t('Projets sélectionnés')}</h2>
        <div className="cv__projects">
          {projects.slice(0, 8).map((p) => (
            <div key={p._id} className="cv__item">
              <div className="cv__line">
                <strong>{p.title}</strong>
                {p.year && <em>{p.year}</em>}
              </div>
              <p>{p.subtitle}</p>
              <p className="cv__tags">{p.tags.join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}

/** Mode recruteur : CV d'une page, sans animation, imprimable en PDF. */
export function RecruiterMode() {
  const t = useT()
  const [open, setOpen] = useState(false)
  useEffect(() => onPanel((id) => id === 'recruiter' && setOpen(true)), [])
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <Overlay open={open} onClose={close} title={t('Mode recruteur')} width={860} className="ovl--cv">
        <div className="cv__toolbar">
          <p>{t('Mon parcours en une page, sans animation. Imprimez-le ou enregistrez-le en PDF.')}</p>
          <button className="btn btn--primary" onClick={() => window.print()}>
            🖨️ {t('Imprimer / PDF')}
          </button>
        </div>
        <CvSheet />
      </Overlay>
      {/* copie dédiée à l'impression (Ctrl+P n'imprime que le CV) */}
      {createPortal(
        <div className="print-cv">
          <CvSheet />
        </div>,
        document.body,
      )}
    </>
  )
}
