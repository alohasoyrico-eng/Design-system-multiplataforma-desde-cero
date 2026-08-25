import type { CSSProperties } from 'react'
import css from './ChartLegend.module.css'

export interface ChartLegendItem {
  label: string
  color: string
  value?: string
  icon?: string
  shape?: 'circle' | 'square' | 'line'
}

export interface ChartLegendProps {
  items: ChartLegendItem[]
  direction?: 'horizontal' | 'vertical'
  style?: CSSProperties
}

export function ChartLegend({ items, direction = 'horizontal', style }: ChartLegendProps) {
  return (
    <div className={css.root} data-direction={direction} style={style}>
      {items.map((it) => (
        <span key={it.label} className={css.item}>
          {it.icon && (
            <span className={`flow-icon ${css.icon}`} aria-hidden="true" style={{ color: it.color }}>
              {it.icon}
            </span>
          )}
          <span
            className={css.swatch}
            aria-hidden="true"
            data-shape={it.shape || undefined}
            style={{ background: it.color }}
          />
          <span className={css.label}>{it.label}</span>
          {it.value && <span className={css.value}>{it.value}</span>}
        </span>
      ))}
    </div>
  )
}
