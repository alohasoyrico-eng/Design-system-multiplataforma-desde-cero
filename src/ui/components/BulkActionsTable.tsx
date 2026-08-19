import { useState, type CSSProperties, type ReactNode } from 'react'
import { DataGrid, type GridColumn } from '../primitives/shells/DataGrid'
import { Button } from '../primitives/Button'
import { IconButton } from '../primitives/IconButton'
import { Checkbox } from '../primitives/Checkbox'

export interface BulkAction {
  id: string
  label: string
  icon?: string
  danger?: boolean
}

export interface BulkActionsTableProps {
  columns: GridColumn[]
  rows: Record<string, unknown>[]
  rowKey: string
  actions?: BulkAction[]
  onActionClick?: (actionId: string, selectedKeys: string[]) => void
  style?: CSSProperties
}

export function BulkActionsTable({ columns, rows, rowKey, actions = [], onActionClick, style }: BulkActionsTableProps) {
  const [selection, setSelection] = useState<string[]>([])
  const n = selection.length
  const allSelected = rows.length > 0 && n === rows.length

  const toggle = (key: string) => {
    setSelection(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const toggleAll = () => {
    setSelection(allSelected ? [] : rows.map(r => String(r[rowKey])))
  }

  const selColumns: GridColumn[] = [
    {
      key: '__select',
      label: '',
      render: (row: Record<string, unknown>) => {
        const k = String(row[rowKey])
        return <Checkbox checked={selection.includes(k)} onChange={() => toggle(k)} aria-label={`Seleccionar ${k}`} />
      },
    },
    ...columns,
  ]

  return (
    <div style={style}>
      {n > 0 && (
        <div
          role="toolbar"
          aria-label="Acciones sobre la selección"
          style={{
            background: 'var(--surface-accent-subtle)', border: '1px solid var(--border-focus)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            animation: 'flowScaleIn var(--dur-fast) var(--ease-out)',
          }}
        >
          <Checkbox checked={allSelected} onChange={toggleAll} aria-label="Seleccionar todo" />
          <span aria-live="polite" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-accent)' }}>
            {n} seleccionado{n > 1 ? 's' : ''}
          </span>
          <div style={{ flex: 1 }} />
          {actions.map(a => (
            <Button
              key={a.id}
              variant={a.danger ? 'danger' : 'secondary'}
              size="sm"
              icon={a.icon}
              onClick={() => onActionClick?.(a.id, selection.slice())}
            >
              {a.label}
            </Button>
          ))}
          <IconButton icon="close" ariaLabel="Limpiar selección" variant="ghost" onClick={() => setSelection([])} />
        </div>
      )}
      {n === 0 && (
        <div style={{
          background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Checkbox checked={false} onChange={toggleAll} aria-label="Seleccionar todo" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {rows.length} registro{rows.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      <DataGrid
        columns={selColumns}
        rows={rows}
        rowKey={rowKey}
        density="dense"
        zebraToken="var(--surface-sunken)"
        style={{ borderRadius: n > 0 || true ? '0 0 var(--radius-lg) var(--radius-lg)' : undefined, borderTop: 'none' }}
      />
    </div>
  )
}
