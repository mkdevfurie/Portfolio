import type { ProjectStatus } from '@/types/content'

export function Tag({ label }: { label: string }) {
  return <span className="tag">{label}</span>
}

const STATUS_CLASS: Record<ProjectStatus, string> = {
  'Livré': 'status status--livre',
  'En cours': 'status status--encours',
  Pause: 'status status--pause',
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={STATUS_CLASS[status] ?? STATUS_CLASS['Livré']}>{status}</span>
}
