import { useSettings } from '@/content/hooks'
import { scrollToSection } from '@/lib/scroll'

export function Footer() {
  const s = useSettings()
  return (
    <footer className="footer">
      <div className="footer__inner">
        <button className="footer__brand" onClick={() => scrollToSection('hero')}>
          {s.firstName}
          <span>{s.lastName}</span>
        </button>
        <p className="footer__copy">
          © {s.year} {s.firstName} {s.lastName} — Tous droits réservés.
        </p>
        <p className="footer__made">Conçu avec React Three Fiber &amp; Sanity.</p>
      </div>
    </footer>
  )
}
