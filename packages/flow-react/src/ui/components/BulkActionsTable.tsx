import { useState, type CSSProperties, type ReactNode } from 'react'
import { DataGrid, type GridColumn } from '../primitives/DataGrid'
import { Button } from '../primitives/Button'
import { IconButton } from '../primitives/IconButton'
import { Checkbox } from '../primitives/Checkbox'
import { useT } from '../../i18n/useSafeIntl'
import css from './BulkActionsTable.module.css'

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
  const t = useT()
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
        return <Checkbox checked={selection.includes(k)} onChange={() => toggle(k)} aria-label={t('bulk.selectRow', 'Seleccionar {k}').replace('{k}', k)} />
      },
    },
    ...columns,
  ]

  return (
    <div style={style}>
      {n > 0 && (
        <div
          role="toolbar"
          aria-label={t('bulk.actions', 'Acciones sobre la selección')}
          style={{
            background: 'var(--surface-accent-subtle)', border: '1px solid var(--border-focus)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: 'var(--space-3) var(--space-4)',
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            animation: 'flowScaleIn var(--dur-fast) var(--ease-out)',
          }}
        >
          {/* blk-2: el estado parcial es indeterminate real en el input nativo. */}
          <Checkbox checked={allSelected} indeterminate={n > 0 && !allSelected} onChange={toggleAll} aria-label={t('bulk.selectAll', 'Seleccionar todo')} />
          <span aria-live="polite" className={css.selectionCount}>
            {n} {n === 1 ? t('bulk.selectedOne', 'seleccionado') : t('bulk.selectedMany', 'seleccionados')}
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
          <IconButton icon="close" ariaLabel={t('bulk.clear', 'Limpiar selección')} variant="ghost" onClick={() => setSelection([])} />
        </div>
      )}
      {n === 0 && (
        <div style={{
          background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: 'var(--space-2) var(--space-4)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        }}>
          <Checkbox checked={false} onChange={toggleAll} aria-label={t('bulk.selectAll', 'Seleccionar todo')} />
          <span className={css.recordCount}>
            {rows.length} {rows.length === 1 ? t('bulk.recordOne', 'registro') : t('bulk.recordMany', 'registros')}
          </span>
        </div>
      )}
      <DataGrid
        columns={selColumns}
        rows={rows}
        rowKey={rowKey}
        density="compact"
        zebraToken="var(--surface-sunken)"
        style={{ borderRadius: n > 0 || true ? '0 0 var(--radius-lg) var(--radius-lg)' : undefined, borderTop: 'none' }}
      />
    </div>
  )
}
