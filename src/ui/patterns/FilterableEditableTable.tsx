import { useState, useMemo, type CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import { Input } from '../primitives/Input'
import { DataGrid, type GridColumn } from '../components/DataGrid'
import css from './FilterableEditableTable.module.css'

export interface FilterableColumn extends GridColumn {
  filterable?: boolean
  editable?: boolean
}

export interface FilterableEditableTableProps {
  columns: FilterableColumn[]
  rows: Record<string, unknown>[]
  rowKey: string
  onUpdate?: (rowKey: string, columnKey: string, value: string) => void
  onFilter?: (filters: Record<string, string>) => void
  style?: CSSProperties
}

export function FilterableEditableTable({ columns, rows, rowKey, onUpdate, onFilter, style }: FilterableEditableTableProps) {
  const intl = useIntl()
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [editing, setEditing] = useState<{ row: string; col: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const setFilter = (key: string, value: string) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    onFilter?.(next)
  }

  const filtered = useMemo(() => rows.filter(row =>
    Object.keys(filters).every(k => {
      const f = filters[k]
      if (!f) return true
      return String(row[k] ?? '').toLowerCase().includes(f.toLowerCase())
    }),
  ), [rows, filters])

  const dirty = Object.values(filters).some(v => v)

  const startEdit = (rk: string, ck: string, current: unknown) => {
    setEditing({ row: rk, col: ck })
    setEditValue(String(current ?? ''))
  }

  const commitEdit = () => {
    if (editing) {
      onUpdate?.(editing.row, editing.col, editValue)
      setEditing(null)
    }
  }

  const gridColumns: GridColumn[] = columns.map(col => {
    if (!col.editable) return col
    return {
      ...col,
      render: (row: Record<string, unknown>) => {
        const rk = String(row[rowKey])
        const isEditing = editing?.row === rk && editing?.col === col.key
        if (isEditing) {
          return (
            <input
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              autoFocus
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit()
                if (e.key === 'Escape') setEditing(null)
              }}
              className={css.editInput}
            />
          )
        }
        return (
          <span
            role="button"
            tabIndex={0}
            className={css.editableCell}
            onClick={() => startEdit(rk, col.key, row[col.key])}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startEdit(rk, col.key, row[col.key]) } }}
          >
            {col.render ? col.render(row) : String(row[col.key] ?? '')}
            <span className={`flow-symbol ${css.editIcon}`} aria-hidden="true">edit</span>
          </span>
        )
      },
    }
  })

  return (
    <div style={style}>
      <div style={{
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: 'var(--space-3) var(--space-4)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap',
      }}>
        <span className={css.filterLabel}>
          Filtrar:
        </span>
        {columns.filter(c => c.filterable).map(c => (
          <Input
            key={c.key}
            size="sm"
            aria-label={`Filtrar por ${c.label}`}
            placeholder={`${c.label}…`}
            value={filters[c.key] || ''}
            onChange={v => setFilter(c.key, v)}
            style={{ minWidth: 140 }}
          />
        ))}
        {dirty && (
          <button
            type="button"
            onClick={() => { setFilters({}); onFilter?.({}) }}
            className={css.clearBtn}
          >
            Limpiar
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className={css.emptyState}>
          {dirty ? intl.formatMessage({ id: 'common.noResults', defaultMessage: 'Ningún registro coincide con el filtro' }) : intl.formatMessage({ id: 'common.empty', defaultMessage: 'Sin datos' })}
        </div>
      ) : (
        <DataGrid
          columns={gridColumns}
          rows={filtered}
          rowKey={rowKey}
          density="compact"
          style={{ borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: 'none' }}
        />
      )}
    </div>
  )
}
