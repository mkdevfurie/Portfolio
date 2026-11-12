/** Mini bus de notifications : toast('Copié !') depuis n'importe où. */
export interface ToastMsg {
  id: number
  text: string
}

type Listener = (t: ToastMsg) => void
const listeners = new Set<Listener>()
let n = 0

export function toast(text: string) {
  const t = { id: ++n, text }
  listeners.forEach((l) => l(t))
}

export function onToast(l: Listener) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

/** Copie un texte et prévient l'utilisateur. */
export async function copyText(text: string, label = 'Copié dans le presse-papiers') {
  try {
    await navigator.clipboard.writeText(text)
    toast(label)
    return
  } catch {
    /* API indisponible (http, iframe, navigateur ancien) : méthode de secours */
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand('copy')
  ta.remove()
  toast(ok ? label : 'Copie impossible — sélectionnez le texte manuellement')
}

/** Vrai si l'utilisateur est en train de taper dans un champ. */
export function isTyping(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
}
