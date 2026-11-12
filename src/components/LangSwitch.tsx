import { useI18n } from '@/i18n'
import { unlock } from '@/lib/achievements'

/** Bascule FR / EN. */
export function LangSwitch() {
  const { lang, setLang, t } = useI18n()
  const next = lang === 'fr' ? 'en' : 'fr'
  return (
    <button
      className="lang-switch"
      onClick={() => {
        setLang(next)
        unlock('polyglot')
      }}
      aria-label={t('Passer en anglais')}
      title={t('Passer en anglais')}
    >
      <span className={lang === 'fr' ? 'is-on' : ''}>FR</span>
      <span className={lang === 'en' ? 'is-on' : ''}>EN</span>
    </button>
  )
}
