import type { CSSProperties } from 'react'
import { FlowChart } from '../primitives/FlowChart'

export interface TreemapNode {
  label: string
  value: number
  deviation?: number
}

export interface TreemapProps {
  nodes?: TreemapNode[]
  height?: number
  format?: (value: number) => string
  onDrill?: (node: TreemapNode) => void
  style?: CSSProperties
}

function colorFor(dev: number | undefined): string {
  if (dev == null) return 'var(--viz-neutral)'
  if (dev > 0.1) return 'var(--viz-negative)'
  if (dev > 0) return 'var(--viz-3)'
  return 'var(--viz-positive)'
}

export function Treemap({ nodes = [], height = 280, format, onDrill, style }: TreemapProps) {
  const data = nodes.map((n) => ({ label: n.label, value: n.value, color: colorFor(n.deviation) }))

  return (
    <FlowChart
      type="treemap"
      height={height}
      format={format}
      style={style}
      series={[{ label: 'Treemap', data }]}
      onSelect={onDrill ? (p: unknown) => {
        const params = p as { name?: string }
        const hit = nodes.find((n) => n.label === params.name)
        if (hit) onDrill(hit)
      } : undefined}
      ariaLabel="Gasto por region, tamano por valor y color por desvio vs presupuesto"
    />
  )
}
