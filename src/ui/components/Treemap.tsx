import type { CSSProperties } from 'react'
import { FlowChart } from '../primitives/FlowChart'

export interface TreemapNode {
  label: string
  value: number
  deviation?: number
  color?: string
}

export interface TreemapProps {
  nodes?: TreemapNode[]
  height?: number
  format?: (value: number) => string
  onDrill?: (node: TreemapNode) => void
  style?: CSSProperties
}

function autoColor(dev: number | undefined, index: number, palette: string[]): string {
  if (dev != null) {
    if (dev > 0.1) return 'var(--viz-negative)'
    if (dev < -0.05) return 'var(--viz-positive)'
  }
  return palette[index % palette.length]
}

const CAT_PALETTE = ['var(--viz-1)', 'var(--viz-4)', 'var(--viz-5)', 'var(--viz-3)', 'var(--viz-6)', 'var(--viz-2)']

export function Treemap({ nodes = [], height = 280, format, onDrill, style }: TreemapProps) {
  const data = nodes.map((n, i) => ({ label: n.label, value: n.value, color: n.color || autoColor(n.deviation, i, CAT_PALETTE) }))

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
