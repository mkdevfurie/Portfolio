import { useContext, useMemo } from 'react'
import { ContentContext } from './context'

export function useContent() {
  return useContext(ContentContext)
}

export function useSettings() {
  return useContent().content.settings
}

export function useProjects() {
  const { content } = useContent()
  return useMemo(
    () => [...content.projects].sort((a, b) => a.order - b.order),
    [content.projects],
  )
}

export function useSkills() {
  const { content } = useContent()
  return useMemo(
    () => [...content.skills].sort((a, b) => a.order - b.order),
    [content.skills],
  )
}

export function useExperience() {
  const { content } = useContent()
  return useMemo(
    () => [...content.experience].sort((a, b) => a.order - b.order),
    [content.experience],
  )
}

export function useServices() {
  const { content } = useContent()
  return useMemo(
    () => [...content.services].sort((a, b) => a.order - b.order),
    [content.services],
  )
}
