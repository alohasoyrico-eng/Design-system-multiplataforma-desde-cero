import { useState, type ReactNode, type CSSProperties } from 'react'
import css from './TopBar.module.css'

export interface TopBarNavItem {
  id: string
  label: string
  href?: string
  active?: boolean
}

export interface TopBarEntity {
  id: string
  label: string
}

export interface TopBarBreadcrumb {
  label: string
  href?: string
}

export interface TopBarProps {
  variant?: 'standard' | 'minimal' | 'admin' | 'multientity' | 'mobile' | 'fullscreen'
  logo?: ReactNode
  navItems?: TopBarNavItem[]
  breadcrumb?: TopBarBreadcrumb[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  avatar?: ReactNode
  notificationCount?: number
  onNotifications?: () => void
  entities?: TopBarEntity[]
  currentEntity?: string
  onEntityChange?: (id: string) => void
  onToggleSidebar?: () => void
  style?: CSSProperties
}

export function TopBar({
  variant = 'standard',
  logo,
  navItems = [],
  breadcrumb = [],
  searchValue = '',
  onSearchChange,
  avatar,
  notificationCount = 0,
  onNotifications,
  entities = [],
  currentEntity = '',
  onEntityChange,
  onToggleSidebar,
  style,
}: TopBarProps) {
  const [showEntityMenu, setShowEntityMenu] = useState(false)

  if (variant === 'fullscreen') return null

  const renderStandard = () => (
    <>
      {logo && <div style={{ display: 'flex', alignItems: 'center' }}>{logo}</div>}
      <nav aria-label="Secciones" style={{ display: 'flex', gap: 20, flex: 1 }}>
        {navItems.map((n) => (
          <a
            key={n.id}
            href={n.href || '#'}
            className={css.navLink}
            data-active={n.active || undefined}
            aria-current={n.active ? 'page' : undefined}
          >
            {n.label}
          </a>
        ))}
      </nav>
      {avatar}
    </>
  )

  const renderMinimal = () => (
    <>
      {breadcrumb.length > 0 && (
        <nav aria-label="Ruta" className={css.breadcrumb}>
          {breadcrumb.map((c, i) => {
            const isLast = i === breadcrumb.length - 1
            return (
              <span key={i}>
                {i > 0 && <span aria-hidden="true" style={{ color: 'var(--text-muted)', marginRight: 8 }}>/</span>}
                {isLast ? (
                  <span className={css.breadcrumbCurrent} aria-current="page">{c.label}</span>
                ) : (
                  <a href={c.href || '#'} className={css.breadcrumbLink}>{c.label}</a>
                )}
              </span>
            )
          })}
        </nav>
      )}
      <div className={css.spacer} />
      {avatar}
    </>
  )

  const renderAdmin = () => (
    <>
      <div style={{ flex: 1, display: 'flex', gap: 12 }}>
        <input
          type="text"
          aria-label="Buscar unidades y conductores"
          placeholder="Buscar unidades, conductores…"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className={css.searchInput}
        />
      </div>
      {notificationCount > 0 && (
        <button
          type="button"
          className={css.iconBtn}
          onClick={onNotifications}
          aria-label={`${notificationCount} notificaciones sin leer`}
        >
          <span className="flow-icon" aria-hidden="true" style={{ fontSize: 20 }}>notifications</span>
          <span className={css.notifBadge} aria-hidden="true">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        </button>
      )}
      {avatar}
    </>
  )

  const currentEntityObj = entities.find((e) => e.id === currentEntity)

  const renderMultientity = () => (
    <>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          className={css.entityBtn}
          aria-haspopup="menu"
          aria-expanded={showEntityMenu}
          onClick={() => setShowEntityMenu((v) => !v)}
        >
          {currentEntityObj?.label || 'Selecciona…'}
          <span className="flow-icon" aria-hidden="true" style={{ fontSize: 16 }}>expand_more</span>
        </button>
        {showEntityMenu && (
          <div role="menu" className={css.entityMenu}>
            {entities.map((e) => (
              <button
                key={e.id}
                type="button"
                role="menuitem"
                className={css.entityOption}
                data-active={e.id === currentEntity || undefined}
                aria-current={e.id === currentEntity ? 'true' : undefined}
                onClick={() => { onEntityChange?.(e.id); setShowEntityMenu(false) }}
              >
                {e.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={css.spacer} />
      {avatar}
    </>
  )

  const renderMobile = () => (
    <>
      <button
        type="button"
        className={css.iconBtn}
        onClick={onToggleSidebar}
        aria-label="Abrir navegación"
      >
        <span className="flow-icon" aria-hidden="true" style={{ fontSize: 20 }}>menu</span>
      </button>
      {logo && <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{logo}</div>}
      {avatar}
    </>
  )

  const variants: Record<string, () => ReactNode> = {
    standard: renderStandard,
    minimal: renderMinimal,
    admin: renderAdmin,
    multientity: renderMultientity,
    mobile: renderMobile,
  }

  return (
    <header className={css.root} style={style}>
      {(variants[variant] || renderStandard)()}
    </header>
  )
}
