import { Outlet } from '@tanstack/react-router'
import { TopBar } from '../ui/patterns/TopBar'
import { FlowLogo } from '../ui/primitives/FlowLogo'
import css from './DocsLayout.module.css'

const DOCS_NAV = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'components', label: 'Components', active: true },
  { id: 'patterns', label: 'Patterns' },
  { id: 'templates', label: 'Templates' },
]

export function DocsLayout() {
  return (
    <div className={css.layout}>
      <TopBar
        surface="inverse"
        logo={<FlowLogo />}
        navItems={DOCS_NAV}
        navSize="sm"
      />
      <main className={css.main}>
        <Outlet />
      </main>
    </div>
  )
}
