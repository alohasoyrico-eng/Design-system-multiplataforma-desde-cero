import { useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import css from './Calendar.module.css'

export interface CalendarProps {
  selected?: string[]
  rangeStart?: string
  rangeEnd?: string
  /** Fecha mínima seleccionable (ISO). */
  min?: string
  /** Fecha máxima seleccionable (ISO). */
  max?: string
  onSelect?: (date: string) => void
  onClear?: () => void
  onToday?: () => void
  hint?: string
  style?: CSSProperties
}

const DAYS = ['l', 'm', 'm', 'j', 'v', 's', 'd']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function startDay(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function Calendar({
  selected = [],
  rangeStart,
  rangeEnd,
  min,
  max,
  onSelect,
  onClear,
  onToday,
  hint,
  style,
}: CalendarProps) {
  const today = new Date()
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const anchor = selected[0] ? new Date(selected[0] + 'T00:00:00') : today
  const [viewYear, setViewYear] = useState(anchor.getFullYear())
  const [viewMonth, setViewMonth] = useState(anchor.getMonth())

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('es', { month: 'long', year: 'numeric' })

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }, [viewMonth])

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }, [viewMonth])

  const total = daysInMonth(viewYear, viewMonth)
  const offset = startDay(viewYear, viewMonth)
  const cells: (number | null)[] = Array(offset).fill(null)
  for (let i = 1; i <= total; i++) cells.push(i)
  while (cells.length % 7 !== 0) cells.push(null)

  const selectedSet = new Set(selected)

  return (
    <div className={css.root} style={style}>
      <div className={css.header}>
        <button type="button" className={css.monthLabel}>{monthLabel}</button>
        <div className={css.nav}>
          <button type="button" className={css.navBtn} onClick={prevMonth} aria-label="Mes anterior">
            <span className="flow-icon" aria-hidden="true">keyboard_arrow_up</span>
          </button>
          <button type="button" className={css.navBtn} onClick={nextMonth} aria-label="Mes siguiente">
            <span className="flow-icon" aria-hidden="true">keyboard_arrow_down</span>
          </button>
        </div>
      </div>
      {hint && <div className={css.hint}>{hint}</div>}
      <div className={css.grid}>
        {DAYS.map((d, i) => (
          <span key={`h-${i}`} className={css.dayHeader}>{d}</span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} />
          const dateStr = toDateStr(viewYear, viewMonth, day)
          const isToday = dateStr === todayStr
          const isSelected = selectedSet.has(dateStr)
          const inRange = rangeStart && rangeEnd && dateStr > rangeStart && dateStr < rangeEnd
          const outOfBounds = Boolean((min && dateStr < min) || (max && dateStr > max))
          return (
            <button
              key={`d-${i}`}
              type="button"
              className={css.day}
              data-selected={isSelected || undefined}
              data-in-range={inRange || undefined}
              data-today={isToday || undefined}
              disabled={outOfBounds}
              onClick={() => onSelect?.(dateStr)}
            >
              {day}
            </button>
          )
        })}
      </div>
      {(onClear || onToday) && (
        <div className={css.footer}>
          {onClear && (
            <button type="button" className={css.footerBtn} onClick={onClear}>
              Borrar
            </button>
          )}
          {onToday && (
            <button type="button" className={css.footerBtn} data-accent="" onClick={onToday}>
              Hoy
            </button>
          )}
        </div>
      )}
    </div>
  )
}
