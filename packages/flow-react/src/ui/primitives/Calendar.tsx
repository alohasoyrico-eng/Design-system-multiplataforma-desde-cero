import { useState, useCallback, useEffect, useRef, type KeyboardEvent } from 'react'
import type { CSSProperties } from 'react'
import { useT } from '../../i18n/useSafeIntl'
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
  const t = useT()
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

  // dp-1 y dp-2: la rejilla se recorre con flechas y un solo dia es tabulable —
  // el seleccionado, o hoy, o el primero; los demas quedan en tabindex -1.
  const gridRef = useRef<HTMLDivElement>(null)
  const [focusDate, setFocusDate] = useState<string | null>(null)

  const enVista = (ds: string) => ds.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-`)
  const tabulable =
    (focusDate && enVista(focusDate) && focusDate) ||
    selected.find(enVista) ||
    (enVista(todayStr) && todayStr) ||
    toDateStr(viewYear, viewMonth, 1)

  useEffect(() => {
    if (!focusDate) return
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusDate}"]`)?.focus()
  }, [focusDate, viewYear, viewMonth])

  const moveFocus = (target: Date) => {
    const y = target.getFullYear()
    const m = target.getMonth()
    if (y !== viewYear || m !== viewMonth) {
      setViewYear(y)
      setViewMonth(m)
    }
    setFocusDate(toDateStr(y, m, target.getDate()))
  }

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const ds = (e.target as HTMLElement).getAttribute?.('data-date')
    if (!ds) return
    const d = new Date(ds + 'T00:00:00')
    let destino: Date | null = null
    if (e.key === 'ArrowLeft') destino = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1)
    else if (e.key === 'ArrowRight') destino = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    else if (e.key === 'ArrowUp') destino = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7)
    else if (e.key === 'ArrowDown') destino = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7)
    else if (e.key === 'Home') destino = new Date(viewYear, viewMonth, 1)
    else if (e.key === 'End') destino = new Date(viewYear, viewMonth, total)
    else if (e.key === 'PageUp' || e.key === 'PageDown') {
      // mismo dia del mes vecino, fijado al fin de mes (31 may -> 30 jun)
      const salto = e.key === 'PageUp' ? -1 : 1
      const primero = new Date(d.getFullYear(), d.getMonth() + salto, 1)
      const tope = daysInMonth(primero.getFullYear(), primero.getMonth())
      destino = new Date(primero.getFullYear(), primero.getMonth(), Math.min(d.getDate(), tope))
    }
    else return
    e.preventDefault()
    moveFocus(destino)
  }

  return (
    <div className={css.root} style={style}>
      <div className={css.header}>
        <button type="button" className={css.monthLabel}>{monthLabel}</button>
        <div className={css.nav}>
          <button type="button" className={css.navBtn} onClick={prevMonth} aria-label={t('flow.calendar.prevMonth', 'Mes anterior')}>
            <span className="flow-symbol" aria-hidden="true">keyboard_arrow_up</span>
          </button>
          <button type="button" className={css.navBtn} onClick={nextMonth} aria-label={t('flow.calendar.nextMonth', 'Mes siguiente')}>
            <span className="flow-symbol" aria-hidden="true">keyboard_arrow_down</span>
          </button>
        </div>
      </div>
      {hint && <div className={css.hint}>{hint}</div>}
      <div className={css.grid} ref={gridRef} onKeyDown={onGridKeyDown}>
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
              data-date={dateStr}
              data-selected={isSelected || undefined}
              data-in-range={inRange || undefined}
              data-range-start={(rangeStart && dateStr === rangeStart && rangeEnd) || undefined}
              data-range-end={(rangeEnd && dateStr === rangeEnd && rangeStart) || undefined}
              data-today={isToday || undefined}
              disabled={outOfBounds}
              tabIndex={dateStr === tabulable ? 0 : -1}
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
