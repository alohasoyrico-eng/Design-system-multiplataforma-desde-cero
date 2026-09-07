import type { CSSProperties } from 'react'
import css from './LimitBar.module.css'

export interface LimitBarProps {
  label: string
  current: number
  max: number
  /** Qué significa cruzar el 100%: en un techo (`cap`, default) es un
      problema — danger; en un objetivo (`goal`) es la meta cumplida —
      success. Cazado en eOne: su objetivo de unidades (≥ 92%) pintaba
      danger justo al cumplirse. */
  kind?: 'cap' | 'goal'
  /** Formatea los valores del encabezado. Por defecto, moneda con $ — el
      origen wallet de la pieza; un techo de litros o un objetivo en % pasan
      el suyo (cazado en eOne, 7-sep: pintaba «$70.952,8» para litros). */
  format?: (value: number) => string
  style?: CSSProperties
}

export function LimitBar({ label, current, max, kind = 'cap', format, style }: LimitBarProps) {
  const pct = max > 0 ? (current / max) * 100 : 0
  const fmt = format ?? ((value: number) => `$${value.toLocaleString()}`)
  const crossed = pct >= 100
  const state = crossed ? (kind === 'goal' ? 'met' : 'over') : undefined

  return (
    <div className={css.root} style={style}>
      <div className={css.header}>
        <span className={css.label}>{label}</span>
        <span className={css.values} data-state={state}>
          {fmt(current)} / {fmt(max)}
        </span>
      </div>
      <div className={css.track}>
        {/* El relleno se ACOTA al 100% — sin tope, un 111% desbordaba la
            pista redondeada. Cruzar el límite se dice con color según
            `kind`, no saliéndose del carril. */}
        <div
          className={css.fill}
          data-state={state}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  )
}
