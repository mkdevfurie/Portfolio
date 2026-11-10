/**
 * Logos officiels des technologies (devicon, licence MIT).
 * Utilisés par défaut quand une compétence n'a pas de logo dans le CMS.
 */
import react from '@/assets/logos/react.svg'
import angular from '@/assets/logos/angular.svg'
import postgresql from '@/assets/logos/postgresql.svg'
import flutter from '@/assets/logos/flutter.svg'
import nestjs from '@/assets/logos/nestjs.svg'
import figma from '@/assets/logos/figma.svg'
import typescript from '@/assets/logos/typescript.svg'
import appInventor from '@/assets/logo-appinventor.svg'
import type { ImageRef } from '@/types/content'

const LOGOS: [RegExp, string, string][] = [
  [/react/i, react, 'React'],
  [/angular/i, angular, 'Angular'],
  [/postgre/i, postgresql, 'PostgreSQL'],
  [/flutter/i, flutter, 'Flutter'],
  [/nest/i, nestjs, 'NestJS'],
  [/figma/i, figma, 'Figma'],
  [/typescript|^ts$/i, typescript, 'TypeScript'],
  [/app ?inventor/i, appInventor, 'App Inventor'],
]

export function stackLogo(name: string): ImageRef | undefined {
  const hit = LOGOS.find(([re]) => re.test(name))
  return hit ? { src: hit[1], alt: hit[2] } : undefined
}
