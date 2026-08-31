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

export interface TableProps<T = Record<string, unknown>> {
  columns?: GridColumn<T>[]
  rows?: T[]
  rowKey?: string
  selectedKey?: string | number
  onRowClick?: (row: T) => void
  sortable?: boolean
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
  density = 'default',
  style,
}: TableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = useCallback(
    (key: string) => {
      if (!sortable) return
      if (sortCol === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
      else { setSortCol(key); setSortDir('asc') }
    },
    [sortCol, sortable],
  )

  let sorted = rows
  if (sortCol) {
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
              onClick={() => sortable && handleSort(col.key)}
              aria-sort={sortCol === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
              style={{ textAlign: col.align || 'left' }}
            >
              {col.label}
              {sortCol === col.key && <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
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
