import type { CSSProperties } from 'react'
import { DataGrid, type GridColumn, type GridSort, type Density } from '../primitives/DataGrid'
import css from './Table.module.css'

export type { GridColumn, Density }
export type TableSort = GridSort

export interface TableProps<T = Record<string, unknown>> {
  columns?: GridColumn<T>[]
  rows?: T[]
  rowKey?: string
  selectedKey?: string | number
  onRowClick?: (row: T) => void
  sortable?: boolean
  /** Orden controlado: con `sort` la tabla no reordena — el dueño ordena
      (también en servidor) y la tabla pinta el estado y emite el cambio. */
  sort?: TableSort | null
  onSortChange?: (sort: TableSort | null) => void
  density?: Density
  /** Nombre de la tabla para el lector: <caption> visualmente oculto (tb-5). */
  caption?: string
  style?: CSSProperties
}

/** Piel de DataGrid, como declara el canon: misma mecánica (orden controlado,
    selección, header-botón de teclado), otra ropa — sin cromo de tarjeta ni
    zebra. La mecánica vive una sola vez, en el shell. */
export function Table<T extends Record<string, unknown> = Record<string, unknown>>(props: TableProps<T>) {
  return (
    <DataGrid<T>
      {...props}
      skin={{ root: css.wrap, table: css.root, th: css.th, thButton: css.thButton, row: css.row, td: css.td }}
    />
  )
}
