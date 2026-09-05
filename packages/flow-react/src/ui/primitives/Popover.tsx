import { useState, useRef, useEffect, useLayoutEffect, useCallback, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
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
  /** Ancla externa: el panel se posiciona junto a ese elemento en vez del trigger. */
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
  /** mnu-5: la raiz declara su alineacion propia — como hijo de un flex de
      alto fijo se estiraba y el disparador con el. La fija el dueno (Menu),
      no el shell: un control de campo en columna necesita el stretch. */
  selfAlign?: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch'
}

function splitPlacement(placement: PopoverPlacement): [PopoverSide, 'start' | 'center' | 'end'] {
  const [side, cross] = placement.split('-') as [PopoverSide, 'start' | 'center' | 'end' | undefined]
  return [side, cross ?? (side === 'top' || side === 'bottom' ? 'start' : 'center')]
}

// pp-2: margen contra la ventana en el eje cruzado
const MARGEN = 8
const OPUESTO: Record<PopoverSide, PopoverSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

export function Popover({
  trigger,
  fillTrigger,
  selfAlign,
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
  const [pos, setPos] = useState<CSSProperties | null>(null)
  const [realSide, setRealSide] = useState<PopoverSide | null>(null)

  const resolved: PopoverPlacement = placement ?? (align === 'right' ? 'bottom-end' : 'bottom-start')
  const [side, cross] = splitPlacement(resolved)

  const close = useCallback(() => {
    setOpen?.(false)
    // pp-3: un panel no interactivo cierra sin mover el foco, porque nunca lo tuvo
    if (!interactive) return
    const target = returnFocusRef?.current ?? trigRef.current?.querySelector<HTMLElement>('button, [tabindex], input, a')
    target?.focus()
  }, [setOpen, returnFocusRef, interactive])

  // pp-5: mide el ancla (externa o trigger) y la sigue en scroll y resize.
  useEffect(() => {
    if (!open) return
    const measure = () => {
      const el = anchorRef?.current ?? trigRef.current
      if (el) setAnchorBox(el.getBoundingClientRect())
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
      setAnchorBox(null)
      setPos(null)
      setRealSide(null)
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

  // pp-2: colisión en dos pasadas — el panel ya montado se mide, se decide el
  // flip (solo si al otro lado cabe mejor) y se fija la posición. Sobre el eje
  // principal nunca se desliza sobre el ancla: si no cabe, scroll interno.
  useLayoutEffect(() => {
    if (!open || !anchorBox || !popRef.current) return
    const pw = popRef.current.offsetWidth
    const ph = popRef.current.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    const espacio: Record<PopoverSide, number> = {
      top: anchorBox.top - offset,
      bottom: vh - anchorBox.bottom - offset,
      left: anchorBox.left - offset,
      right: vw - anchorBox.right - offset,
    }
    const cabe = (l: PopoverSide) => (l === 'top' || l === 'bottom' ? ph : pw) <= espacio[l]
    let s = side
    if (!cabe(s) && espacio[OPUESTO[s]] > espacio[s]) s = OPUESTO[s]

    const st: CSSProperties = { position: 'fixed' }
    if (s === 'bottom') st.top = anchorBox.bottom + offset
    if (s === 'top') st.bottom = vh - anchorBox.top + offset
    if (s === 'left') st.right = vw - anchorBox.left + offset
    if (s === 'right') st.left = anchorBox.right + offset
    if (!cabe(s)) {
      if (s === 'top' || s === 'bottom') { st.maxHeight = Math.max(0, espacio[s]); st.overflowY = 'auto' }
      else { st.maxWidth = Math.max(0, espacio[s]); st.overflowX = 'auto' }
    }
    // eje cruzado: se recorta contra la ventana con 8px de margen
    if (s === 'top' || s === 'bottom') {
      const left = cross === 'start' ? anchorBox.left
        : cross === 'end' ? anchorBox.right - pw
        : anchorBox.left + anchorBox.width / 2 - pw / 2
      st.left = Math.min(Math.max(left, MARGEN), Math.max(MARGEN, vw - pw - MARGEN))
    } else {
      const top = cross === 'start' ? anchorBox.top
        : cross === 'end' ? anchorBox.bottom - ph
        : anchorBox.top + anchorBox.height / 2 - ph / 2
      st.top = Math.min(Math.max(top, MARGEN), Math.max(MARGEN, vh - ph - MARGEN))
    }
    if (matchAnchorWidth) st.width = anchorBox.width
    if (minWidth !== undefined) st.minWidth = minWidth
    setPos(st)
    setRealSide(s)
  }, [open, anchorBox, side, cross, offset, matchAnchorWidth, minWidth])

  // Antes de conocer la posición, el panel se monta invisible para medirse.
  const panelStyle: CSSProperties = pos ?? {
    position: 'fixed',
    top: 0,
    left: 0,
    visibility: 'hidden',
    ...(minWidth !== undefined ? { minWidth } : {}),
    ...(matchAnchorWidth && anchorBox ? { width: anchorBox.width } : {}),
  }

  // pp-1: el panel vive en un portal — ningún overflow del ancestro lo recorta.
  const panel = open && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={popRef}
          className={css.drop}
          data-side={realSide ?? side}
          data-cross={cross}
          data-surface={surface}
          data-interactive={interactive || undefined}
          style={panelStyle}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>,
        document.body,
      )
    : null

  if (!trigger) return <>{panel}</>

  return (
    <div className={css.root} data-fill={fillTrigger || undefined} style={selfAlign ? { alignSelf: selfAlign } : undefined}>
      <span ref={trigRef} className={css.trigger} data-fill={fillTrigger || undefined} onClick={() => setOpen?.(!open)}>
        {trigger}
      </span>
      {panel}
    </div>
  )
}
