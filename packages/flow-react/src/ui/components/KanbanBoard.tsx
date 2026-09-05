import { useState, useRef, useEffect, useCallback, type CSSProperties, type ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { OverlayShell } from '../primitives/OverlayShell'
import { Badge } from '../primitives/Badge'
import { IconButton } from '../primitives/IconButton'
import css from './KanbanBoard.module.css'

const SR: CSSProperties = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }

export interface KanbanColumn {
  id: string
  label: string
  color?: string
  limit?: number
  abandon?: boolean
}

export interface KanbanBoardProps<T extends object = Record<string, unknown>> {
  columns: KanbanColumn[]
  items: T[]
  columnKey?: string
  itemKey?: string
  renderCard: (item: T, state: { dragging: boolean }) => ReactNode
  renderColumnHeader?: (column: KanbanColumn, state: { count: number; atLimit: boolean; isOver: boolean }) => ReactNode
  columnStyle?: CSSProperties | ((column: KanbanColumn, state: { atLimit: boolean; isOver: boolean; isReject: boolean }) => CSSProperties)
  onMove?: (key: string, toColumnId: string) => boolean | void
  onAdvance?: (key: string) => void
  abandonColumn?: KanbanColumn
  renderDetail?: (item: T) => ReactNode
  detailKey?: string | null
  onDetailChange?: (key: string | null) => void
  style?: CSSProperties
}

