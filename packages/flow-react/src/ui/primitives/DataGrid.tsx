import { useState, useCallback, type ReactNode, type CSSProperties } from 'react'
import css from './DataGrid.module.css'

export interface GridColumn<T = Record<string, unknown>> {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  mono?: boolean
  /** Retiro responsivo: 1 (o ausente) siempre visible; 2 se retira bajo --bp-md;
      3 se retira ya bajo --bp-lg... practico: 2 sobrevive mas que 3. */
  priority?: 1 | 2 | 3
  render?: (row: T) => ReactNode
}

export type Density = 'default' | 'compact'

export interface GridSort {
  key: string
  dir: 'asc' | 'desc'
}

export type GridSkin = Partial<Record<'root' | 'table' | 'th' | 'thButton' | 'row' | 'td', string>>

export interface DataGridProps<T = Record<string, unknown>> {
  columns?: GridColumn<T>[]
  rows?: T[]
  rowKey?: string
  selectedKey?: string | number
  onRowClick?: (row: T) => void
  sortable?: boolean
  /** Orden controlado: con `sort` el grid NO reordena filas — el dueño ordena
      (tambien en servidor) y el grid solo pinta el estado y emite el cambio.
      Es la salida de la trampa de ordenar 1 140 filas en el cliente. */
  sort?: GridSort | null
  onSortChange?: (sort: GridSort | null) => void
  density?: Density
  /** Nombre de la tabla para el lector: <caption> visualmente oculto (tb-5). */
  caption?: string
  zebraToken?: string
  /** El gancho de las pieles (Table): reemplaza clases sin duplicar la mecanica. */
  skin?: GridSkin
  style?: CSSProperties
}

export function DataGrid<T extends Record<string, unknown> = Record<string, unknown>>({
  columns = [],
  rows = [],
  rowKey,
  selectedKey,
  onRowClick,
  sortable = true,
  sort,
  onSortChange,
  density = 'default',
  caption,
  zebraToken = 'var(--surface-sunken)',
  skin,
  style,
}: DataGridProps<T>) {
  const cls = (k: keyof NonNullable<GridSkin>) => skin?.[k] ?? css[k as string]
  const controlled = sort !== undefined
  const [internalSort, setInternalSort] = useState<GridSort | null>(null)
  const active = controlled ? sort : internalSort
  const sortCol = active?.key ?? null
  const sortDir = active?.dir ?? 'asc'

  const handleSort = useCallback(
    (key: string) => {
      if (!sortable) return
      const next: GridSort = sortCol === key ? { key, dir: sortDir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
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
    <div className={cls('root')} data-density={density !== 'default' ? density : undefined} style={{ '--_zebra': zebraToken, ...style } as CSSProperties}>
      <table className={cls('table')}>
        {caption && <caption className={css.caption}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cls('th')}
                data-sortable={sortable || undefined}
                data-priority={col.priority && col.priority > 1 ? col.priority : undefined}
                aria-sort={sortCol === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                style={{ textAlign: col.align || 'left' }}
              >
                {sortable ? (
                  <button type="button" className={cls('thButton')} onClick={() => handleSort(col.key)}>
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
                className={cls('row')}
                data-selected={isSelected || undefined}
                data-clickable={onRowClick ? '' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(row) } } : undefined}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cls('td')}
                    data-mono={col.mono || undefined}
                    data-priority={col.priority && col.priority > 1 ? col.priority : undefined}
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
    </div>
  )
}
