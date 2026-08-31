import type { CSSProperties } from 'react'
import css from './TabBar.module.css'

export interface TabBarItem {
  id: string
  label: string
  icon: string
  badge?: number | true
}

export interface TabBarProps {
  items: TabBarItem[]
  activeId: string
  onChange?: (id: string) => void
  style?: CSSProperties
}

export function TabBar({ items, activeId, onChange, style }: TabBarProps) {
  return (
    <nav className={css.root} style={style} role="tablist">
      {items.map(item => {
        const active = item.id === activeId
        const badgeText = item.badge === true ? '' : (item.badge && item.badge > 9 ? '9+' : String(item.badge ?? ''))

        return (
          <button
            key={item.id}
            className={css.item}
            data-active={active || undefined}
            role="tab"
            aria-selected={active}
            aria-current={active ? 'page' : undefined}
            aria-label={item.badge ? `${item.label}, ${badgeText || 'notificación'}` : item.label}
            onClick={() => onChange?.(item.id)}
            type="button"
          >
            <span className={css.iconWrap}>
              <span className="flow-icon" aria-hidden="true" data-active={active || undefined}>
                {item.icon}
              </span>
              {item.badge !== undefined && (
                <span className={css.badge} aria-hidden="true">
                  {badgeText}
                </span>
              )}
            </span>
            <span className={css.label}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
