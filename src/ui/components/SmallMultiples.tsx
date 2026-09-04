import type { CSSProperties } from 'react'
import css from './SmallMultiples.module.css'

export interface SmallMultiplesItem {
  id: string
  label: string
  /** smm-1: todas las celdas comparten la misma escala Y — comparar formas
      con escalas distintas es una trampa visual. */
  values: number[]
}

export interface SmallMultiplesProps {
  items: SmallMultiplesItem[]
  height?: number
  columns?: number
  isOutlier?: (item: SmallMultiplesItem) => boolean
  format?: (value: number) => string | number
  onSelect?: (item: SmallMultiplesItem) => void
  selectedId?: string
  style?: CSSProperties
}

export function SmallMultiples({
  items,
  height = 46,
  columns = 4,
  isOutlier,
  format,
  onSelect,
  selectedId,
  style,
}: SmallMultiplesProps) {
  if (!items.length) {
    return (
      <div className={css.empty} style={style}>
        <span className={`flow-symbol flow-symbol--lg ${css.emptyIcon}`} aria-hidden="true">bar_chart</span>
        Sin datos para este periodo
      </div>
    )
  }

  // smm-1: escala Y compartida entre todas las celdas.
  // smm-2: una entidad sin valores o con una sola muestra no rompe la escala.
  const all = items.flatMap((it) => it.values)
  const min = all.length ? Math.min(...all) : 0
  const max = all.length ? Math.max(...all) : 1
  const span = max - min || 1

  const sparkline = (values: number[], color: string) => {
    const w = 140
    const py = (v: number) => height - 4 - ((v - min) / span) * (height - 8)
    const pts = values.length === 1
      ? `3,${py(values[0])} ${w - 3},${py(values[0])}`
      : values.map((v, i) => `${3 + (i / (values.length - 1)) * (w - 6)},${py(v)}`).join(' ')
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} aria-hidden="true" style={{ display: 'block' }}>
        {values.length > 0 && (
          <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    )
  }

  return (
    <div className={css.root} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, ...style }}>
      {items.map((it) => {
        const out = isOutlier ? isOutlier(it) : false
        const sel = it.id === selectedId
        const last = it.values[it.values.length - 1]
        return (
          <button
            key={it.id}
            type="button"
            className={css.card}
            data-clickable={onSelect ? '' : undefined}
            data-selected={sel || undefined}
            onClick={onSelect ? () => onSelect(it) : undefined}
          >
            <div className={css.header}>
              <span className={css.cardLabel}>{it.label}</span>
              {out && <span className={`flow-symbol ${css.outlierIcon}`} aria-hidden="true">priority_high</span>}
              <span className={css.cardValue} data-outlier={out || undefined} style={!out ? { marginLeft: 'auto' } : undefined}>
                {format ? format(last) : last}
              </span>
            </div>
            {sparkline(it.values, out ? 'var(--viz-negative)' : 'var(--viz-neutral)')}
          </button>
        )
      })}
    </div>
  )
}
