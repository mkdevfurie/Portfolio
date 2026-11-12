import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]#&*+=?'

interface Props {
  text: string
  /** durée totale de l'effet (ms) */
  duration?: number
  className?: string
}

/**
 * Texte qui se « décode » lettre par lettre quand il entre dans l'écran.
 * Le texte final est toujours exposé aux lecteurs d'écran (aria-label).
 */
export function ScrambleText({ text, duration = 900, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [out, setOut] = useState(text)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let played = false

    const play = () => {
      const start = performance.now()
      const frame = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        const solved = Math.floor(p * text.length)
        let s = ''
        for (let i = 0; i < text.length; i++) {
          const ch = text[i]
          if (i < solved || ch === ' ' || ch === '\n') s += ch
          else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        setOut(s)
        if (p < 1) raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !played) {
          played = true
          play()
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [text, duration])

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  )
}
