import { useState, useRef } from 'react'
import { useIntl } from 'react-intl'
import { ControlShell } from '../primitives/shells/ControlShell'
import css from './DatePicker.module.css'

export interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  const intl = useIntl()
  const resolvedPlaceholder = placeholder ?? intl.formatMessage({ id: 'common.selectDate', defaultMessage: 'Seleccionar fecha' })
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const formatted = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <div ref={ref} className={css.root}>
      <ControlShell
        leading={<span className="flow-icon" style={{ fontSize: 18 }} aria-hidden="true">calendar_today</span>}
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer' }}
      >
        <span className={css.display} data-empty={!value || undefined}>
          {formatted || resolvedPlaceholder}
        </span>
      </ControlShell>
      {open && (
        <div className={css.drop}>
          <input
            type="date"
            className={css.input}
            value={value || ''}
            onChange={(e) => { onChange?.(e.target.value); setOpen(false) }}
          />
        </div>
      )}
    </div>
  )
}
