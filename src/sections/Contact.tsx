import { useState, type FormEvent } from 'react'
import { Reveal } from '@/components/Reveal'
import { useSettings } from '@/content/hooks'

type Status = 'idle' | 'sending' | 'ok' | 'error'

export function Contact() {
  const s = useSettings()
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const update = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!s.web3formsKey) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      const body = new FormData()
      body.append('access_key', s.web3formsKey)
      body.append('subject', `Portfolio — message de ${form.name}`)
      body.append('from_name', form.name)
      body.append('email', form.email)
      body.append('message', form.message)

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body,
      })
      const data = await res.json()
      setStatus(data.success ? 'ok' : 'error')
      if (data.success) setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const whatsappHref = s.whatsapp
    ? `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(
        `Bonjour ${s.firstName}, je vous contacte via votre portfolio.`,
      )}`
    : null

  return (
    <section id="contact" className="section">
      <div className="section__inner">
        <div className="contact__grid">
          <div className="contact__lede">
            <Reveal>
              <span className="eyebrow">Contact</span>
              <h2 className="section__title">Un projet en tête ?</h2>
              <p className="section__lead">
                Parlons-en. Réponse sous 24–48 h.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="contact__direct">
                <a href={`mailto:${s.email}`} className="contact__line">
                  <span>Email</span>
                  {s.email}
                </a>
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="contact__line">
                    <span>WhatsApp</span>
                    Discuter maintenant
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="contact__socials">
                {s.socials.linkedin && (
                  <a href={s.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                )}
                {s.socials.github && (
                  <a href={s.socials.github} target="_blank" rel="noreferrer">GitHub</a>
                )}
                {s.socials.twitter && (
                  <a href={s.socials.twitter} target="_blank" rel="noreferrer">Twitter / X</a>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="contact__formwrap">
            <form className="cform panel" onSubmit={handleSubmit}>
              <label>
                Nom
                <input
                  required
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Votre nom"
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="vous@exemple.com"
                />
              </label>
              <label>
                Message
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Décrivez votre besoin…"
                />
              </label>

              <button className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
              </button>

              {status === 'ok' && <p className="cform__msg cform__msg--ok">Message envoyé, merci !</p>}
              {status === 'error' && (
                <p className="cform__msg cform__msg--err">
                  Envoi impossible. Écrivez-moi directement à {s.email}.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
