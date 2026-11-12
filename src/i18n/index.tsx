/* eslint-disable react-refresh/only-export-components -- fournisseur + hooks de traduction */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { EN } from './en'

/**
 * Traduction FR/EN.
 * Le français est la langue source : t('Texte français') renvoie la traduction
 * anglaise si elle existe dans en.ts, sinon le texte français tel quel.
 * Variables : t('{n} projets', { n: 12 }).
 */
export type Lang = 'fr' | 'en'

const STORAGE_KEY = 'portfolio-lang'

interface I18nCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (fr: string, vars?: Record<string, string | number>) => string
}

const Ctx = createContext<I18nCtx>({
  lang: 'fr',
  setLang: () => {},
  t: (s) => s,
})

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'fr' || stored === 'en') return stored
  } catch {
    /* stockage indisponible */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'fr'
  return nav.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* stockage indisponible */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (fr: string, vars?: Record<string, string | number>) => {
      let s = lang === 'en' ? (EN[fr] ?? fr) : fr
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
      return s
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  return useContext(Ctx)
}

export function useT() {
  return useContext(Ctx).t
}

/** Formate une date ISO dans la langue courante. */
export function formatDate(iso: string, lang: Lang) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}
