import { useState, useCallback, useMemo } from 'react'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { Toast, ToastStack } from '../ui/primitives/Toast'
import { GlobalSearch, type SearchResult } from '../ui/patterns/GlobalSearch'
import { FleetSidebar } from './FleetSidebar'
import { NotifyProvider } from '../app/NotifyContext'
import { SearchProvider } from '../app/SearchContext'
import { SidebarProvider } from '../app/SidebarContext'
import css from './AppLayout.module.css'

const SEARCH_SUGGESTIONS = ['combustible', 'mantenimiento', 'KTR-882', 'Marta Vidal']

const DEMO_DATA: SearchResult[] = [
  { id: 'u-1', label: 'KTR-882', meta: 'Nissan NV200 · CDMX', group: 'Unidades', icon: 'local_taxi', mono: true },
  { id: 'u-2', label: 'FLT-115', meta: 'Toyota Hilux · Guadalajara', group: 'Unidades', icon: 'local_taxi', mono: true },
  { id: 'u-3', label: 'MXL-204', meta: 'Ford Transit · Monterrey', group: 'Unidades', icon: 'local_taxi', mono: true },
  { id: 'u-4', label: 'EDN-067', meta: 'BYD T3 · Puebla', group: 'Unidades', icon: 'local_taxi', mono: true },
  { id: 'c-1', label: 'Marta Vidal', meta: 'Fleet admin · CDMX', group: 'Conductores', icon: 'person' },
  { id: 'c-2', label: 'Carlos Ríos', meta: 'Conductor · Guadalajara', group: 'Conductores', icon: 'person' },
  { id: 'c-3', label: 'Ana Martínez', meta: 'Supervisora · Monterrey', group: 'Conductores', icon: 'person' },
  { id: 'v-1', label: 'Viaje #4821', meta: 'CDMX → Puebla · 12 ago', group: 'Viajes', icon: 'navigation', mono: true },
  { id: 'v-2', label: 'Viaje #4815', meta: 'Guadalajara → León · 11 ago', group: 'Viajes', icon: 'navigation', mono: true },
  { id: 'd-1', label: 'Overview', group: 'Dashboards', icon: 'space_dashboard' },
  { id: 'd-2', label: 'Combustible', group: 'Dashboards', icon: 'local_gas_station' },
  { id: 'd-3', label: 'Mantenimiento', group: 'Dashboards', icon: 'build' },
  { id: 'd-4', label: 'Electromovilidad', group: 'Dashboards', icon: 'bolt' },
  { id: 'd-5', label: 'Finanzas', group: 'Dashboards', icon: 'payments' },
]

const ROUTES: Record<string, string> = {
  'u-1': '/unidades', 'u-2': '/unidades', 'u-3': '/unidades', 'u-4': '/unidades',
  'c-1': '/conductores', 'c-2': '/conductores', 'c-3': '/conductores',
  'v-1': '/', 'v-2': '/',
  'd-1': '/', 'd-2': '/combustible', 'd-3': '/mantenimiento', 'd-4': '/electro', 'd-5': '/finanzas',
}

export function AppLayout() {
  const [toast, setToast] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recents, setRecents] = useState<SearchResult[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const notify = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const openSearch = useCallback(() => setSearchOpen(true), [])

  const results = useMemo(() => {
    if (searchQuery.length < 1) return []
    const q = searchQuery.toLowerCase()
    return DEMO_DATA.filter(r =>
      r.label.toLowerCase().includes(q) ||
      r.meta?.toLowerCase().includes(q) ||
      r.group?.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const onSelect = useCallback((item: SearchResult) => {
    setRecents(prev => {
      const without = prev.filter(r => r.id !== item.id)
      return [item, ...without].slice(0, 5)
    })
    const route = ROUTES[item.id]
    if (route) navigate({ to: route })
  }, [navigate])

  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), [])

  return (
    <NotifyProvider value={notify}>
      <SearchProvider value={openSearch}>
        <SidebarProvider value={toggleSidebar}>
        <div className={css.app}>
          <FleetSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className={css.main}>
            <Outlet />
          </main>
          <GlobalSearch
            mode="palette"
            open={searchOpen}
            onOpenChange={setSearchOpen}
            value={searchQuery}
            onValueChange={setSearchQuery}
            results={results}
            recents={recents}
            onClearRecents={() => setRecents([])}
            onSelect={onSelect}
            groupOrder={['Unidades', 'Conductores', 'Viajes', 'Dashboards']}
            suggestions={SEARCH_SUGGESTIONS}
            placeholder="Buscar…"
          />
          {toast && (
            <ToastStack>
              <Toast tone="success" message={toast} onDismiss={() => setToast(null)} />
            </ToastStack>
          )}
        </div>
      </SidebarProvider>
      </SearchProvider>
    </NotifyProvider>
  )
}
