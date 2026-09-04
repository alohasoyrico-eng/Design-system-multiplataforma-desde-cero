import { Badge } from '@alohasoyrico-eng/flow-react'

export function statusBadge(s: string) {
  if (s === 'ruta') return <Badge tone="success" live>En ruta</Badge>
  if (s === 'taller') return <Badge tone="warning" icon="build">En taller</Badge>
  return <Badge>Inactiva</Badge>
}
