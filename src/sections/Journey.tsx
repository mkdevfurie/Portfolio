import { Reveal } from '@/components/Reveal'
import { useExperience } from '@/content/hooks'
import { ScrambleText } from '@/components/ScrambleText'
import { Blog } from '@/components/Blog'
import { useT } from '@/i18n'

export function Journey() {
  const entries = useExperience()
  const t = useT()

  return (
    <section id="journey" className="section">
      <div className="section__inner">
        <Reveal>
          <span className="eyebrow"><ScrambleText text={t('Parcours')} /></span>
          <h2 className="section__title">{t('Expérience & formation')}</h2>
        </Reveal>

        <div className="timeline">
          {entries.map((e, i) => (
            <Reveal key={e._id} delay={i * 0.08}>
              <article className={`tl ${e.type === 'education' ? 'tl--edu' : ''}`}>
                <span className="tl__node" />
                <div className="tl__body">
                  <span className="tl__period">{e.period}</span>
                  <h3>{e.title}</h3>
                  {e.organization && <span className="tl__org">{e.organization}</span>}
                  <p>{e.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Blog />
      </div>
    </section>
  )
}
