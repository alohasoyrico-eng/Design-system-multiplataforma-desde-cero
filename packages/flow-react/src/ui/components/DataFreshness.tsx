import type { CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import { Button } from '../primitives/Button'
import css from './DataFreshness.module.css'

export interface DataFreshnessProps {
  /** Texto ya formateado («datos al miércoles 12:40»): el formato de fechas es del producto. */
  updatedLabel: string
  /** «ingesta a día vencido» */
  cadence?: string
  /** «próximo refresco en 15 min» */
  nextRefresh?: string
  /** Sin él, la barra es solo lectura: no hay botón. */
  onRefresh?: () => void
  /** Carga en el botón y lo bloquea: sin doble disparo. */
  refreshing?: boolean
  refreshLabel?: string
  style?: CSSProperties
}

export function DataFreshness({
  updatedLabel,
  cadence,
  nextRefresh,
  onRefresh,
  refreshing,
  refreshLabel,
  style,
}: DataFreshnessProps) {
  const intl = useIntl()
  const resolvedRefreshLabel =
    refreshLabel ?? intl.formatMessage({ id: 'common.refresh', defaultMessage: 'Actualizar' })
  const meta = [updatedLabel, cadence, nextRefresh].filter(Boolean).join(' · ')
  return (
    <div className={css.root} style={style}>
      <span className={css.meta} aria-live="polite">
        {meta}
      </span>
      {onRefresh && (
        <Button variant="ghost" size="sm" icon="refresh" loading={refreshing} onClick={onRefresh}>
          {resolvedRefreshLabel}
        </Button>
      )}
    </div>
  )
}
