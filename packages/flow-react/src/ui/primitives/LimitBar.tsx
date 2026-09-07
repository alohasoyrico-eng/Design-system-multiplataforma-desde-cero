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
  /** Etiqueta arriba y valores abajo, en dos FILAS — para tarjetas
      estrechas donde la fila única obliga a envolver ambos lados en un
      dos-columnas apretado (cazado en eOne: sus tarjetas-medidor). */
  stacked?: boolean
  /** Solo la PISTA, sin encabezado — para composiciones que ya dicen
      etiqueta y valores en su propio lenguaje (las tarjetas-medidor de
      eOne hablan en el idioma del StatTile). Conserva kind y el estado
      over/met en el relleno. */
  bare?: boolean
  /** Formatea los valores del encabezado. Por defecto, moneda con $ — el
      origen wallet de la pieza; un techo de litros o un objetivo en % pasan
      el suyo (cazado en eOne, 7-sep: pintaba «$70.952,8» para litros). */
  format?: (value: number) => string
  style?: CSSProperties
}

export function LimitBar({ label, current, max, kind = 'cap', stacked, bare, format, style }: LimitBarProps) {
  const pct = max > 0 ? (current / max) * 100 : 0
  const fmt = format ?? ((value: number) => `$${value.toLocaleString()}`)
  const crossed = pct >= 100
  const state = crossed ? (kind === 'goal' ? 'met' : 'over') : undefined

  return (
    <div className={css.root} data-stacked={stacked || undefined} style={style}>
      {!bare && (
      <div className={css.header}>
        <span className={css.label}>{label}</span>
        <span className={css.values} data-state={state}>
          {fmt(current)} / {fmt(max)}
        </span>
      </div>
      )}
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
