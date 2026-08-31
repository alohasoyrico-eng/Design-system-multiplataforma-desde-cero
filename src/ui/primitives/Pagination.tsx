import css from './Pagination.module.css'

export interface PaginationProps {
  page?: number
  pages?: number
  onChange?: (page: number) => void
}

export function Pagination({ page = 1, pages = 1, onChange }: PaginationProps) {
  const range = (): (number | '...')[] => {
    const r: (number | '...')[] = []
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) r.push(i)
      else if (r[r.length - 1] !== '...') r.push('...')
    }
    return r
  }

  return (
    <nav aria-label="Paginacion" className={css.root}>
      <button
        className={css.arrow}
        onClick={() => page > 1 && onChange?.(page - 1)}
        disabled={page <= 1}
        aria-label="Anterior"
      >
        <span className="flow-icon flow-icon--default" aria-hidden="true">chevron_left</span>
      </button>
      {range().map((p, i) => {
        const isActive = p === page
        const isEllipsis = p === '...'
        return (
          <button
            key={String(p) + '-' + i}
            className={css.page}
            data-active={isActive || undefined}
            data-ellipsis={isEllipsis || undefined}
            onClick={() => typeof p === 'number' && p !== page && onChange?.(p)}
            disabled={isActive || isEllipsis}
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
        aria-label="Siguiente"
      >
        <span className="flow-icon flow-icon--default" aria-hidden="true">chevron_right</span>
      </button>
    </nav>
  )
}
