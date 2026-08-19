import css from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

export function Breadcrumb({ items = [] }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={css.list}>
        {items.map((item, i) => (
          <li key={i} className={css.item}>
            {i > 0 && (
              <span className={`flow-icon ${css.separator}`} aria-hidden="true">
                chevron_right
              </span>
            )}
            {item.href ? (
              <a href={item.href} className={css.link}>{item.label}</a>
            ) : (
              <span className={css.text} data-current={i === items.length - 1 || undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
