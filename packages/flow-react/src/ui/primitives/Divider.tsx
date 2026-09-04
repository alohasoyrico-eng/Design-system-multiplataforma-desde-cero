import type { CSSProperties } from 'react'
import css from './Divider.module.css'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  style?: CSSProperties
}

export function Divider({ orientation = 'horizontal', label, style }: DividerProps) {
  // div-1: sin label la linea es decorativa y queda oculta al lector.
  if (orientation === 'vertical') {
    return (
      <span
        role={label ? 'separator' : undefined}
        aria-orientation={label ? 'vertical' : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        className={css.vertical}
        style={style}
      />
    )
  }

  if (!label) {
    return (
      <hr
        aria-hidden="true"
        className={css.horizontal}
        style={style}
      />
    )
  }

  return (
    <div
      role="separator"
      aria-label={label}
      className={css.labeled}
      style={style}
    >
      <span className={css.line} />
      <span className={css.text}>{label}</span>
      <span className={css.line} />
    </div>
  )
}
