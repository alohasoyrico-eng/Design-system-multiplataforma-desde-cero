import { useIntl } from 'react-intl'
import { ControlShell } from '../primitives/ControlShell'
import { Popover } from '../primitives/Popover'
import { Calendar } from '../primitives/Calendar'
import css from './DatePicker.module.css'

export interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

function formatFull(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
}

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  const intl = useIntl()
  const resolvedPlaceholder = placeholder ?? intl.formatMessage({ id: 'common.selectDate', defaultMessage: 'Seleccionar fecha' })

  const formatted = value ? formatFull(value) : ''

  const trigger = (
    <ControlShell
      leading={<span className="flow-icon" aria-hidden="true">calendar_today</span>}
      style={{ cursor: 'pointer' }}
    >
      <span className={css.display} data-empty={!formatted || undefined}>
        {formatted || resolvedPlaceholder}
      </span>
    </ControlShell>
  )

  return (
    <div className={css.root}>
      <Popover trigger={trigger} align="left">
        {({ close }) => (
          <Calendar
            selected={value ? [value] : []}
            onSelect={(date) => { onChange?.(date); close() }}
            onClear={() => { onChange?.(''); close() }}
            onToday={() => { onChange?.(todayStr()); close() }}
          />
        )}
      </Popover>
    </div>
  )
}
