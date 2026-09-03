import { useState, useMemo } from 'react'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { TopBar } from '../ui/components/TopBar'
import { GlobalSearch, type SearchResult } from '../ui/components/GlobalSearch'
import { FlowLogo } from '../ui/primitives/FlowLogo'
import { getAllContracts } from '../data/contracts'
import css from './DocsLayout.module.css'

const DOCS_NAV = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'components', label: 'Components', active: true },
  { id: 'patterns', label: 'Patterns' },
  { id: 'templates', label: 'Templates' },
  { id: 'registry', label: 'Registry' },
  { id: 'doc-primitives', label: 'Doc primitives' },
  { id: 'miel', label: 'MIEL' },
]

const LAYER_ICONS: Record<string, string> = {
  primitives: 'category',
  components: 'widgets',
  patterns: 'dashboard',
}

export function DocsLayout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const allItems = useMemo(() => {
    const contracts = getAllContracts()
    return Object.entries(contracts).map(([id, item]) => ({
      id,
      label: item.name,
      group: item.layer,
      icon: LAYER_ICONS[item.layer] || 'article',
      meta: item.summary,
    }))
  }, [])

  const results: SearchResult[] = useMemo(() => {
    if (searchValue.length < 1) return []
    const q = searchValue.toLowerCase()
    return allItems
      .filter(item => item.label.toLowerCase().includes(q) || item.meta?.toLowerCase().includes(q))
      .slice(0, 20)
  }, [searchValue, allItems])

  const searchTrigger = (
    <button
      type="button"
      className={css.searchTrigger}
      onClick={() => setSearchOpen(true)}
      aria-label="Search"
    >
      <span className="flow-symbol" aria-hidden="true">search</span>
      <span className={css.searchLabel}>Search</span>
      <kbd className={css.searchKbd}>⌘K</kbd>
    </button>
  )

  return (
    <div className={css.layout}>
      <TopBar
        surface="glass"
        logo={<FlowLogo height={36} />}
        navItems={DOCS_NAV}
        sticky
        version="v2.4"
        trailing={searchTrigger}
      />
      <main className={css.main}>
        <Outlet />
      </main>
      <GlobalSearch
        mode="palette"
        open={searchOpen}
        onOpenChange={setSearchOpen}
        value={searchValue}
        onValueChange={setSearchValue}
        results={results}
        groupOrder={['primitives', 'components', 'patterns']}
        placeholder="Search components, patterns, tokens…"
        emptyTitle="Search the design system"
        emptyDescription="Find components, patterns, and tokens by name."
        noResultsTitle={(q) => `No results for "${q}"`}
        onSelect={(item) => {
          navigate({ to: '/docs/$componentId', params: { componentId: item.id } })
          setSearchOpen(false)
          setSearchValue('')
        }}
      />
    </div>
  )
}
