import { useCallback, useEffect, useState } from 'react'
import { Overlay, onPanel } from './Overlay'
import { useSettings } from '@/content/hooks'
import { useI18n } from '@/i18n'
import { useTheme } from '@/theme/ThemeProvider'

/**
 * Réservation d'un appel. Avec un lien Cal.com (réglage « calUrl »), l'agenda
 * s'affiche dans la fenêtre ; sinon, propositions WhatsApp / email pré-remplies.
 */
export function Booking() {
  const s = useSettings()
  const { t } = useI18n()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)

  useEffect(() => onPanel((id) => id === 'booking' && setOpen(true)), [])
  const close = useCallback(() => setOpen(false), [])

  const msg = t('Bonjour {name}, j’aimerais réserver un appel pour parler de mon projet. Quels créneaux vous conviennent ?', {
    name: s.lastName,
  })

  const calSrc = s.calUrl
    ? `${s.calUrl}${s.calUrl.includes('?') ? '&' : '?'}embed=true&theme=${theme.isLight ? 'light' : 'dark'}`
    : null

  return (
    <Overlay open={open} onClose={close} title={t('Réserver un appel')} width={calSrc ? 980 : 560}>
      {calSrc ? (
        <iframe className="booking__frame" src={calSrc} title={t('Agenda de réservation')} loading="lazy" />
      ) : (
        <div className="booking__fallback">
          <p>{t('Un appel de 15 à 30 minutes, gratuit et sans engagement, pour parler de votre projet.')}</p>
          <p className="booking__hint">{t('Dites-moi vos disponibilités, je vous confirme un créneau rapidement :')}</p>
          <div className="booking__actions">
            {s.whatsapp && (
              <a className="btn btn--primary" href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer">
                💬 {t('Réserver via WhatsApp')}
              </a>
            )}
            <a className="btn btn--ghost" href={`mailto:${s.email}?subject=${encodeURIComponent(t('Réservation d’un appel'))}&body=${encodeURIComponent(msg)}`}>
              ✉️ {t('Réserver par email')}
            </a>
          </div>
        </div>
      )}
    </Overlay>
  )
}
