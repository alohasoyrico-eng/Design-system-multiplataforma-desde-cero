import type { CSSProperties } from 'react'
import css from './BulletChart.module.css'
import { ChartLegend } from './ChartLegend'

export interface BulletRow {
  label: string
  value: number
  target: number
  prev?: number
  max?: number
  color?: string
  icon?: string
}

export interface BulletChartProps {
  rows: BulletRow[]
  color?: string
  format?: (value: number) => string
  style?: CSSProperties
}

export function BulletChart(props: BulletChartProps) {
  const { rows, color, format, style } = props
  const fallback = color || 'var(--viz-1)'
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
        const barColor = r.color || fallback

        return (
          <div key={i} className={css.row}>
            <span className={css.label}>
              {r.icon && <span className="flow-icon" aria-hidden="true" style={{ fontSize: 15, color: barColor }}>{r.icon}</span>}
              {r.label}
            </span>
            <div className={css.track}>
              {prevPct != null && (
                <span className={css.prev} aria-hidden="true" style={{ width: `${prevPct}%` }} />
              )}
              <span className={css.bar} aria-hidden="true" data-over={over || undefined} style={{ width: `${pct}%`, background: over ? undefined : barColor }} />
              <span className={css.target} aria-hidden="true" style={{ left: `${tPct}%` }} />
            </div>
            <span className={css.value} data-over={over || undefined}>
              {format ? format(r.value) : r.value}
            </span>
          </div>
        )
      })}
      <ChartLegend
        items={[
          { label: 'Real', color: fallback, shape: 'square' },
          { label: 'Meta', color: 'var(--text-primary)', shape: 'line' },
          { label: 'Periodo anterior', color: 'var(--border-strong)' },
        ]}
      />
    </div>
  )
}
