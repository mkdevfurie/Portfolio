import { Reveal } from '@/components/Reveal'
import { useServices, useSettings } from '@/content/hooks'

export function About() {
  const s = useSettings()
  const services = useServices()

  return (
    <section id="about" className="section">
      <div className="section__inner">
        <div className="about__grid">
          <div className="about__intro">
            <Reveal>
              <span className="eyebrow">À propos</span>
              <h2 className="section__title">
                Je transforme des besoins métier en produits fiables.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="about__p">{s.bio1}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="about__p about__p--dim">{s.bio2}</p>
            </Reveal>
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
