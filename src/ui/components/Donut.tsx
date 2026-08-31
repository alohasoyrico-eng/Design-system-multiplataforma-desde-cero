import type { CSSProperties } from 'react'
import { FlowChart } from '../primitives/FlowChart'
import { ChartLegend } from '../primitives/ChartLegend'
import css from './Donut.module.css'

export interface DonutSegment {
  label: string
  value: number
  color?: string
  icon?: string
}

export interface DonutProps {
  segments?: DonutSegment[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerValue?: string | number
  legend?: boolean
  style?: CSSProperties
}

export function Donut({ segments = [], size = 160, centerLabel, centerValue, legend = true, style }: DonutProps) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1

  const pick = segments.length <= 3
    ? ['var(--viz-1)', 'var(--viz-accent)', 'var(--viz-neutral)']
    : [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `var(--viz-${n})`)
  const colored = segments.map((s, i) => ({ ...s, color: s.color || pick[i % pick.length] }))

  const chart = (
    <FlowChart
      type="donut"
      height={size}
      legend={false}
      series={[{ label: 'Donut', data: colored }]}
      ariaLabel={`Reparto: ${segments.map((s) => s.label).join(', ')}`}
    />
  )

  const center = (centerValue != null || centerLabel) && (
    <div className={css.center}>
      {centerValue != null && (
        <div className={css.centerValue}>{centerValue}</div>
      )}
      {centerLabel && (
        <div className={css.centerLabel}>{centerLabel}</div>
      )}
    </div>
  )

  return (
    <div className={css.root} style={style}>
      <div className={css.ring} style={{ width: size, height: size }}>
        {chart}
        {center}
      </div>
      {legend && (
        <ChartLegend
          direction="vertical"
          style={{ minWidth: 0, flex: 1 }}
          items={colored.map((s) => ({
            label: s.label,
            color: s.color,
            value: Math.round(s.value / total * 100) + '%',
            icon: s.icon,
          }))}
        />
      )}
    </div>
  )
}
