import type { CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import { Chip } from '../primitives/Chip'
import css from './ActiveFilters.module.css'

export interface ActiveFilter {
  id: string
  dimension: string
  label: string
}

export interface ActiveFiltersProps {
  filters: ActiveFilter[]
  /** Periodo activo como chip fijo: informa, no se quita desde aquí. */
  period?: string
  onRemove: (id: string) => void
  /** Limpiar todo. Solo se ofrece con 2 o más filtros. */
  onClearAll?: () => void
  clearLabel?: string
  style?: CSSProperties
}

export function ActiveFilters({ filters, period, onRemove, onClearAll, clearLabel, style }: ActiveFiltersProps) {
  const intl = useIntl()
  if (filters.length === 0 && !period) return null
  const resolvedClearLabel =
    clearLabel ?? intl.formatMessage({ id: 'common.clearFilters', defaultMessage: 'Limpiar filtros' })
  return (
    <div
      className={css.root}
      role="region"
      aria-label={intl.formatMessage({ id: 'activeFilters.region', defaultMessage: 'Filtros activos' })}
      style={style}
    >
      <ul className={css.list}>
        {period && (
          <li className={css.item}>
            <Chip label={period} size="sm" variant="ghost" />
          </li>
        )}
        {filters.map(f => (
          <li key={f.id} className={css.item}>
            <Chip label={`${f.dimension}: ${f.label}`} size="sm" onRemove={() => onRemove(f.id)} />
          </li>
        ))}
      </ul>
      {onClearAll && filters.length >= 2 && (
        <button type="button" className={css.clear} onClick={onClearAll}>
          {resolvedClearLabel}
        </button>
      )}
    </div>
  )
}
