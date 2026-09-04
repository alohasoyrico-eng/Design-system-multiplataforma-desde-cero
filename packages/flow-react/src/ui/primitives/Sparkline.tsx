import type { CSSProperties } from 'react'

export interface SparklineProps {
  values?: number[]
  width?: number
  height?: number
  color?: string
  showDot?: boolean
  style?: CSSProperties
}

export function Sparkline({ values = [], width = 120, height = 40, color, showDot = true, style }: SparklineProps) {
  // spk-1: con cero valores no dibuja nada ni ocupa hueco.
  if (!values.length) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const plana = max === min
  // spk-1 y spk-2: un solo valor o todos iguales dan una linea plana centrada,
  // no un NaN por dividir entre length-1 ni una linea pegada al fondo.
  const yDe = (v: number) => (plana ? height / 2 : height - ((v - min) / (max - min)) * (height - 4) - 2)
  const pts = values.length === 1
    ? [`0,${height / 2}`, `${width},${height / 2}`]
    : values.map((v, i) => `${(i / (values.length - 1)) * width},${yDe(v)}`)
  const last = values[values.length - 1]
  const lastX = width
  const lastY = yDe(last)
  const fill = color || 'var(--viz-1)'

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', ...style }}
      aria-hidden="true"
    >
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={fill}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDot && (
        <circle cx={lastX} cy={lastY} r={3} fill={fill} />
      )}
    </svg>
  )
}
