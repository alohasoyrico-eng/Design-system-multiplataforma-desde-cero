import type { CSSProperties } from 'react'
import { ControlShell } from '../primitives/ControlShell'
import css from './InputPhone.module.css'

export interface InputPhoneProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  prefix?: string
  size?: 'sm' | 'md'
  disabled?: boolean
  invalid?: boolean
  style?: CSSProperties
}

function formatPhone(digits: string): string {
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`
  if (digits.length <= 9) return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`
}

export function InputPhone({
  id,
  value = '',
  onChange,
  placeholder = '55 1234 5678',
  prefix = '+52',
  size = 'md',
  disabled,
  invalid,
  style,
}: InputPhoneProps) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  const displayed = formatPhone(digits)

  const handleInput = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '').slice(0, 10)
    onChange?.(cleaned)
  }

  return (
    <ControlShell
      size={size}
      disabled={disabled}
      invalid={invalid}
      leading={<span className={css.prefix}>{prefix}</span>}
      style={style}
    >
      <input
        id={id}
        className={css.input}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={displayed}
        onChange={e => handleInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
      />
    </ControlShell>
  )
}
