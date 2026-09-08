import { useMemo, useState, useRef, useLayoutEffect, type CSSProperties } from 'react'
import { Table, type GridColumn, type TableSort, type Density } from '../components/Table'
import { Input } from '../primitives/Input'
import { Pagination } from '../primitives/Pagination'
import { EmptyState } from '../primitives/EmptyState'
import { Button } from '../primitives/Button'
import { useT } from '../../i18n/useSafeIntl'
import css from './DataTable.module.css'

export interface DataTableProps<T = Record<string, unknown>> {
  columns: GridColumn<T>[]
  rows: T[]
  rowKey: string
  /** Nombre de la tabla; también etiqueta la búsqueda («Buscar en {caption}»). */
  caption: string
  /** Campos donde busca la consulta. Sin ella, todos los campos de texto de la fila. */
  searchKeys?: string[]
  searchPlaceholder?: string
  /** dtb-6: `false` oculta el buscador — para tablas cuyo dueño ya filtra
      aguas arriba y una segunda caja confundiría sobre cuál filtra qué. */
  searchable?: boolean
  /** Filas por página; la paginación solo aparece si hay más filas. */
  pageSize?: number
  onRowClick?: (row: T) => void
  selectedKey?: string | number
  density?: Density
  /** Mensaje del estado sin resultados; `{q}` se interpola con la consulta. */
  emptyLabel?: string
  style?: CSSProperties
}

const normaliza = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

/** Búsqueda, orden y paginación coordinados sobre Table: la consulta filtra,
    el orden se aplica al conjunto filtrado COMPLETO (dtb-2) y la paginación
    recorta al final. Buscar devuelve a la primera página (dtb-1). Con datos
    remotos este patrón no aplica: el dueño filtra fuera y pasa rows. */
export function DataTable<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  caption,
  searchKeys,
  searchPlaceholder,
  searchable = true,
  pageSize = 10,
  onRowClick,
  selectedKey,
  density,
  emptyLabel,
  style,
}: DataTableProps<T>) {
  const t = useT()
  // dtb-5: la altura de la zona de filas no baila al cambiar de página — se
  // ancla a la de una página completa en cuanto se ve una.
  const zonaRef = useRef<HTMLDivElement>(null)
  const [altoPagina, setAltoPagina] = useState<number>()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<TableSort | null>(null)

  const filtered = useMemo(() => {
    const q = normaliza(query.trim())
    if (!q) return rows
    const keys = searchKeys ?? null
    return rows.filter((row) => {
      const campos = keys ?? Object.keys(row).filter((k) => typeof row[k] === 'string')
      return campos.some((k) => {
        const v = row[k]
        return (typeof v === 'string' || typeof v === 'number') && normaliza(String(v)).includes(q)
      })
    })
  }, [rows, query, searchKeys])

  // dtb-2: el orden vive aquí (controlado) para aplicarse ANTES del recorte de página.
  const sorted = useMemo(() => {
    if (!sort) return filtered
    const { key, dir } = sort
    return [...filtered].sort((a, b) => {
      const va = a[key]
      const vb = b[key]
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return dir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sort])

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, pages)
  const visible = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  const buscar = (v: string) => {
    setQuery(v)
    setPage(1) // dtb-1: buscar devuelve a la primera página
  }

  // El emptyLabel del consumidor puede traer {q}; el del sistema interpola
  // por formatMessage (i18n-2).
  const consulta = query.trim()
  const vacio = emptyLabel
    ? emptyLabel.replace('{q}', consulta)
    : t('flow.dataTable.empty', 'Sin resultados para «{q}»', { q: consulta })

  useLayoutEffect(() => {
    if (zonaRef.current && visible.length === pageSize) {
      setAltoPagina(zonaRef.current.offsetHeight)
    }
  }, [visible.length, pageSize, density])

  return (
    <div className={css.root} style={style}>
      {/* dtb-6: sin buscador cuando el dueño ya filtra aguas arriba — dos
          cajas de búsqueda pegadas confunden sobre cuál filtra qué (cazado
          en eOne: el directorio de estaciones ya tiene «Buscar estación»
          en los filtros de la pantalla). */}
      {searchable && (
        <div className={css.toolbar}>
          <Input
            type="search"
            icon="search"
            value={query}
            onChange={buscar}
            placeholder={searchPlaceholder ?? t('flow.dataTable.search', 'Buscar…')}
            ariaLabel={t('flow.dataTable.searchIn', 'Buscar en {caption}', { caption })}
          />
          {/* dtb-1: el recuento se anuncia sin robar el foco */}
          <p className={css.count} aria-live="polite">
            {query
              ? t('flow.dataTable.count', '{n} de {total}', { n: sorted.length, total: rows.length })
              : ''}
          </p>
        </div>
      )}
      <div ref={zonaRef} style={altoPagina ? { minHeight: altoPagina } : undefined}>
      {sorted.length === 0 ? (
        /* dtb-4: sin resultados la tabla no queda muda */
        <EmptyState
          icon="search_off"
          title={vacio}
          action={
            <Button variant="secondary" onClick={() => buscar('')}>
              {t('flow.dataTable.clear', 'Limpiar búsqueda')}
            </Button>
          }
        />
      ) : (
        <Table<T>
          columns={columns}
          rows={visible}
          rowKey={rowKey}
          caption={caption}
          sort={sort}
          onSortChange={setSort}
          onRowClick={onRowClick}
          selectedKey={selectedKey}
          density={density}
        />
      )}
      </div>
      {pages > 1 && <Pagination page={safePage} pages={pages} onChange={setPage} />}
    </div>
  )
}
