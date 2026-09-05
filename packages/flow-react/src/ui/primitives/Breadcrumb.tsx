import { useT } from '../../i18n/useSafeIntl'
import css from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  label: string
  href?: string
  /** Reemplaza el label visible con un icono (el label queda como aria-label). */
  icon?: string
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  variant?: 'default' | 'subtle'
  homeIcon?: string
}

const MAX_VISIBLE = 4

export function Breadcrumb({ items = [], variant = 'default', homeIcon = 'home' }: BreadcrumbProps) {
  const t = useT()
  const isSubtle = variant === 'subtle'

  // brc-3: una ruta larga colapsa por el medio y conserva el primero y el
  // tramo final (el actual siempre visible). La elipsis es hueco, no salto.
  const visibles: (BreadcrumbItem | '…')[] =
    items.length > MAX_VISIBLE
      ? [items[0], '…', ...items.slice(items.length - (MAX_VISIBLE - 2))]
      : items

  return (
    <nav aria-label={t('nav.breadcrumb', 'Breadcrumb')} data-variant={variant}>
      <ol className={css.list} data-variant={variant}>
        {visibles.map((item, i) => {
          if (item === '…') {
            return (
              <li key="gap" className={css.item}>
                {isSubtle
                  ? <span className={css.separator} aria-hidden="true">/</span>
                  : <span className={`flow-symbol ${css.separator}`} aria-hidden="true">chevron_right</span>}
                <span className={css.gap} aria-hidden="true">…</span>
              </li>
            )
          }
          const isFirst = i === 0
          const isLast = i === visibles.length - 1
          const showIcon = item.icon || (isSubtle && isFirst)

          const content = showIcon
            ? <span className={`flow-symbol ${css.homeIcon}`} aria-hidden="true">{item.icon || homeIcon}</span>
            : item.label

          return (
            <li key={i} className={css.item}>
              {i > 0 && (
                isSubtle
                  ? <span className={css.separator} aria-hidden="true">/</span>
                  : <span className={`flow-symbol ${css.separator}`} aria-hidden="true">chevron_right</span>
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className={css.link}
                  aria-label={showIcon ? item.label : undefined}
                >
                  {content}
                </a>
              ) : (
                <span
                  className={css.text}
                  data-current={isLast || undefined}
                  aria-current={isLast ? 'page' : undefined}
                  aria-label={showIcon ? item.label : undefined}
                >
                  {content}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
