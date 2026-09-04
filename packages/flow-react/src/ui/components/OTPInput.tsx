import { useRef, useState, type CSSProperties } from 'react'
import css from './OTPInput.module.css'

export interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  invalid?: boolean
  disabled?: boolean
  autoFocus?: boolean
  style?: CSSProperties
}

export function OTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  invalid = false,
  disabled = false,
  autoFocus = false,
  style,
}: OTPInputProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [focus, setFocus] = useState(false)
  const digits = value.slice(0, length).split('')
  const active = Math.min(value.length, length - 1)

  const set = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, length)
    onChange?.(clean)
    if (clean.length === length) onComplete?.(clean)
  }

  return (
    <div
      className={css.root}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      onClick={() => ref.current?.focus()}
      style={style}
    >
      {Array.from({ length }, (_, i) => {
        const filled = digits[i] != null
        const isActive = focus && i === active && !disabled
        return (
          <div
            key={i}
            aria-hidden="true"
            className={css.box}
            data-filled={filled || undefined}
            data-active={isActive || undefined}
            data-invalid={invalid || undefined}
          >
            {filled
              ? <span className={css.digit}>{digits[i]}</span>
              : isActive
                ? <span className={css.caret} />
                : null}
          </div>
        )
      })}
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        aria-label={`Código de ${length} dígitos`}
        aria-invalid={invalid || undefined}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={e => set(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={css.input}
      />
    </div>
  )
}
