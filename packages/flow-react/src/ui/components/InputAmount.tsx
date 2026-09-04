import { useRef, type CSSProperties } from 'react'
import { ControlShell } from '../primitives/ControlShell'
import css from './InputAmount.module.css'

export interface InputAmountProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  currency?: string
  locale?: string
  size?: 'sm' | 'md'
  disabled?: boolean
  invalid?: boolean
  style?: CSSProperties
}

function formatAmount(raw: string, locale: string): string {
  const digits = raw.replace(/[^\d.]/g, '')
  const parts = digits.split('.')
  const intPart = parts[0] || ''
  const decPart = parts.length > 1 ? parts[1] : undefined

  if (!intPart && decPart === undefined) return ''

  const sep = locale.startsWith('en') ? ',' : ','
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep)

  return decPart !== undefined ? `${formatted}.${decPart}` : formatted
}

function stripFormat(formatted: string): string {
  return formatted.replace(/,/g, '')
}

export function InputAmount({
  id,
  value = '',
  onChange,
  placeholder = '0.00',
  currency = '$',
  locale = 'es-MX',
  size = 'md',
  disabled,
  invalid,
  style,
}: InputAmountProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const displayed = formatAmount(value, locale)

  const handleInput = (raw: string) => {
    const cleaned = raw.replace(/[^\d.,]/g, '')
    const normalized = cleaned.replace(/,/g, '')

    const parts = normalized.split('.')
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 2) return

    onChange?.(normalized)
  }

  return (
    <ControlShell
      size={size}
      disabled={disabled}
      error={invalid}
      leading={<span className={css.currency}>{currency}</span>}
      style={style}
    >
      <input
        ref={inputRef}
        id={id}
        className={css.input}
        inputMode="decimal"
        value={displayed}
        onChange={e => handleInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
      />
    </ControlShell>
  )
}
