import type { CSSProperties } from 'react'
import css from './CircularProgress.module.css'

export interface CircularProgressProps {
  value?: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
  showValue?: boolean
  tone?: 'accent' | 'success' | 'warning' | 'danger'
  style?: CSSProperties
}

const TONE_COLOR: Record<string, string> = {
  accent: 'var(--action-accent)',
  success: 'var(--status-success)',
  warning: 'var(--status-warning)',
  danger: 'var(--status-danger)',
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 56,
  strokeWidth = 5,
  label,
  showValue = false,
  tone = 'accent',
  style,
}: CircularProgressProps) {
  // cpr-2: el valor se recorta al rango y el anillo no se pasa de vuelta.
  const clamped = Math.max(0, Math.min(max, value))
  const pct = Math.max(0, Math.min(1, max > 0 ? clamped / max : 0))
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const color = TONE_COLOR[tone] || TONE_COLOR.accent

  return (
    <div
      className={css.root}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      style={style}
    >
      <span className={css.ring} style={{ width: size, height: size }}>
        <svg className={css.svg} width={size} height={size}>
          <circle
            className={css.track}
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={strokeWidth}
          />
          <circle
            className={css.arc}
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
          />
        </svg>
        {showValue && (
          <span className={css.value} style={{ fontSize: size * 0.24 }}>
            {Math.round(pct * 100)}%
          </span>
        )}
      </span>
      {label && <span className={css.label}>{label}</span>}
    </div>
  )
}
