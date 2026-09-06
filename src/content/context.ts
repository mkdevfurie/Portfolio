import { createContext } from 'react'
import { fallbackContent } from './fallback'
import type { ContentSource, PortfolioContent } from '@/types/content'

export interface ContentState {
  content: PortfolioContent
  source: ContentSource
  loading: boolean
}

export const ContentContext = createContext<ContentState>({
  content: fallbackContent,
  source: 'fallback',
  loading: true,
})
