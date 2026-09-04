import type { CSSProperties } from 'react'
import css from './LimitBar.module.css'

export interface LimitBarProps {
  label: string
  current: number
  max: number
  style?: CSSProperties
}

export function LimitBar({ label, current, max, style }: LimitBarProps) {
  const pct = max > 0 ? (current / max) * 100 : 0

  return (
    <div className={css.root} style={style}>
      <div className={css.header}>
        <span className={css.label}>{label}</span>
        <span className={css.values}>
          ${current.toLocaleString()} / ${max.toLocaleString()}
        </span>
      </div>
      <div className={css.track}>
        <div className={css.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
