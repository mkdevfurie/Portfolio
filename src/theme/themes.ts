/**
 * Thèmes visuels du portfolio.
 * Chaque thème pilote à la fois les variables CSS (DOM) et la palette
 * de la scène 3D. Le thème "ocean" reprend la palette définie dans le CMS.
 */

export interface Palette {
  dark: string
  darker: string
  mid: string
  primary: string
  accent: string
  light: string
  pale: string
}

export interface ThemeUi {
  bg: string
  panel: string
  panelSolid: string
  panelBorder: string
  panelBorderStrong: string
  text: string
  textDim: string
  textBright: string
}

export interface Theme {
  id: ThemeId
  label: string
  /** thème clair : la scène 3D désactive le bloom et le mélange additif */
  isLight: boolean
  palette: Palette
  ui: ThemeUi
}

export type ThemeId = 'ocean' | 'aurora' | 'emerald' | 'sunset' | 'light'

const darkUi = (bg: string, panelRgb: string, borderRgb: string, text: string, dim: string, bright: string): ThemeUi => ({
  bg,
  panel: `rgba(${panelRgb}, 0.55)`,
  panelSolid: `rgb(${panelRgb})`,
  panelBorder: `rgba(${borderRgb}, 0.18)`,
  panelBorderStrong: `rgba(${borderRgb}, 0.4)`,
  text,
  textDim: dim,
  textBright: bright,
})

export const THEMES: Theme[] = [
  {
    id: 'ocean',
    label: 'Océan',
    isLight: false,
    palette: {
      dark: '#042c53',
      darker: '#02192e',
      mid: '#0c447c',
      primary: '#185fa5',
      accent: '#378add',
      light: '#85b7eb',
      pale: '#b5d4f4',
    },
    ui: darkUi('#030b18', '8, 24, 46', '133, 183, 235', '#dbe8f7', '#8ba7c7', '#f4f9ff'),
  },
  {
    id: 'aurora',
    label: 'Aurore',
    isLight: false,
    palette: {
      dark: '#2a0f4d',
      darker: '#170730',
      mid: '#4c1d95',
      primary: '#7c3aed',
      accent: '#c06cf5',
      light: '#e0b8ff',
      pale: '#f1dcff',
    },
    ui: darkUi('#0b0418', '26, 12, 48', '214, 170, 255', '#ece2f8', '#a996c4', '#fbf6ff'),
  },
  {
    id: 'emerald',
    label: 'Émeraude',
    isLight: false,
    palette: {
      dark: '#053b2e',
      darker: '#02221a',
      mid: '#0b5e47',
      primary: '#0e9f6e',
      accent: '#34d399',
      light: '#9be8c7',
      pale: '#c9f5e1',
    },
    ui: darkUi('#02110c', '6, 34, 26', '155, 232, 199', '#dcf3e9', '#88b5a3', '#f3fffa'),
  },
  {
    id: 'sunset',
    label: 'Solaire',
    isLight: false,
    palette: {
      dark: '#4a1a06',
      darker: '#2a0d03',
      mid: '#8a2f0c',
      primary: '#e0571b',
      accent: '#ff9447',
      light: '#ffc999',
      pale: '#ffe2c7',
    },
    ui: darkUi('#140804', '42, 16, 8', '255, 201, 153', '#f8e7dc', '#c4a08b', '#fffaf6'),
  },
  {
    id: 'light',
    label: 'Clair',
    isLight: true,
    palette: {
      dark: '#c9dcf2',
      darker: '#dbe7f5',
      mid: '#9dbde3',
      primary: '#1d5fa8',
      accent: '#2f7fd0',
      light: '#1f5b9c',
      pale: '#16467a',
    },
    ui: {
      bg: '#eef4fb',
      panel: 'rgba(255, 255, 255, 0.68)',
      panelSolid: '#ffffff',
      panelBorder: 'rgba(29, 95, 168, 0.16)',
      panelBorderStrong: 'rgba(29, 95, 168, 0.36)',
      text: '#223a55',
      textDim: '#5a7391',
      textBright: '#0b1f36',
    },
  },
]

export const DEFAULT_THEME: ThemeId = 'ocean'

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
