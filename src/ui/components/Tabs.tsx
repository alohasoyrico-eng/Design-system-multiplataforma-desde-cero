import { useRef, useEffect, useState, type CSSProperties } from 'react'
import css from './Tabs.module.css'

export interface TabItem {
  value: string
  label: string
  icon?: string
  count?: number
}

export interface TabsProps {
  items?: TabItem[]
  value?: string
  onChange?: (value: string) => void
  variant?: 'pill'
  style?: CSSProperties
}

export function Tabs({ items = [], value, onChange, variant = 'pill', style }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current.querySelector<HTMLElement>('[data-active]')
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [value, items])

  return (
    <div ref={containerRef} role="tablist" className={css.root} style={style}>
      <div
        className={css.indicator}
        aria-hidden="true"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            data-active={active || undefined}
            className={css.tab}
            onClick={() => onChange?.(item.value)}
          >
            {item.icon && <span className={`flow-icon ${css.tabIcon}`} aria-hidden="true">{item.icon}</span>}
            {item.label}
            {item.count != null && <span className={css.tabCount}>{item.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
