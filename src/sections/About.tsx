import { Reveal } from '@/components/Reveal'
import { useServices, useSettings } from '@/content/hooks'
import { ScrambleText } from '@/components/ScrambleText'
import { Portrait } from '@/components/Portrait'
import { openPanel } from '@/components/Overlay'
import { useT } from '@/i18n'

export function About() {
  const s = useSettings()
  const t = useT()
  const services = useServices()

  return (
    <section id="about" className="section">
      <div className="section__inner">
        <div className="about__grid">
          <div className="about__intro">
            <Reveal>
              <span className="eyebrow"><ScrambleText text={t('À propos')} /></span>
              <h2 className="section__title">
                {t('Je transforme des besoins métier en produits fiables.')}
              </h2>
            </Reveal>
            <div className="about__bio">
              <Reveal delay={0.06} className="about__photo">
                <Portrait name={`${s.firstName} ${s.lastName}`} role={t('Développeur web & mobile')} />
              </Reveal>
              <div>
                <Reveal delay={0.08}>
                  <p className="about__p">{s.bio1}</p>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="about__p about__p--dim">{s.bio2}</p>
                </Reveal>
                <Reveal delay={0.22}>
                  <button className="about__cv" onClick={() => openPanel('recruiter')}>
                    <span aria-hidden>📄</span> {t('Mode recruteur — mon CV en une page')}
                  </button>
                </Reveal>
              </div>
            </div>
          </div>

          <div className="about__services">
            {services.map((sv, i) => (
              <Reveal key={sv._id} delay={0.1 + i * 0.08}>
                <article className="service" style={{ ['--accent' as string]: sv.accent }}>
                  <span className="service__emoji">{sv.emoji}</span>
                  <h3>{sv.title}</h3>
                  <p>{sv.subtitle}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
