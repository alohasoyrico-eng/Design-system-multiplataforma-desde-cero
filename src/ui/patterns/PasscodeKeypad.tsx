import { useEffect, type CSSProperties } from 'react'
import css from './PasscodeKeypad.module.css'

export interface PasscodeKeypadProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  invalid?: boolean
  biometricIcon?: string
  onBiometric?: () => void
  style?: CSSProperties
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

export function PasscodeKeypad({
  length = 6,
  value = '',
  onChange,
  onComplete,
  invalid,
  biometricIcon,
  onBiometric,
  style,
}: PasscodeKeypadProps) {
  useEffect(() => {
    if (invalid) onChange?.('')
  }, [invalid])

  useEffect(() => {
    if (value.length === length) onComplete?.(value)
  }, [value, length])

  const press = (digit: string) => {
    if (value.length >= length) return
    onChange?.(value + digit)
  }

  const backspace = () => {
    onChange?.(value.slice(0, -1))
  }

  const filled = value.length

  return (
    <div className={css.root} style={style}>
      <div
        className={css.dots}
        role="status"
        aria-label={`${filled} de ${length} dígitos ingresados`}
        data-invalid={invalid || undefined}
      >
        {Array.from({ length }, (_, i) => (
          <span
            key={i}
            className={css.dot}
            data-filled={i < filled || undefined}
          />
        ))}
      </div>

      {invalid && (
        <div className={css.error} role="alert">Código incorrecto</div>
      )}

      <div className={css.grid}>
        {KEYS.map(k => (
          <button
            key={k}
            className={css.key}
            type="button"
            onClick={() => press(k)}
            aria-label={k}
          >
            {k}
          </button>
        ))}

        <div className={css.key} data-empty={!onBiometric || undefined}>
          {onBiometric && (
            <button
              className={css.key}
              type="button"
              onClick={onBiometric}
              aria-label="Usar biométrico"
              data-special
            >
              <span className="flow-icon" aria-hidden="true">
                {biometricIcon || 'fingerprint'}
              </span>
            </button>
          )}
        </div>

        <button
          className={css.key}
          type="button"
          onClick={() => press('0')}
          aria-label="0"
        >
          0
        </button>

        <button
          className={css.key}
          type="button"
          onClick={backspace}
          aria-label="Borrar"
          data-special
        >
          <span className="flow-icon" aria-hidden="true">backspace</span>
        </button>
      </div>
    </div>
  )
}
