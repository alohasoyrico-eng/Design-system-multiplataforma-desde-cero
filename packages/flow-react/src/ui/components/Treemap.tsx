import { useState, useId, type CSSProperties, type KeyboardEvent } from 'react'
import { useT } from '../../i18n/useSafeIntl'
import { FlowChart } from '../primitives/FlowChart'
import { EmptyState } from '../primitives/EmptyState'

// tmp-3: lista paralela al lienzo — un solo tab stop, flechas recorren,
// Enter perfora. Invisible al ojo (el lienzo ya lo dibuja), real al oido.
const SR: CSSProperties = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }

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
  const t = useT()
  const uid = useId()
  const [activeIdx, setActiveIdx] = useState(0)

  // tmp-v1: sin datos no hay lienzo vacio, hay estado vacio con texto.
  // (Despues de los hooks: un early-return antes rompe rules-of-hooks.)
  if (!nodes.length) {
    return <EmptyState icon="grid_view" title="Sin datos" description="No hay datos para este periodo." />
  }
  const data = nodes.map((n, i) => ({ label: n.label, value: n.value, color: n.color || autoColor(n.deviation, i, CAT_PALETTE) }))

  const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setActiveIdx(i => Math.min(nodes.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)) }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIdx(0) }
    else if (e.key === 'End') { e.preventDefault(); setActiveIdx(nodes.length - 1) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (nodes[activeIdx]) onDrill?.(nodes[activeIdx]) }
  }

  return (
    <>
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
      ariaLabel={t('treemap.chart', 'Gasto por región, tamaño por valor y color por desvío vs presupuesto')}
    />
      {onDrill && (
        <div
          role="listbox"
          tabIndex={0}
          aria-label={t('treemap.regions', 'Regiones del treemap')}
          aria-activedescendant={`${uid}-opt-${activeIdx}`}
          style={SR}
          onKeyDown={onListKeyDown}
        >
          {nodes.map((n, i) => (
            <div key={n.label} id={`${uid}-opt-${i}`} role="option" aria-selected={i === activeIdx}>
              {`${n.label}: ${format ? format(n.value) : n.value}`}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
