import { useState } from 'react'
import { useIntl } from 'react-intl'
import { ControlShell } from '../primitives/shells/ControlShell'
import { Popover } from '../primitives/shells/Popover'
import { Calendar } from '../primitives/Calendar'
import css from './DateRangePicker.module.css'

export interface DateRangePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

function formatShort(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

function formatFull(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
}

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function parseRange(value?: string): [string | null, string | null] {
  if (!value?.includes('|')) return [null, null]
  const [s, e] = value.split('|')
  return [s, e]
}

export function DateRangePicker({ value, onChange, placeholder }: DateRangePickerProps) {
  const intl = useIntl()
  const resolvedPlaceholder = placeholder ?? intl.formatMessage({ id: 'common.selectRange', defaultMessage: 'Seleccionar rango' })

  const [pendingStart, setPendingStart] = useState<string | null>(null)
  const [startDate, endDate] = parseRange(value)

  let formatted = ''
  if (startDate && endDate) {
    formatted = `${formatShort(startDate)} – ${formatFull(endDate)}`
  }

  const selected: string[] = []
  if (pendingStart) selected.push(pendingStart)
  if (startDate) selected.push(startDate)
  if (endDate) selected.push(endDate)

  const hint = pendingStart ? `${formatShort(pendingStart)} – …` : undefined

  const trigger = (
    <ControlShell
      leading={<span className="flow-icon" aria-hidden="true">date_range</span>}
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
            selected={selected}
            rangeStart={startDate ?? undefined}
            rangeEnd={endDate ?? undefined}
            hint={hint}
            onSelect={(date) => {
              if (!pendingStart) {
                setPendingStart(date)
              } else {
                const [a, b] = date < pendingStart ? [date, pendingStart] : [pendingStart, date]
                onChange?.(`${a}|${b}`)
                setPendingStart(null)
                close()
              }
            }}
            onClear={() => { onChange?.(''); setPendingStart(null); close() }}
            onToday={() => { onChange?.(todayStr()); setPendingStart(null); close() }}
          />
        )}
      </Popover>
    </div>
  )
}