export function KanbanBoard<T extends object>({
  columns, items, columnKey = 'columnId', itemKey = 'id',
  renderCard, renderColumnHeader, columnStyle, onMove, onAdvance, abandonColumn, renderDetail,
  detailKey, onDetailChange, style,
}: KanbanBoardProps<T>) {
  const intl = useIntl()
  const [drag, setDrag] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [reject, setReject] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [openLocal, setOpenLocal] = useState<string | null>(null)
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const cards = useRef<Record<string, HTMLDivElement | null>>({})
  const scroller = useRef<HTMLDivElement>(null)

  const all = abandonColumn ? columns.concat([{ ...abandonColumn, abandon: true }]) : columns
  const keyOf = (it: T) => String((it as Record<string, unknown>)[itemKey])
  const grouped: Record<string, T[]> = {}
  all.forEach((c) => { grouped[c.id] = [] })
  items.forEach((it) => { const c = String((it as Record<string, unknown>)[columnKey]); if (grouped[c]) grouped[c].push(it) })

  const controlled = detailKey !== undefined
  const openId = controlled ? detailKey : openLocal
  const setOpen = useCallback((k: string | null) => {
    if (!controlled) setOpenLocal(k)
    onDetailChange?.(k)
  }, [controlled, onDetailChange])

  useEffect(() => {
    if (!reject) return
    const t = setTimeout(() => setReject(null), 1100)
    return () => clearTimeout(t)
  }, [reject])

  useEffect(() => {
    if (!focusKey) return
    const n = cards.current[focusKey]
    if (n?.focus) n.focus()
    setFocusKey(null)
  }, [focusKey])

  function tryMove(key: string, toId: string) {
    const col = all.find((c) => c.id === toId)
    const item = items.find((it) => keyOf(it) === String(key))
    if (!col || !item || String((item as Record<string, unknown>)[columnKey]) === String(toId)) return false
    if (col.limit && grouped[toId].length >= col.limit) {
      setReject(toId)
      setMsg(`${col.label} esta en su limite de ${col.limit}. La tarjeta no se movio.`)
      return false
    }
    const res = onMove?.(String(key), toId)
    if (res === false) {
      setReject(toId)
      setMsg(`El movimiento a ${col.label} no se acepto. La tarjeta no se movio.`)
      return false
    }
    setMsg(`Movida a ${col.label}.`)
    setFocusKey(String(key))
    return true
  }

  function advance(key: string, colIdx: number) {
    const next = all[colIdx + 1]
    if (!next || next.abandon) return
    if (onAdvance) { onAdvance(String(key)); setMsg(`Avanzada a ${next.label}.`); setFocusKey(String(key)); return }
    tryMove(key, next.id)
  }

  function focusCell(colIdx: number, rowIdx: number) {
    for (let i = colIdx; i >= 0 && i < all.length; i += (colIdx <= i ? 1 : -1)) {
      const list = grouped[all[i].id]
      if (!list.length) { if (i === colIdx) continue; break }
      const it = list[Math.max(0, Math.min(rowIdx, list.length - 1))]
      const n = cards.current[keyOf(it)]
      if (n?.focus) { n.focus(); return }
      break
    }
  }

  function onCardKey(e: React.KeyboardEvent, item: T, colIdx: number, rowIdx: number) {
    const k = e.key
    if (k === 'Enter' || k === ' ') {
      if (!renderDetail) return
      e.preventDefault()
      setOpen(keyOf(item))
      return
    }
    const h = k === 'ArrowRight' ? 1 : k === 'ArrowLeft' ? -1 : 0
    const v = k === 'ArrowDown' ? 1 : k === 'ArrowUp' ? -1 : 0
    if (!h && !v) return
    e.preventDefault()
    if (h && e.shiftKey) {
      const to = all[colIdx + h]
      if (to) tryMove(keyOf(item), to.id)
      return
    }
    if (v) focusCell(colIdx, rowIdx + v)
    else focusCell(colIdx + h, rowIdx)
  }

  const openItem = openId == null ? null : items.find((it) => keyOf(it) === String(openId))

  return (
    <div style={{ position: 'relative', fontFamily: 'var(--font-body)', ...style }}>
      <div role="status" aria-live="polite" style={SR}>{msg}</div>
      <div
        ref={scroller}
        onDragOver={(e) => {
          const el = scroller.current
          if (!el) return
          const r = el.getBoundingClientRect()
          if (e.clientX > r.right - 72) el.scrollLeft += 20
          else if (e.clientX < r.left + 72) el.scrollLeft -= 20
        }}
        style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: 'var(--space-2)', alignItems: 'flex-start' }}
      >
        {all.map((col, colIdx) => {
          const list = grouped[col.id]
          const atLimit = !!col.limit && list.length >= col.limit
          const isOver = over === col.id
          const isReject = reject === col.id
          const colSt = typeof columnStyle === 'function' ? columnStyle(col, { atLimit, isOver, isReject }) : columnStyle
          return (
            <section
              key={col.id}
              role="group"
              aria-label={`${col.label}, ${list.length} tarjeta${list.length === 1 ? '' : 's'}${col.limit ? `, limite ${col.limit}` : ''}${col.abandon ? ', columna de salida' : ''}`}
              onDragOver={(e) => { e.preventDefault(); if (over !== col.id) setOver(col.id) }}
              onDragLeave={(e) => { if (e.currentTarget === e.target) setOver(null) }}
              onDrop={(e) => { e.preventDefault(); if (drag) tryMove(drag, col.id); setDrag(null); setOver(null) }}
              style={{
                flex: '0 0 268px', minWidth: 268, boxSizing: 'border-box',
                background: col.abandon ? 'transparent' : 'var(--surface-sunken)',
                border: isReject ? '1.5px solid var(--status-danger)'
                  : isOver ? '1.5px solid var(--border-strong)'
                    : col.abandon ? '1.5px dashed var(--border-default)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)',
                display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
                transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
                ...colSt,
              }}
            >
              {renderColumnHeader
                ? renderColumnHeader(col, { count: list.length, atLimit, isOver })
                : (
                  <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 24 }}>
                    {col.color && !col.abandon && (
                      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, flex: 'none' }} />
                    )}
                    <span className={css.columnLabel} data-abandon={col.abandon || undefined}>
                      {col.label}
                    </span>
                    <Badge tone={atLimit ? 'warning' : 'default'}>
                      {`${list.length}${col.limit ? `/${col.limit}` : ''}`}
                    </Badge>
                  </header>
                )
              }
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minHeight: 40 }}>
                {list.map((item, rowIdx) => {
                  const k = keyOf(item)
                  const dragging = drag === k
                  const canAdvance = !col.abandon && !!all[colIdx + 1] && !all[colIdx + 1].abandon
                  return (
                    <div
                      key={k}
                      ref={(n) => { if (n) cards.current[k] = n; else delete cards.current[k] }}
                      role="button"
                      tabIndex={0}
                      aria-roledescription="tarjeta de tablero"
                      draggable
                      onDragStart={(e) => { setDrag(k); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', k) }}
                      onDragEnd={() => { setDrag(null); setOver(null) }}
                      onKeyDown={(e) => onCardKey(e, item, colIdx, rowIdx)}
                      onClick={renderDetail ? () => setOpen(k) : undefined}
                      onFocus={(e) => { e.currentTarget.style.boxShadow = 'var(--focus-ring)' }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                      style={{
                        position: 'relative', background: 'var(--surface-card)',
                        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-3)', cursor: renderDetail ? 'pointer' : 'grab',
                        opacity: dragging ? 0.45 : 1, textAlign: 'left',
                        transition: 'opacity var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
                      }}
                    >
                      {renderCard(item, { dragging })}
                      <span style={SR}> — columna {col.label}, {rowIdx + 1} de {list.length}</span>
                      {canAdvance && (
                        <div style={{ position: 'absolute', top: 6, right: 6 }}>
                          <IconButton
                            icon="arrow_forward"
                                                       variant="ghost"
                            ariaLabel={`Avanzar a ${all[colIdx + 1].label}`}
                            onClick={(e) => { e.stopPropagation(); advance(k, colIdx) }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
                {list.length === 0 && (
                  <p className={css.emptyHint}>
                    {col.abandon ? intl.formatMessage({ id: 'common.emptyColumnAbandon', defaultMessage: 'Sin salidas' }) : intl.formatMessage({ id: 'common.emptyColumn', defaultMessage: 'Vacía' })}
                  </p>
                )}
              </div>
            </section>
          )
        })}
      </div>
      {renderDetail && openItem && (
        <OverlayShell open onClose={() => setOpen(null)} alignment="end">
          <aside style={{
            width: 420, maxWidth: '92vw', height: '100%', boxSizing: 'border-box',
            background: 'var(--surface-card)', boxShadow: 'var(--shadow-overlay)',
            borderLeft: '1.5px solid var(--border-strong)',
            display: 'flex', flexDirection: 'column', color: 'var(--text-primary)',
          }}>
            <header style={{
              flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-5) var(--space-5) var(--space-3)', borderBottom: '1px solid var(--border-subtle)',
            }}>
              <span className={css.detailLabel}>
                Detalle
              </span>
              <IconButton icon="close" variant="ghost" ariaLabel={intl.formatMessage({ id: 'common.close', defaultMessage: 'Cerrar' })} onClick={() => setOpen(null)} />
            </header>
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--space-5) var(--space-6)' }}>
              {renderDetail(openItem)}
            </div>
          </aside>
        </OverlayShell>
      )}
    </div>
  )
}
