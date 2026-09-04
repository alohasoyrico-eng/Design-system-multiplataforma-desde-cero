import { useState, type CSSProperties } from 'react'
import { EmptyState } from '../primitives/EmptyState'
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
  /** Exactamente la barra maxima va en acento; con empate, ninguna. */
  highlightMax?: boolean
  format?: (value: number) => string | number
  style?: CSSProperties
}

export function Bars({ data = [], height = 200, color, highlightMax = false, format, style }: BarsProps) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const [hover, setHover] = useState(-1)
  const barColor = color || 'var(--viz-1)'
  const fmt = format || ((v: number) => v)

  // brs-v1: sin datos no hay rejilla vacia, hay estado vacio con texto.
  if (!data.length) {
    return <EmptyState icon="bar_chart" title="Sin datos" description="No hay datos para este periodo." />
  }

  // brs-1: con empate en el maximo, ninguna barra va en acento.
  const cuantosMax = data.filter((d) => d.value === max).length

  return (
    <div className={css.root} style={{ height, ...style }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100
        const isMax = d.value === max
        const acentuada = highlightMax && isMax && cuantosMax === 1
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
              data-max={acentuada || undefined}
              style={{
                height: `${pct}%`,
                background: acentuada ? 'var(--viz-accent)' : d.color || barColor,
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
