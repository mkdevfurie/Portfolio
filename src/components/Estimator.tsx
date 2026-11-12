import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Overlay, onPanel } from './Overlay'
import { DESIGN, FEATURES, PROJECT_TYPES, TIMING, roundPrice } from '@/content/pricing'
import { useSettings } from '@/content/hooks'
import { useI18n } from '@/i18n'
import { EASE } from '@/lib/motion'
import { unlock } from '@/lib/achievements'

const STEPS = ['Type', 'Fonctionnalités', 'Design', 'Délai', 'Estimation'] as const

/** Estimateur de projet en 5 étapes → fourchette de prix + envoi de la demande. */
export function Estimator() {
  const s = useSettings()
  const { t, lang } = useI18n()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [type, setType] = useState<string | null>(null)
  const [features, setFeatures] = useState<string[]>([])
  const [design, setDesign] = useState('need')
  const [timing, setTiming] = useState('normal')

  useEffect(() => onPanel((id) => id === 'estimator' && setOpen(true)), [])
  const close = useCallback(() => setOpen(false), [])

  const result = useMemo(() => {
    const base = PROJECT_TYPES.find((p) => p.id === type)
    if (!base) return null
    const feats = FEATURES.filter((f) => features.includes(f.id))
    const pct =
      feats.reduce((a, f) => a + f.pct, 0) +
      (DESIGN.find((d) => d.id === design)?.pct ?? 0) +
      (TIMING.find((d) => d.id === timing)?.pct ?? 0)
    const k = 1 + pct / 100
    const extraWeeks = feats.reduce((a, f) => a + f.weeks, 0)
    return {
      base,
      feats,
      min: roundPrice(base.min * k),
      max: roundPrice(base.max * k),
      weeks: [Math.ceil(base.weeks[0] + extraWeeks * 0.6), Math.ceil(base.weeks[1] + extraWeeks)],
    }
  }, [type, features, design, timing])

  const fmt = (n: number) =>
    new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR').format(n) + ' FCFA'

  const summary = result
    ? [
        t('Bonjour {name}, je souhaite un devis :', { name: s.lastName }),
        `• ${t('Projet')} : ${t(result.base.label)}`,
        result.feats.length ? `• ${t('Fonctionnalités')} : ${result.feats.map((f) => t(f.label)).join(', ')}` : '',
        `• ${t('Design')} : ${t(DESIGN.find((d) => d.id === design)!.label)}`,
        `• ${t('Délai')} : ${t(TIMING.find((d) => d.id === timing)!.label)}`,
        `• ${t('Estimation du site')} : ${fmt(result.min)} – ${fmt(result.max)}`,
      ]
        .filter(Boolean)
        .join('\n')
    : ''

  const next = () => {
    setStep((v) => Math.min(v + 1, STEPS.length - 1))
    if (step === STEPS.length - 2) unlock('estimator')
  }
  const back = () => setStep((v) => Math.max(v - 1, 0))
  const reset = () => {
    setStep(0)
    setType(null)
    setFeatures([])
  }

  const canNext = step !== 0 || !!type

  return (
    <Overlay open={open} onClose={close} title={t('Estimer mon projet')} width={680}>
      <ol className="est__steps" aria-label={t('Étapes')}>
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? 'is-current' : i < step ? 'is-done' : ''}>
            <span>{i + 1}</span>
            <em>{t(label)}</em>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="est__pane"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {step === 0 && (
            <>
              <h3>{t('Quel type de projet ?')}</h3>
              <div className="est__grid">
                {PROJECT_TYPES.map((p) => (
                  <button
                    key={p.id}
                    className={`est__opt ${type === p.id ? 'is-on' : ''}`}
                    onClick={() => {
                      setType(p.id)
                      setStep(1)
                    }}
                  >
                    <span className="est__emoji">{p.emoji}</span>
                    {t(p.label)}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h3>{t('De quoi avez-vous besoin ?')}</h3>
              <p className="est__hint">{t('Plusieurs choix possibles — ou aucun.')}</p>
              <div className="est__grid est__grid--2">
                {FEATURES.map((f) => {
                  const on = features.includes(f.id)
                  return (
                    <button
                      key={f.id}
                      className={`est__opt est__opt--check ${on ? 'is-on' : ''}`}
                      aria-pressed={on}
                      onClick={() => setFeatures((v) => (on ? v.filter((x) => x !== f.id) : [...v, f.id]))}
                    >
                      <span className="est__box">{on ? '✓' : ''}</span>
                      {t(f.label)}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3>{t('Et le design ?')}</h3>
              <div className="est__grid est__grid--2">
                {DESIGN.map((d) => (
                  <button key={d.id} className={`est__opt ${design === d.id ? 'is-on' : ''}`} onClick={() => setDesign(d.id)}>
                    {t(d.label)}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3>{t('Pour quand ?')}</h3>
              <div className="est__grid">
                {TIMING.map((d) => (
                  <button key={d.id} className={`est__opt ${timing === d.id ? 'is-on' : ''}`} onClick={() => setTiming(d.id)}>
                    {t(d.label)}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && result && (
            <div className="est__result">
              <p className="est__label">{t('Estimation indicative')}</p>
              <p className="est__price">
                {fmt(result.min)} <span>–</span> {fmt(result.max)}
              </p>
              <p className="est__weeks">
                ⏱ {t('Environ {a} à {b} semaines', { a: result.weeks[0], b: result.weeks[1] })}
              </p>
              <pre className="est__summary">{summary}</pre>
              <p className="est__hint">
                {t('Fourchette indicative : le prix final dépend du cahier des charges. Envoyez-moi ce résumé pour un devis précis et gratuit.')}
              </p>
              <div className="est__actions">
                {s.whatsapp && (
                  <a
                    className="btn btn--primary"
                    href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(summary)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('Envoyer sur WhatsApp')}
                  </a>
                )}
                <a
                  className="btn btn--ghost"
                  href={`mailto:${s.email}?subject=${encodeURIComponent(t('Demande de devis'))}&body=${encodeURIComponent(summary)}`}
                >
                  {t('Envoyer par email')}
                </a>
                <button className="btn btn--ghost" onClick={reset}>
                  {t('Recommencer')}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && step < 4 && (
        <div className="est__nav">
          <button className="btn btn--ghost" onClick={back}>
            ← {t('Retour')}
          </button>
          <button className="btn btn--primary" onClick={next} disabled={!canNext}>
            {step === 3 ? t('Voir l’estimation') : t('Continuer')} →
          </button>
        </div>
      )}
    </Overlay>
  )
}
