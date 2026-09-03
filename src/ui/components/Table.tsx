import { useState, useCallback, type ReactNode, type CSSProperties } from 'react'
import css from './Table.module.css'

export interface GridColumn<T = Record<string, unknown>> {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  mono?: boolean
  render?: (row: T) => ReactNode
}

export type Density = 'default' | 'compact'

export interface TableSort {
  key: string
  dir: 'asc' | 'desc'
}

export interface TableProps<T = Record<string, unknown>> {
  columns?: GridColumn<T>[]
  rows?: T[]
  rowKey?: string
  selectedKey?: string | number
  onRowClick?: (row: T) => void
  sortable?: boolean
  /** Orden controlado: con `sort` la tabla no reordena — el dueño ordena
      (tambien en servidor) y la tabla pinta el estado y emite el cambio. */
  sort?: TableSort | null
  onSortChange?: (sort: TableSort | null) => void
  density?: Density
  style?: CSSProperties
}

export function Table<T extends Record<string, unknown> = Record<string, unknown>>({
  columns = [],
  rows = [],
  rowKey,
  selectedKey,
  onRowClick,
  sortable = true,
  sort,
  onSortChange,
  density = 'default',
  style,
}: TableProps<T>) {
  const controlled = sort !== undefined
  const [internalSort, setInternalSort] = useState<TableSort | null>(null)
  const active = controlled ? sort : internalSort
  const sortCol = active?.key ?? null
  const sortDir = active?.dir ?? 'asc'

  const handleSort = useCallback(
    (key: string) => {
      if (!sortable) return
      const next: TableSort = sortCol === key ? { key, dir: sortDir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
      if (!controlled) setInternalSort(next)
      onSortChange?.(next)
    },
    [sortable, sortCol, sortDir, controlled, onSortChange],
  )

  // Controlado: las filas llegan ya ordenadas por el dueño.
  let sorted = rows
  if (!controlled && sortCol) {
    sorted = [...rows].sort((a, b) => {
      const va = a[sortCol]
      const vb = b[sortCol]
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }

  return (
    <table className={css.root} data-density={density !== 'default' ? density : undefined} style={style}>
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              className={css.th}
              data-sortable={sortable || undefined}
              aria-sort={sortCol === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
              style={{ textAlign: col.align || 'left' }}
            >
              {sortable ? (
                <button type="button" className={css.thButton} onClick={() => handleSort(col.key)}>
                  {col.label}
                  {sortCol === col.key && <span aria-hidden="true" style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              ) : (
                col.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row, i) => {
          const key = rowKey ? (row[rowKey] as string | number) : i
          const isSelected = selectedKey != null && key === selectedKey
          return (
            <tr
              key={key}
              className={css.row}
              data-selected={isSelected || undefined}
              data-clickable={onRowClick ? '' : undefined}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={css.td}
                  data-mono={col.mono || undefined}
                  style={{ textAlign: col.align || 'left' }}
                >
                  {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
