import { useState, type CSSProperties } from 'react'
import { ControlShell } from './ControlShell'
import css from './Textarea.module.css'

export interface TextareaProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  /** Activa el contador en la zona de pie de la carcasa. */
  maxLength?: number
  disabled?: boolean
  invalid?: boolean
  style?: CSSProperties
}

export function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
  disabled,
  invalid,
  style,
}: TextareaProps) {
  const [innerLen, setInnerLen] = useState(value?.length ?? 0)
  const len = value != null ? value.length : innerLen
  const count = maxLength != null ? Math.min(len, maxLength) : len

  const handleChange = (raw: string) => {
    const next = maxLength != null ? raw.slice(0, maxLength) : raw
    setInnerLen(next.length)
    onChange?.(next)
  }

  return (
    <ControlShell
      disabled={disabled}
      invalid={invalid}
      style={style}
      footer={maxLength != null ? <span className={css.counter}>{count}/{maxLength}</span> : undefined}
    >
      <textarea
        id={id}
        className={css.textarea}
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={invalid || undefined}
      />
    </ControlShell>
  )
}
