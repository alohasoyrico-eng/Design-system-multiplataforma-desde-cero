import { Avatar } from '@alohasoyrico-eng/flow-react'
import { Button } from '@alohasoyrico-eng/flow-react'
import { IconButton } from '@alohasoyrico-eng/flow-react'
import { Progress } from '@alohasoyrico-eng/flow-react'
import { Card } from '@alohasoyrico-eng/flow-react'
import { statusBadge } from '../utils/statusBadge'
import type { Unit } from '../data/types'
import css from './DetailPanel.module.css'

export interface DetailPanelProps {
  unit: Unit | undefined
  onClose: () => void
  onDelete: () => void
}

export function DetailPanel({ unit, onClose, onDelete }: DetailPanelProps) {
  if (!unit) return null
  return (
    <aside aria-label={'Detalle ' + unit.plate} className={css.detailPanel}>
      <div className={css.detailHeader}>
        <div className={css.detailPlate}>{unit.plate}</div>
        <IconButton icon="close" ariaLabel="Cerrar detalle" onClick={onClose} />
      </div>
      {statusBadge(unit.status)}
      <div className={css.detailDriver}>
        <Avatar name={unit.driver} status={unit.status === 'ruta' ? 'busy' : 'offline'} />
        <div>
          <div className={css.detailDriverName}>{unit.driver}</div>
          <div className={css.detailDriverMeta}>{unit.type} · hoy {unit.trips} viajes</div>
        </div>
      </div>
      <div className={css.statGrid}>
        <Card padding={14}>
          <div className={css.statLabel}>KM HOY</div>
          <div className={css.statValue}>{unit.km}</div>
        </Card>
        <Card padding={14}>
          <div className={css.statLabel}>VIAJES</div>
          <div className={css.statValue}>{unit.trips}</div>
        </Card>
      </div>
      <Progress label="Combustible" value={unit.fuel} showValue tone={unit.fuel < 40 ? 'warning' : 'accent'} />
      <div className={css.detailFooter}>
        <Button variant="secondary" icon="edit" style={{ flex: 1 }}>Editar</Button>
        <Button variant="danger" icon="delete" onClick={onDelete}>Eliminar</Button>
      </div>
    </aside>
  )
}
