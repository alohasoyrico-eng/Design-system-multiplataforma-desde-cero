import { useRef, useLayoutEffect, useState, useCallback, type CSSProperties, type KeyboardEvent } from 'react'
import css from './SegmentedControl.module.css'

export interface SegmentedItem {
  value: string
  label: string
  icon?: string
}

export interface SegmentedControlProps {
  items: SegmentedItem[]
  value: string
  onChange?: (value: string) => void
  size?: 'md' | 'sm'
  style?: CSSProperties
}

export function SegmentedControl({ items, value, onChange, size = 'md', style }: SegmentedControlProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)

  /**
   * sgc-1: la píldora SIGUE a su casilla.
   *
   * La medida se tomaba una vez por cambio de valor o de número de casillas, y
   * la geometría cambia por más motivos: reetiquetar (otro idioma, una cifra
   * viva en la etiqueta) mueve el ancho sin mover la cuenta, y el contenedor
   * puede estrecharse o la tipografía cargar tarde. La píldora se quedaba con
   * la medida vieja y desbordaba a la casilla vecina (cazado en eOne).
   */
  useLayoutEffect(() => {
    const el = buttonRefs.current[value]
    if (!el) return
    const medir = () => {
      const left = el.offsetLeft
      const width = el.offsetWidth
      // Sin cambio no hay estado nuevo: el observador dispara en cada pintado.
      setIndicator((prev) => (prev && prev.left === left && prev.width === width ? prev : { left, width }))
    }
    medir()
    if (typeof ResizeObserver === 'undefined') return
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    if (rootRef.current) observador.observe(rootRef.current)
    return () => observador.disconnect()
  }, [value, items.length])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const idx = items.findIndex((i) => i.value === value)
      let next = idx
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = (idx + 1) % items.length
        e.preventDefault()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = (idx - 1 + items.length) % items.length
        e.preventDefault()
      } else if (e.key === 'Home') {
        next = 0
        e.preventDefault()
      } else if (e.key === 'End') {
        next = items.length - 1
        e.preventDefault()
      } else {
        return
      }
      const nextValue = items[next].value
      onChange?.(nextValue)
      buttonRefs.current[nextValue]?.focus()
    },
    [items, value, onChange],
  )

  return (
    <div ref={rootRef} role="tablist" className={css.root} data-size={size !== 'md' ? size : undefined} style={style} onKeyDown={handleKeyDown}>
      {indicator && (
        <span
          aria-hidden="true"
          className={css.indicator}
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            ref={(el) => { buttonRefs.current[item.value] = el }}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            data-active={active || undefined}
            className={css.segment}
            onClick={() => onChange?.(item.value)}
          >
            {item.icon && (
              <span className={`flow-symbol ${css.segmentIcon}`} aria-hidden="true">
                {item.icon}
              </span>
            )}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
