import { useSettings } from '@/content/hooks'
import { scrollToSection } from '@/lib/scroll'
import { Logo } from '@/components/Logo'
import { useT } from '@/i18n'

export function Footer() {
  const s = useSettings()
  const t = useT()
  return (
    <footer className="footer">
      <div className="footer__inner">
        <button className="footer__brand" onClick={() => scrollToSection('hero')} aria-label={t('Retour en haut')}>
          <Logo size={30} />
        </button>
        <p className="footer__copy">
          © {s.year} {s.firstName} {s.lastName} — {t('Tous droits réservés.')}
        </p>
        <p className="footer__made">{t('Conçu avec React Three Fiber & Sanity.')}</p>
      </div>
    </footer>
  )
}
