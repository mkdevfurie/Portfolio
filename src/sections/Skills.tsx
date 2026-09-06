import { Reveal } from '@/components/Reveal'
import { useSkills } from '@/content/hooks'

export function Skills() {
  const skills = useSkills()

  return (
    <section id="skills" className="section">
      <div className="section__inner">
        <Reveal>
          <span className="eyebrow">Compétences</span>
          <h2 className="section__title">Stack & outils</h2>
          <p className="section__lead">
            Les technologies avec lesquelles je travaille au quotidien.
          </p>
        </Reveal>

        <div className="sgrid">
          {skills.map((sk, i) => (
            <Reveal key={sk._id} delay={i * 0.05}>
              <article className="skill">
                <div className="skill__icon">
                  {sk.icon?.src ? (
                    <img src={sk.icon.src} alt={sk.icon.alt || sk.name} loading="lazy" />
                  ) : (
                    <span>{sk.name.slice(0, 2)}</span>
                  )}
                </div>
                <div>
                  <h3>{sk.name}</h3>
                  <p>{sk.detail}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
