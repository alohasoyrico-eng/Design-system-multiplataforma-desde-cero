import { useState, useId, type CSSProperties, type KeyboardEvent } from 'react'
import { useIntl } from 'react-intl'
import { FlowChart } from '../primitives/FlowChart'
import { EmptyState } from '../primitives/EmptyState'

// sct-3: lista paralela al lienzo — un solo tab stop, flechas recorren,
// Enter selecciona. Invisible al ojo (el lienzo ya lo dibuja), real al oido.
const SR: CSSProperties = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }

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
  color?: string
  format?: { x?: (v: number) => string; y?: (v: number) => string }
  height?: number
  selectedId?: string
  onSelect?: (point: ScatterPoint) => void
  style?: CSSProperties
}

export function ScatterPlot({
  points = [], xLabel, yLabel, xThreshold, yThreshold, color, format = {},
  height = 260, selectedId, onSelect, style,
}: ScatterPlotProps) {
  const intl = useIntl()
  const uid = useId()
  const [activeIdx, setActiveIdx] = useState(0)

  // sct-v1: sin datos no hay ejes ni rejilla vacia, hay estado vacio con texto.
  // (Despues de los hooks: un early-return antes rompe rules-of-hooks.)
  if (!points.length) {
    return <EmptyState icon="scatter_plot" title="Sin datos" description="No hay datos para este periodo." />
  }
  const yDefault = intl.formatMessage({ id: 'scatter.yDefault', defaultMessage: 'Unidades' })
  // sct-3: el punto seleccionado se distingue por forma y tamano, no solo color.
  const values = points.map((p) =>
    p.id === selectedId
      ? { value: [p.x, p.y, p.label, p.id], symbol: 'diamond', symbolSize: 16 }
      : [p.x, p.y, p.label, p.id],
  )
  const fmt = format.y || format.x || ((v: number) => String(v))

  const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setActiveIdx(i => Math.min(points.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)) }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIdx(0) }
    else if (e.key === 'End') { e.preventDefault(); setActiveIdx(points.length - 1) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (points[activeIdx]) onSelect?.(points[activeIdx]) }
  }

  const lines = ([] as Record<string, unknown>[]).concat(
    xThreshold != null ? [{ xAxis: xThreshold }] : [],
    yThreshold != null ? [{ yAxis: yThreshold }] : [],
  )

  return (
    <>
    <FlowChart
      type="scatter"
      height={height}
      format={fmt}
      style={style}
      series={[{
        label: yLabel || yDefault,
        values: values as unknown as number[],
        color,
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
      {onSelect && (
        <div
          role="listbox"
          tabIndex={0}
          aria-label={`Puntos: ${yLabel || 'Y'} contra ${xLabel || 'X'}`}
          aria-activedescendant={`${uid}-opt-${activeIdx}`}
          style={SR}
          onKeyDown={onListKeyDown}
        >
          {points.map((p, i) => (
            <div key={p.id} id={`${uid}-opt-${i}`} role="option" aria-selected={p.id === selectedId}>
              {`${p.label ?? p.id}: ${fmt(p.x)}, ${fmt(p.y)}`}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
