import { useState, useRef, useCallback, useEffect, type ReactNode, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import css from './Listbox.module.css'

export interface ListboxItem {
  value: string | number
  label: string
  group?: string
  disabled?: boolean
  [key: string]: unknown
}

export interface ListboxProps<T extends ListboxItem = ListboxItem> {
  /** Modo combobox: el dueño (Select) conduce el resaltado desde su trigger y
      este indice manda; el interno queda para uso directo. */
  active?: number
  onActiveChange?: (index: number) => void
  items?: T[]
  value?: string | number
  onChange?: (item: T) => void
  renderItem?: (item: T, state: { selected: boolean; active: boolean }) => ReactNode
  id?: string
}

export function Listbox<T extends ListboxItem = ListboxItem>({ items = [], value, onChange, renderItem, id, active: controlado, onActiveChange,
}: ListboxProps<T>) {
  const [interno, setInterno] = useState(-1)
  const active = controlado ?? interno
  const setActive = (v: number | ((p: number) => number)) => {
    const next = typeof v === 'function' ? (v as (p: number) => number)(active) : v
    if (controlado === undefined) setInterno(next)
    onActiveChange?.(next)
  }
  const listRef = useRef<HTMLUListElement>(null)

  // lb-3: typeahead — las teclas imprimibles saltan al primer item que empieza así
  const typeahead = useRef({ q: '', t: 0 })

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      const len = items.length
      if (!len) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((p) => (p + 1) % len)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((p) => (p <= 0 ? len - 1 : p - 1))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setActive(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setActive(len - 1)
      } else if (e.key === 'Enter' && active >= 0) {
        e.preventDefault()
        onChange?.(items[active])
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const ahora = e.timeStamp
        const ta = typeahead.current
        ta.q = ahora - ta.t > 700 ? e.key : ta.q + e.key
        ta.t = ahora
        const q = ta.q.toLowerCase()
        const idx = items.findIndex((it) => String(it.label).toLowerCase().startsWith(q))
        if (idx >= 0) setActive(idx)
      }
    },
    [items, active, onChange],
  )

  useEffect(() => {
    if (active >= 0 && listRef.current) {
      const el = listRef.current.children[active] as HTMLElement | undefined
      el?.scrollIntoView?.({ block: 'nearest' })
    }
  }, [active])

  return (
    <ul
      ref={listRef}
      role="listbox"
      id={id}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      // lb-2: el resaltado viaja por aria-activedescendant; el foco no se mueve de fila
      aria-activedescendant={id && active >= 0 ? `${id}-opt-${active}` : undefined}
      className={css.root}
    >
      {items.map((item, i) => {
        const selected = value != null && item.value === value
        return (
          <li
            key={item.value ?? i}
            role="option"
            aria-selected={selected}
            className={css.option}
            id={id ? `${id}-opt-${i}` : undefined}
            data-active={i === active || undefined}
            data-selected={selected || undefined}
            onClick={() => onChange?.(item)}
            onMouseEnter={() => setActive(i)}
          >
            {renderItem ? renderItem(item, { selected, active: i === active }) : item.label}
          </li>
        )
      })}
    </ul>
  )
}
