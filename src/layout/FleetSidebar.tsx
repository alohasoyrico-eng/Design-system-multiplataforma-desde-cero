import { Link, useMatchRoute } from '@tanstack/react-router'
import { Avatar } from '../ui/primitives/Avatar'
import css from '../App.module.css'

const DASHBOARDS: [string, string, string][] = [
  ['/', 'space_dashboard', 'Overview'],
  ['/combustible', 'local_gas_station', 'Combustible'],
  ['/mantenimiento', 'build', 'Mantenimiento'],
  ['/electro', 'bolt', 'Electromovilidad'],
  ['/peaje', 'toll', 'Peaje'],
  ['/finanzas', 'payments', 'Finanzas'],
]

const NAV: [string, string, string][] = [
  ['/unidades', 'local_taxi', 'Unidades'],
  ['/conductores', 'group', 'Conductores'],
  ['/asistente', 'smart_toy', 'Asistente'],
  ['/reportes', 'monitoring', 'Reportes'],
  ['/mobile', 'smartphone', 'Mobile'],
  ['/ajustes', 'settings', 'Ajustes'],
]

export function FleetSidebar() {
  const matchRoute = useMatchRoute()
  return (
    <nav aria-label="Principal" className={css.sidebar}>
      <img src="/assets/flow-logo.png" alt="Flow" className={css.sidebarLogo} />
      <div className={css.sidebarGroup}>Dashboards</div>
      {DASHBOARDS.map(([to, icon, label]) => {
        const active = !!matchRoute({ to })
        return (
          <Link key={to} to={to} className={css.sidebarItem} data-active={active || undefined}>
            <span className={'flow-icon' + (active ? ' flow-icon--fill' : '') + ' ' + css.sidebarIcon} aria-hidden="true">{icon}</span>
            {label}
          </Link>
        )
      })}
      {NAV.map(([to, icon, label]) => {
        const active = !!matchRoute({ to })
        return (
          <Link key={to} to={to} className={css.sidebarItem} data-active={active || undefined}>
            <span className={'flow-icon' + (active ? ' flow-icon--fill' : '') + ' ' + css.sidebarIcon} aria-hidden="true">{icon}</span>
            {label}
          </Link>
        )
      })}
      <div className={css.sidebarUser}>
        <Avatar name="Marta Vidal" status="online" />
        <div className={css.sidebarUserInfo}>
          <div className={css.sidebarUserName}>Marta Vidal</div>
          <div className={css.sidebarUserRole}>Fleet admin</div>
        </div>
      </div>
    </nav>
  )
}
