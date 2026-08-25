import { useState } from 'react'
import css from './Bars.module.css'

export interface BarsDataPoint {
  label: string
  value: number
  color?: string
}

export interface BarsProps {
  data?: BarsDataPoint[]
  height?: number
  color?: string
  format?: (value: number) => string | number
}

export function Bars({ data = [], height = 200, color, format }: BarsProps) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const [hover, setHover] = useState(-1)
  const barColor = color || 'var(--viz-1)'
  const fmt = format || ((v: number) => v)

  return (
    <div className={css.root} style={{ height }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100
        const isMax = d.value === max
        return (
          <div
            key={d.label}
            className={css.column}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
          >
            {hover === i && <div className={css.tooltip}>{fmt(d.value)}</div>}
            <div
              className={css.bar}
              style={{
                height: `${pct}%`,
                background: d.color || barColor,
                opacity: hover === i || isMax ? 1 : 0.65,
              }}
            />
            <div className={css.label}>{d.label}</div>
          </div>
        )
      })}
    </div>
  )
}
