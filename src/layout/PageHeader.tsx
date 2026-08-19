import type { ReactNode } from 'react'
import { Breadcrumb } from '../ui/components/Breadcrumb'
import css from '../App.module.css'

export interface PageHeaderProps {
  crumbs: { label: string }[]
  title: string
  actions?: ReactNode
}

export function PageHeader({ crumbs, title, actions }: PageHeaderProps) {
  return (
    <div className={css.pageHeader}>
      <div>
        <Breadcrumb items={crumbs} />
        <h1 className={css.pageTitle}>{title}</h1>
      </div>
      <div className={css.pageActions}>{actions}</div>
    </div>
  )
}
