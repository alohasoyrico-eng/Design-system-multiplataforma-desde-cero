import type { CSSProperties } from 'react'
import { FlowChart } from '../primitives/FlowChart'

export interface ScatterPoint {
  id: string
  x: number
  y: number
  label?: string
}

export interface ScatterPlotProps {
  points?: ScatterPoint[]
  xLabel?: string
  yLabel?: string
  xThreshold?: number
  yThreshold?: number
  format?: { x?: (v: number) => string; y?: (v: number) => string }
  height?: number
  selectedId?: string
  onSelect?: (point: ScatterPoint) => void
  style?: CSSProperties
}

export function ScatterPlot({
  points = [], xLabel, yLabel, xThreshold, yThreshold, format = {},
  height = 260, onSelect, style,
}: ScatterPlotProps) {
  const values = points.map((p) => [p.x, p.y, p.label, p.id])
  const fmt = format.y || format.x || ((v: number) => String(v))

  const lines = ([] as Record<string, unknown>[]).concat(
    xThreshold != null ? [{ xAxis: xThreshold }] : [],
    yThreshold != null ? [{ yAxis: yThreshold }] : [],
  )

  return (
    <FlowChart
      type="scatter"
      height={height}
      format={fmt}
      style={style}
      series={[{
        label: yLabel || 'Unidades',
        values: values as unknown as number[],
        markLine: lines.length ? {
          silent: true, symbol: 'none',
          lineStyle: { color: 'var(--viz-axis)', type: 'dashed', width: 1 },
          label: { show: false },
          data: lines,
        } : undefined,
      }]}
      onSelect={onSelect ? (p: unknown) => {
        const params = p as { value?: unknown[] }
        const hit = points.find((x) => x.id === (params.value && params.value[3]))
        if (hit) onSelect(hit)
      } : undefined}
      option={{
        grid: { bottom: xLabel ? 30 : 6, left: yLabel ? 24 : 8 },
        xAxis: { name: xLabel, nameLocation: 'middle', nameGap: 30, nameTextStyle: { fontSize: 11, color: 'var(--viz-label)' } },
        yAxis: { name: yLabel, nameLocation: 'middle', nameGap: 42, nameTextStyle: { fontSize: 11, color: 'var(--viz-label)' } },
      }}
      ariaLabel={`${yLabel || 'Y'} contra ${xLabel || 'X'}, ${points.length} unidades`}
    />
  )
}
