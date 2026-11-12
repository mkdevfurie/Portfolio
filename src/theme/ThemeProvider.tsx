import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { useSettings } from '@/content/hooks'
import { trackSet } from '@/lib/achievements'
import { DEFAULT_THEME, getTheme, type Theme, type ThemeId } from './themes'

const STORAGE_KEY = 'portfolio-theme'

interface ThemeCtx {
  theme: Theme
  setTheme: (id: ThemeId) => void
}

const Ctx = createContext<ThemeCtx | null>(null)

function readStored(): ThemeId {
  try {
    return getTheme(localStorage.getItem(STORAGE_KEY)).id
  } catch {
    return DEFAULT_THEME
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const settings = useSettings()
  const [id, setId] = useState<ThemeId>(readStored)

  // Le thème "Océan" reprend la palette réglée dans le CMS.
  const theme = useMemo<Theme>(() => {
    const base = getTheme(id)
    if (base.id !== 'ocean') return base
    return { ...base, palette: { ...base.palette, ...settings.theme } }
  }, [id, settings.theme])

  useLayoutEffect(() => {
    const root = document.documentElement
    const { palette: p, ui } = theme
    const vars: Record<string, string> = {
      '--c-dark': p.dark,
      '--c-darker': p.darker,
      '--c-mid': p.mid,
      '--c-primary': p.primary,
      '--c-accent': p.accent,
      '--c-light': p.light,
      '--c-pale': p.pale,
      '--bg': ui.bg,
      '--panel': ui.panel,
      '--panel-solid': ui.panelSolid,
      '--panel-border': ui.panelBorder,
      '--panel-border-strong': ui.panelBorderStrong,
      '--text': ui.text,
      '--text-dim': ui.textDim,
      '--text-bright': ui.textBright,
    }
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    root.dataset.theme = theme.id
    root.dataset.themeMode = theme.isLight ? 'light' : 'dark'
    root.style.colorScheme = theme.isLight ? 'light' : 'dark'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', ui.bg)
  }, [theme])

  useEffect(() => {
    trackSet('themes', id, 5, 'chameleon')
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* stockage indisponible : on garde le thème en mémoire */
    }
  }, [id])

  const value = useMemo(() => ({ theme, setTheme: setId }), [theme])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useTheme doit être utilisé dans <ThemeProvider>')
  return v
}
