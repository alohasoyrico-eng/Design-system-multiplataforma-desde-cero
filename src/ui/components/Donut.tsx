import type { CSSProperties } from 'react'
import { FlowChart } from '../primitives/FlowChart'
import { ChartLegend } from './ChartLegend'

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
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 1,
    }}>
      {centerValue != null && (
        <div style={{ font: 'var(--type-data-lg)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {centerValue}
        </div>
      )}
      {centerLabel && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {centerLabel}
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', ...style }}>
      <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
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
