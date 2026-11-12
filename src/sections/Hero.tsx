import { motion } from 'motion/react'
import { useSettings } from '@/content/hooks'
import { scrollToSection } from '@/lib/scroll'
import { fadeUp as item, staggerParent as container } from '@/lib/motion'
import { openTerminal } from '@/components/Terminal'
import { ME } from '@/content/me'
import { useT } from '@/i18n'

export function Hero() {
  const s = useSettings()
  const t = useT()
  const titleLines = s.title.split('\n')

  return (
    <section id="hero" className="section hero">
      <motion.div
        className="section__inner hero__inner"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span className="hero__pill" variants={item}>
          <span className="hero__avatar">
            <img src={ME.avatar} alt="" width={160} height={160} />
            <span className="hero__dot" />
          </span>
          {s.tagline}
        </motion.span>

        <motion.h1 className="hero__title" variants={item}>
          {titleLines.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </motion.h1>

        <motion.p className="hero__bio" variants={item}>
          {s.bio1.split('.')[0]}.
        </motion.p>

        <motion.div className="hero__cta" variants={item}>
          <button className="btn btn--primary" onClick={() => scrollToSection('projects')}>
            {t('Voir les projets')}
            <span aria-hidden>→</span>
          </button>
          <button className="btn btn--ghost" onClick={() => scrollToSection('contact')}>
            {t('Me contacter')}
          </button>
          <button className="btn btn--term" onClick={openTerminal} title={t('Ouvrir le terminal (touche ²)')}>
            <span className="btn--term__prompt" aria-hidden>
              &gt;_
            </span>
            Terminal
          </button>
        </motion.div>

        <motion.ul className="hero__stats" variants={item}>
          {s.stats.map((st) => (
            <li key={st.label}>
              <strong>{st.value}</strong>
              <span>{st.label}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.button
        className="scroll-cue"
        onClick={() => scrollToSection('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        aria-label={t('Faire défiler')}
      >
        <span className="scroll-cue__wheel" />
        {t('défiler')}
      </motion.button>
    </section>
  )
}
