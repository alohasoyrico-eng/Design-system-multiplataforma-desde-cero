import type { CSSProperties } from 'react'
import css from './BulletChart.module.css'

export interface BulletRow {
  label: string
  value: number
  target: number
  prev?: number
  max?: number
}

export interface BulletChartProps {
  rows: BulletRow[]
  format?: (value: number) => string
  style?: CSSProperties
}

export function BulletChart(props: BulletChartProps) {
  const { rows, format, style } = props
  if (!rows || !rows.length) {
    return (
      <div className={css.empty} style={style}>
        <span className="flow-icon" aria-hidden="true" style={{ fontSize: 22 }}>bar_chart</span>
        Sin datos para este periodo
      </div>
    )
  }

  const gmax = Math.max(...rows.map((r) => r.max || Math.max(r.value, r.target) * 1.2), 1)

  return (
    <div className={css.root} style={style}>
      {rows.map((r, i) => {
        const over = r.value > r.target
        const pct = Math.min(100, (r.value / gmax) * 100)
        const tPct = Math.min(100, (r.target / gmax) * 100)
        const prevPct = r.prev != null ? Math.min(100, (r.prev / gmax) * 100) : null

        return (
          <div key={i} className={css.row}>
            <span className={css.label}>{r.label}</span>
            <div className={css.track}>
              {prevPct != null && (
                <span className={css.prev} aria-hidden="true" style={{ width: `${prevPct}%` }} />
              )}
              <span className={css.bar} aria-hidden="true" data-over={over || undefined} style={{ width: `${pct}%` }} />
              <span className={css.target} aria-hidden="true" style={{ left: `${tPct}%` }} />
            </div>
            <span className={css.value} data-over={over || undefined}>
              {format ? format(r.value) : r.value}
            </span>
          </div>
        )
      })}
      <div className={css.legend}>
        <span className={css.legendItem}>
          <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--flow-red-500)' }} />
          Real
        </span>
        <span className={css.legendItem}>
          <span aria-hidden="true" style={{ width: 2.5, height: 12, background: 'var(--flow-ink-900)' }} />
          Meta
        </span>
        <span className={css.legendItem}>
          <span aria-hidden="true" style={{ width: 10, height: 6, borderRadius: 3, background: 'var(--border-strong)', opacity: 0.5 }} />
          Periodo anterior
        </span>
      </div>
    </div>
  )
}
