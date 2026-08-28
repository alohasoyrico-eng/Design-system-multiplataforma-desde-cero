import type { ReactNode } from 'react'
import { PageHeader as PageHeaderPattern } from '../ui/patterns/PageHeader'

export interface PageHeaderProps {
  crumbs: { label: string }[]
  title: string
  actions?: ReactNode
}

export function PageHeader({ crumbs, title, actions }: PageHeaderProps) {
  return (
    <PageHeaderPattern
      title={title}
      breadcrumb={crumbs.map(c => c.label)}
      actions={actions}
    />
  )
}
