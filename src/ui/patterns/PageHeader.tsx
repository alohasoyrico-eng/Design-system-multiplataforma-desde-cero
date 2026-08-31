import type { ReactNode, CSSProperties } from 'react'
import { Breadcrumb } from '../primitives/Breadcrumb'
import { useSidebarToggle } from '../../app/SidebarContext'
import css from './PageHeader.module.css'

export interface PageHeaderProps {
  title: string
  overline?: string
  description?: string
  breadcrumb?: string[]
  filters?: ReactNode
  actions?: ReactNode
  trailing?: ReactNode
  style?: CSSProperties
}

export function PageHeader({
  title,
  overline,
  description,
  breadcrumb = [],
  filters,
  actions,
  trailing,
  style,
}: PageHeaderProps) {
  const hasSecondRow = !!(filters || actions)
  const toggleSidebar = useSidebarToggle()

  return (
    <div className={css.root} style={style}>
      <div className={css.row}>
        {toggleSidebar && (
          <button
            type="button"
            className={css.menuBtn}
            onClick={toggleSidebar}
            aria-label="Abrir navegación"
          >
            <span className="flow-icon" aria-hidden="true">menu</span>
          </button>
        )}
        <div className={css.identity}>
          {breadcrumb.length > 0 && (
            <Breadcrumb items={breadcrumb.map(c => ({ label: c }))} />
          )}
          {overline && <div className={css.overline}>{overline}</div>}
          <h1 className={css.title}>{title}</h1>
          {description && <p className={css.description}>{description}</p>}
        </div>
        <div className={css.spacer} />
        {!hasSecondRow && actions && <div className={css.actions}>{actions}</div>}
        {trailing && <div className={css.utilities}>{trailing}</div>}
      </div>
      {hasSecondRow && (
        <div className={css.row}>
          {filters && <div className={css.filters}>{filters}</div>}
          <div className={css.spacer} />
          {actions && <div className={css.actions}>{actions}</div>}
        </div>
      )}
    </div>
  )
}
