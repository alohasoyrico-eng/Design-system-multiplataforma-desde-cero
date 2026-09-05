import type { CSSProperties } from 'react'
import { Select } from './Select'
import { useT } from '../../i18n/useSafeIntl'
import css from './Pagination.module.css'

export interface PaginationProps {
  page?: number
  pages?: number
  onChange?: (page: number) => void
  /** Total de filas: habilita el rótulo de rango «X–Y de Z» (pag-6). */
  total?: number
  /** Filas por página, para calcular el rango. */
  pageSize?: number
  /** Pasos del selector de tamaño; sin ella el selector no existe. */
  pageSizeOptions?: number[]
  /** Cambiar el tamaño también emite onChange(1): se vuelve a la primera. */
  onPageSizeChange?: (size: number) => void
  style?: CSSProperties
}

export function Pagination({
  page = 1,
  pages = 1,
  onChange,
  total,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  style,
}: PaginationProps) {
  const t = useT()
  const range = (): (number | '...')[] => {
    const r: (number | '...')[] = []
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) r.push(i)
      else if (r[r.length - 1] !== '...') r.push('...')
    }
    return r
  }

  // pag-6: el rango se dice en texto
  const desde = total != null && pageSize != null ? Math.min((page - 1) * pageSize + 1, total) : null
  const hasta = total != null && pageSize != null ? Math.min(page * pageSize, total) : null

  return (
    <nav aria-label={t('flow.pagination.label', 'Paginación')} className={css.root} style={style}>
      {desde != null && (
        <span className={css.range}>
          {t('flow.pagination.range', '{a}–{b} de {n}')
            .replace('{a}', String(desde))
            .replace('{b}', String(hasta))
            .replace('{n}', String(total))}
        </span>
      )}
      <button
        className={css.arrow}
        onClick={() => page > 1 && onChange?.(page - 1)}
        disabled={page <= 1}
        aria-label={t('flow.pagination.prev', 'Anterior')}
      >
        <span className="flow-symbol flow-symbol--default" aria-hidden="true">chevron_left</span>
      </button>
      {range().map((p, i) => {
        const isActive = p === page
        if (p === '...') {
          return (
            <span key={'gap-' + i} className={css.page} data-ellipsis="" aria-hidden="true">
              …
            </span>
          )
        }
        return (
          <button
            key={String(p) + '-' + i}
            className={css.page}
            data-active={isActive || undefined}
            onClick={() => p !== page && onChange?.(p)}
            disabled={isActive}
            aria-current={isActive ? 'page' : undefined}
          >
            {String(p)}
          </button>
        )
      })}
      <button
        className={css.arrow}
        onClick={() => page < pages && onChange?.(page + 1)}
        disabled={page >= pages}
        aria-label={t('flow.pagination.next', 'Siguiente')}
      >
        <span className="flow-symbol flow-symbol--default" aria-hidden="true">chevron_right</span>
      </button>
      {pageSizeOptions && pageSizeOptions.length > 0 && (
        <span className={css.sizer}>
          <Select
            size="sm"
            insetLabel={t('flow.pagination.pageSize', 'Por página')}
            options={pageSizeOptions.map(String)}
            value={pageSize != null ? String(pageSize) : undefined}
            onChange={(v) => {
              const n = Number(v)
              onPageSizeChange?.(n)
              onChange?.(1) // pag-6: nuevo tamaño, primera página
            }}
          />
        </span>
      )}
    </nav>
  )
}
