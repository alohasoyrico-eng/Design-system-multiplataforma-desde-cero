import type { CSSProperties } from 'react'
import css from './ScaleLegend.module.css'

/* scl-1: la leyenda de una ESCALA — un rango continuo cortado en tramos, de
   menor a mayor. Tres decisiones de nacimiento (dueño de eOne, 8-sep, la
   escala de precio de su red de afiliados):

     · TONOS DE UN MISMO COLOR, no un semáforo: verde→rojo dice bueno/malo,
       y un rango no juzga — solo ordena. El default es --viz-scale-*.
     · LA GEOMETRÍA CRECE con el valor: cada tramo es un paso más alto, así
       la dirección se lee incluso sin distinguir tonos.
     · ICONOGRAFÍA de refuerzo opcional: el mismo icono chico en el mínimo
       y grande en el máximo.

   La casilla de ausencia de dato va aparte de la escala: «sin dato» no es
   un valor del rango y no puede parecer su primer tramo. */

export interface ScaleLegendProps {
  minLabel: string
  maxLabel: string
  /** Refuerzo temático: chico junto al mínimo, grande junto al máximo. */
  icon?: string
  /** Swatches de menor a mayor. Default: la escala de color del sistema. */
  colors?: string[]
  /** Casilla de ausencia de dato, separada de la escala. */
  emptyLabel?: string
  emptyColor?: string
  style?: CSSProperties
}

const DEFAULT_COLORS = [
  'var(--viz-scale-1)',
  'var(--viz-scale-2)',
  'var(--viz-scale-3)',
  'var(--viz-scale-4)',
  'var(--viz-scale-5)',
]

/** Altura del primer y del último paso, en px. */
const STEP_MIN = 8
const STEP_MAX = 20

export function ScaleLegend({
  minLabel,
  maxLabel,
  icon,
  colors = DEFAULT_COLORS,
  emptyLabel,
  emptyColor = 'var(--viz-neutral)',
  style,
}: ScaleLegendProps) {
  const n = Math.max(colors.length, 2)

  return (
    <div className={css.root} style={style}>
      {icon && (
        <span className={`flow-symbol ${css.iconMin}`} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={css.label}>{minLabel}</span>
      <span
        className={css.steps}
        role="img"
        aria-label={`Escala de ${colors.length} tramos, de ${minLabel.toLowerCase()} a ${maxLabel.toLowerCase()}`}
      >
        {colors.map((color, index) => (
          <span
            key={index}
            className={css.step}
            style={{
              background: color,
              height: Math.round(STEP_MIN + (index * (STEP_MAX - STEP_MIN)) / (n - 1)),
            }}
          />
        ))}
      </span>
      {/* El icono grande ANTES de su etiqueta, como el chico (dueño de
          eOne, 8-sep): icono→texto en los dos extremos, no en espejo. */}
      {icon && (
        <span className={`flow-symbol ${css.iconMax}`} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={css.label}>{maxLabel}</span>

      {emptyLabel && (
        <span className={css.empty}>
          <span className={css.emptySwatch} style={{ background: emptyColor }} aria-hidden="true" />
          <span className={css.label}>{emptyLabel}</span>
        </span>
      )}
    </div>
  )
}
