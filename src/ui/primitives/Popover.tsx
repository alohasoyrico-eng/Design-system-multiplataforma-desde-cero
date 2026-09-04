import { useState, useRef, useEffect, useCallback, type CSSProperties, type ReactNode, type RefObject } from 'react'
import css from './Popover.module.css'

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right'
export type PopoverPlacement =
  | PopoverSide
  | `${PopoverSide}-${'start' | 'center' | 'end'}`

export interface PopoverProps {
  trigger?: ReactNode
  /** @deprecated Usa placement ('left' ≙ bottom-start, 'right' ≙ bottom-end). */
  align?: 'left' | 'right'
  /** Lado y alineación en el eje cruzado. Default 'bottom-start'. */
  placement?: PopoverPlacement
  /** Separación en px entre ancla y panel. Default 6. */
  offset?: number
  /** Ancla externa: el panel se posiciona (fixed) junto a ese elemento en vez del trigger. */
  anchorRef?: RefObject<HTMLElement | null>
  /** El panel toma el ancho del ancla (dropdowns tipo Select). Default false. */
  matchAnchorWidth?: boolean
  minWidth?: number
  /** 'none' deja el panel sin piel: el consumidor la pinta. El shell sigue siendo dueño del anclaje y la colisión. */
  surface?: 'card' | 'none'
  /** false para un panel que no se puede señalar (tooltips informativos). Default true. */
  interactive?: boolean
  /** Al cerrar, el foco regresa a este elemento (default: el trigger). */
  returnFocusRef?: RefObject<HTMLElement | null>
  children: ReactNode | ((helpers: { close: () => void }) => ReactNode)
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** El envoltorio del trigger es inline (shrink-to-fit) para menus y botones.
      Un control de campo (Select) necesita llenar su contenedor: sin esto, el
      ancho depende del contenido y asignar/limpiar mueve el layout. */
  fillTrigger?: boolean
}

function splitPlacement(placement: PopoverPlacement): [PopoverSide, 'start' | 'center' | 'end'] {
  const [side, cross] = placement.split('-') as [PopoverSide, 'start' | 'center' | 'end' | undefined]
  return [side, cross ?? (side === 'top' || side === 'bottom' ? 'start' : 'center')]
}

export function Popover({
  trigger,
  fillTrigger,
  align,
  placement,
  offset = 6,
  anchorRef,
  matchAnchorWidth = false,
  minWidth,
  surface = 'card',
  interactive = true,
  returnFocusRef,
  children,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOpen !== undefined ? onOpenChange : setInternalOpen
  const trigRef = useRef<HTMLSpanElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const [anchorBox, setAnchorBox] = useState<DOMRect | null>(null)

  const resolved: PopoverPlacement = placement ?? (align === 'right' ? 'bottom-end' : 'bottom-start')
  const [side, cross] = splitPlacement(resolved)

  const close = useCallback(() => {
    setOpen?.(false)
    const target = returnFocusRef?.current ?? trigRef.current?.querySelector<HTMLElement>('button, [tabindex], input, a')
    target?.focus()
  }, [setOpen, returnFocusRef])

  // Ancla externa: mide y sigue al elemento mientras el panel está abierto.
  useEffect(() => {
    if (!open || !anchorRef) return
    const measure = () => {
      const el = anchorRef.current
      if (el) setAnchorBox(el.getBoundingClientRect())
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (trigRef.current?.contains(e.target as Node)) return
      if (popRef.current?.contains(e.target as Node)) return
      if (anchorRef?.current?.contains(e.target as Node)) return
      close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, close, anchorRef])

  useEffect(() => {
    if (!open) return
    // a11y-5: Escape cierra la capa mas alta y solo esa. El popover corre en
    // captura (antes que el dialogo de abajo) y marca el evento consumido.
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); close() }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [open, close])

  const panelStyle: CSSProperties = {}
  if (offset !== 6) panelStyle['--popover-offset' as never] = `${offset}px` as never
  if (minWidth !== undefined) panelStyle.minWidth = minWidth
  if (matchAnchorWidth && !anchorRef) panelStyle.width = '100%'

  if (anchorRef && anchorBox) {
    panelStyle.position = 'fixed'
    if (side === 'bottom') panelStyle.top = anchorBox.bottom + offset
    if (side === 'top') panelStyle.bottom = window.innerHeight - anchorBox.top + offset
    if (side === 'left') panelStyle.right = window.innerWidth - anchorBox.left + offset
    if (side === 'right') panelStyle.left = anchorBox.right + offset
    if (side === 'top' || side === 'bottom') {
      if (cross === 'start') panelStyle.left = anchorBox.left
      if (cross === 'end') panelStyle.right = window.innerWidth - anchorBox.right
      if (cross === 'center') { panelStyle.left = anchorBox.left + anchorBox.width / 2; panelStyle.transform = 'translateX(-50%)' }
    } else {
      if (cross === 'start') panelStyle.top = anchorBox.top
      if (cross === 'end') panelStyle.bottom = window.innerHeight - anchorBox.bottom
      if (cross === 'center') { panelStyle.top = anchorBox.top + anchorBox.height / 2; panelStyle.transform = 'translateY(-50%)' }
    }
    if (matchAnchorWidth) panelStyle.width = anchorBox.width
  }

  const panel = open && (
    <div
      ref={popRef}
      className={css.drop}
      data-side={anchorRef ? undefined : side}
      data-cross={anchorRef ? undefined : cross}
      data-surface={surface}
      data-interactive={interactive || undefined}
      style={panelStyle}
    >
      {typeof children === 'function' ? children({ close }) : children}
    </div>
  )

  if (anchorRef) return <>{panel}</>

  return (
    <div className={css.root} data-fill={fillTrigger || undefined}>
      <span ref={trigRef} className={css.trigger} data-fill={fillTrigger || undefined} onClick={() => setOpen?.(!open)}>
        {trigger}
      </span>
      {panel}
    </div>
  )
}
