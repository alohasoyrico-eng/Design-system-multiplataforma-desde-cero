import { useState } from 'react'
import { Breadcrumb } from '../ui/components/Breadcrumb'
import { Tabs } from '../ui/components/Tabs'
import { StatusPill } from '../ui/primitives/StatusPill'
import { Badge } from '../ui/primitives/Badge'
import css from './ComponentDetailPage.module.css'

const CRUMBS = [
  { label: 'Components', href: '#' },
  { label: 'Actions', href: '#' },
  { label: 'Button' },
]

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'design', label: 'Design' },
  { value: 'build', label: 'Build' },
  { value: 'miel', label: 'MIEL' },
]

export function ComponentDetailPage() {
  const [tab, setTab] = useState('overview')

  return (
    <div className={css.page}>
      <Breadcrumb items={CRUMBS} />

      <section className={css.hero}>
        <div className={css.heroMain}>
          <h1 className={css.heroHeadline}>Button</h1>
          <p className={css.heroDesc}>
            Buttons allow users to take actions and make choices with a single tap.
            They communicate the action that will occur when the user touches them.
          </p>
        </div>
        <div className={css.heroMeta}>
          <div className={css.heroPills}>
            <StatusPill label="React stable" tone="success" />
            <StatusPill label="Flutter beta" tone="warning" />
            <Badge tone="info">WCAG 2.2 AA</Badge>
          </div>
        </div>
      </section>

      <Tabs value={tab} onChange={setTab} items={TABS} />

      {tab === 'overview' && <OverviewTab />}
      {tab === 'design' && <DesignTab />}
      {tab === 'build' && <BuildTab />}
      {tab === 'miel' && <MielTab />}
    </div>
  )
}

function OverviewTab() {
  return (
    <div style={{ padding: 'var(--space-6) 0', color: 'var(--text-muted)', font: 'var(--type-body-md)' }}>
      Overview content — zones 5–9 go here.
    </div>
  )
}

function DesignTab() {
  return (
    <div style={{ padding: 'var(--space-6) 0', color: 'var(--text-muted)', font: 'var(--type-body-md)' }}>
      Design content — zones 10–13 go here.
    </div>
  )
}

function BuildTab() {
  return (
    <div style={{ padding: 'var(--space-6) 0', color: 'var(--text-muted)', font: 'var(--type-body-md)' }}>
      Build content — zones 14–17 go here.
    </div>
  )
}

function MielTab() {
  return (
    <div style={{ padding: 'var(--space-6) 0', color: 'var(--text-muted)', font: 'var(--type-body-md)' }}>
      MIEL content — zone 18 goes here.
    </div>
  )
}
