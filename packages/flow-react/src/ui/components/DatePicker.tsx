import { useState } from 'react'
import { useIntl } from 'react-intl'
import { ControlShell } from '../primitives/ControlShell'
import { Popover } from '../primitives/Popover'
import { Calendar } from '../primitives/Calendar'
import { Chip } from '../primitives/Chip'
import css from './DatePicker.module.css'

export interface DatePickerPreset {
  label: string
  /** En mode single: 'YYYY-MM-DD'. En mode range: 'inicio|fin'. */
  value: string
}

export interface DatePickerProps {
  /** single: 'YYYY-MM-DD' · range: 'inicio|fin' en ISO. */
  value?: string
  onChange?: (value: string) => void
  /** El único calendario del sistema: una fecha o un rango. Default 'single'. */
  mode?: 'single' | 'range'
  /** Fecha mínima seleccionable (ISO). */
  min?: string
  /** Fecha máxima seleccionable (ISO). */
  max?: string
  /** Atajos ("Últimos 30 días") mostrados sobre el calendario. */
  presets?: DatePickerPreset[]
  disabled?: boolean
  invalid?: boolean
  /** Id del control focusable — permite asociar <Field htmlFor>. */
  id?: string
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
  return [s || null, e || null]
}

export function DatePicker({
  value,
  onChange,
  mode = 'single',
  min,
  max,
  presets,
  disabled,
  invalid,
  id,
  placeholder,
}: DatePickerProps) {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [pendingStart, setPendingStart] = useState<string | null>(null)

  const resolvedPlaceholder = placeholder ?? (mode === 'range'
    ? intl.formatMessage({ id: 'common.selectRange', defaultMessage: 'Seleccionar rango' })
    : intl.formatMessage({ id: 'common.selectDate', defaultMessage: 'Seleccionar fecha' }))

  const [startDate, endDate] = mode === 'range' ? parseRange(value) : [null, null]

  let formatted = ''
  if (mode === 'range') {
    if (startDate && endDate) formatted = `${formatShort(startDate)} – ${formatFull(endDate)}`
  } else if (value) {
    formatted = formatFull(value)
  }

  const selected: string[] = []
  if (mode === 'range') {
    if (pendingStart) selected.push(pendingStart)
    if (startDate) selected.push(startDate)
    if (endDate) selected.push(endDate)
  } else if (value) {
    selected.push(value)
  }

  const hint = mode === 'range' && pendingStart ? `${formatShort(pendingStart)} – …` : undefined

  const handleSelect = (date: string, close: () => void) => {
    if (mode === 'single') {
      onChange?.(date)
      close()
      return
    }
    if (!pendingStart) {
      setPendingStart(date)
    } else {
      const [a, b] = date < pendingStart ? [date, pendingStart] : [pendingStart, date]
      onChange?.(`${a}|${b}`)
      setPendingStart(null)
      close()
    }
  }

  const trigger = (
    <ControlShell
      disabled={disabled}
      invalid={invalid}
      leading={<span className="flow-symbol" aria-hidden="true">{mode === 'range' ? 'date_range' : 'calendar_today'}</span>}
    >
      <span
        id={id}
        className={css.display}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-empty={!formatted || undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o) }
        }}
      >
        {formatted || resolvedPlaceholder}
      </span>
    </ControlShell>
  )

  return (
    <div className={css.root}>
      <Popover
        trigger={trigger}
        placement="bottom-start"
        open={open}
        onOpenChange={(o) => { if (!disabled) setOpen(o) }}
      >
        {({ close }) => (
          <div>
            {presets && presets.length > 0 && (
              <div className={css.presets}>
                {presets.map(p => (
                  <Chip
                    key={p.label}
                    label={p.label}
                    size="sm"
                    selected={value === p.value}
                    onClick={() => { onChange?.(p.value); setPendingStart(null); close() }}
                  />
                ))}
              </div>
            )}
            <Calendar
              selected={selected}
              rangeStart={startDate ?? undefined}
              rangeEnd={endDate ?? undefined}
              min={min}
              max={max}
              hint={hint}
              onSelect={(date) => handleSelect(date, close)}
              onClear={() => { onChange?.(''); setPendingStart(null); close() }}
              onToday={mode === 'single' ? () => { onChange?.(todayStr()); close() } : undefined}
            />
          </div>
        )}
      </Popover>
    </div>
  )
}

/* ── Azúcar de compatibilidad ── */

export interface DateRangePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

/** @deprecated Usa `<DatePicker mode="range">` — el único calendario del sistema. */
export function DateRangePicker({ value, onChange, placeholder }: DateRangePickerProps) {
  return <DatePicker mode="range" value={value} onChange={onChange} placeholder={placeholder} />
}
