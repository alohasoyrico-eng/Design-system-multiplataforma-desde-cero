import { cloneElement, isValidElement, useRef, useState, type ReactNode, type CSSProperties, type KeyboardEvent } from 'react'
import { Popover } from '../primitives/Popover'
import css from './Menu.module.css'

export interface MenuItem {
  label: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  onClick?: () => void
}

export type MenuItemOrDivider = MenuItem | 'divider'

export interface MenuProps {
  trigger: ReactNode
  items?: MenuItemOrDivider[]
  align?: 'left' | 'right'
  style?: CSSProperties
}

export function Menu({ trigger, items = [], align = 'left', style }: MenuProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // mnu-1: el foco entra al primer item usable al abrir (el regreso al
  // disparador lo garantiza Popover al cerrar).
  const usables = () =>
    panelRef.current
      ? Array.from(panelRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'))
      : []
  const focusItem = (dir: 1 | -1, from?: HTMLElement | null) => {
    const usable = usables()
    if (!usable.length) return
    const idx = from ? usable.indexOf(from as HTMLButtonElement) : dir === 1 ? -1 : 0
    usable[(idx + dir + usable.length) % usable.length].focus()
  }
  const focusEdge = (edge: 'first' | 'last') => {
    const usable = usables()
    usable[edge === 'first' ? 0 : usable.length - 1]?.focus()
  }

  // mnu-2: flechas recorren los items usables saltando divisores y
  // deshabilitados; Home y End van a los extremos.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = document.activeElement as HTMLElement | null
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(1, current) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(-1, current) }
    else if (e.key === 'Home') { e.preventDefault(); focusEdge('first') }
    else if (e.key === 'End') { e.preventDefault(); focusEdge('last') }
  }

  // El disparador real anuncia que abre un menu y si esta abierto.
  const decoratedTrigger = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })
    : trigger

  return (
    <Popover
      trigger={decoratedTrigger}
      align={align}
      open={open}
      onOpenChange={setOpen}
      selfAlign="center"
    >
      {({ close }) => (
        <div
          role="menu"
          ref={el => {
            panelRef.current = el
            if (el && !el.contains(document.activeElement)) focusItem(1, null)
          }}
          onKeyDown={onKeyDown}
          style={{ minWidth: 180, ...style }}
        >
          {items.map((item, i) => {
            if (item === 'divider') {
              return <div key={'d' + i} role="separator" className={css.divider} />
            }
            return (
              <button
                key={item.label}
                role="menuitem"
                className={css.menuItem}
                data-danger={item.danger || undefined}
                disabled={item.disabled}
                onClick={() => { item.onClick?.(); close() }}
              >
                {item.icon && <span className={`flow-symbol ${css.menuItemIcon}`} aria-hidden="true">{item.icon}</span>}
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </Popover>
  )
}
