import { useState, type ReactNode, type CSSProperties } from 'react'
import css from './Sidebar.module.css'

export interface SidebarItem {
  id: string
  label: string
  icon?: string
  href?: string
  /** Contador (número, 99+ al pasar) o punto vivo (true). Colapsado, el
      contador viaja al nombre accesible y el punto se posa en el icono. */
  badge?: number | boolean
  children?: SidebarItem[]
}

export interface SidebarProps {
  items: SidebarItem[]
  activeId?: string
  collapsed?: boolean
  expandedSections?: Set<string>
  onNavigate?: (id: string, href?: string) => void
  onToggleSection?: (id: string) => void
  headerContent?: ReactNode
  footerActions?: ReactNode
  width?: string
  style?: CSSProperties
}

export function Sidebar({
  items,
  activeId = '',
  collapsed = false,
  expandedSections = new Set(),
  onNavigate,
  onToggleSection,
  headerContent,
  footerActions,
  width = '240px',
  style,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const renderItem = (item: SidebarItem, level: number) => {
    const isSection = !!(item.children && item.children.length)
    const isOpen = expandedSections.has(item.id)
    const isActive = item.id === activeId
    const isHovered = hoveredId === item.id
    const indent = 12 + level * 12

    return (
      <div key={item.id}>
        <button
          type="button"
          className={css.item}
          aria-label={collapsed ? (typeof item.badge === 'number' ? `${item.label} (${item.badge})` : item.label) : undefined}
          aria-current={isActive && !isSection ? 'page' : undefined}
          aria-expanded={isSection ? isOpen : undefined}
          data-active={isActive || undefined}
          onClick={() => {
            if (isSection) onToggleSection?.(item.id)
            else onNavigate?.(item.id, item.href)
          }}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            padding: collapsed ? 12 : `8px ${indent}px`,
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: collapsed ? 'var(--radius-pill)' : 'var(--radius-sm)',
          }}
        >
          {item.icon && (
            <span className={`flow-symbol ${css.itemIcon}`} aria-hidden="true">
              {item.icon}
            </span>
          )}
          {!collapsed && <span className={css.itemLabel}>{item.label}</span>}
          {!collapsed && item.badge != null && item.badge !== false && (
            <span className={css.badge} data-dot={item.badge === true || undefined} aria-hidden={item.badge === true || undefined}>
              {typeof item.badge === 'number' ? (item.badge > 99 ? '99+' : item.badge) : ''}
            </span>
          )}
          {collapsed && item.badge ? <span className={css.badgeCollapsed} aria-hidden="true" /> : null}
          {!collapsed && isSection && (
            <span
              className={`flow-symbol ${css.chevron}`}
              aria-hidden="true"
              data-open={isOpen || undefined}
            >
              expand_more
            </span>
          )}
          {collapsed && isHovered && (
            <span className={css.tooltip} aria-hidden="true">
              {item.label}
            </span>
          )}
        </button>
        {isSection && isOpen && !collapsed && (
          <div className={css.sectionChildren}>
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside
      className={css.root}
      style={{ width: collapsed ? 60 : width, ...style }}
    >
      {headerContent && (
        <div
          className={css.header}
          style={{
            padding: collapsed ? 8 : 16,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          {headerContent}
        </div>
      )}
      <nav
        className={css.nav}
        aria-label="Navegación principal"
        style={{ padding: collapsed ? '8px 0' : '12px 0' }}
      >
        {items.map((item) => renderItem(item, 0))}
      </nav>
      {footerActions && (
        <div
          className={css.footer}
          style={{
            padding: collapsed ? 8 : 14,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          {footerActions}
        </div>
      )}
    </aside>
  )
}
