import { useMemo, type CSSProperties } from 'react'
import { FlowChart } from '../primitives/FlowChart'

export interface ParetoItem {
  label: string
  value: number
}

export interface ParetoChartProps {
  data?: ParetoItem[]
  height?: number
  format?: (value: number) => string
  threshold?: number
  style?: CSSProperties
}

export function ParetoChart({ data = [], height = 240, format, threshold = 0.8, style }: ParetoChartProps) {
  const sorted = useMemo(() => [...data].sort((a, b) => b.value - a.value), [data])
  const total = sorted.reduce((a, d) => a + d.value, 0) || 1

  const itemColors = useMemo(() => {
    let acc = 0
    return sorted.map((d) => {
      const before = acc / total
      acc += d.value
      return before < threshold ? 'var(--viz-accent)' : 'var(--viz-neutral)'
    })
  }, [sorted, total, threshold])

  return (
    <FlowChart
      type="pareto"
      height={height}
      format={format}
      style={style}
      itemColors={itemColors}
      labels={sorted.map((d) => d.label)}
      series={[{ label: 'Valor', values: sorted.map((d) => d.value) }]}
      ariaLabel={`Pareto: pocas causas concentran el ${Math.round(threshold * 100)}% del total`}
    />
  )
}
