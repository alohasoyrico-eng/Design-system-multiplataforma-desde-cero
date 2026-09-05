import { useEffect, useRef, useCallback, type ReactNode, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import css from './OverlayShell.module.css'

export interface OverlayShellProps {
  open: boolean
  onClose?: () => void
  alignment?: 'center' | 'end' | 'start' | 'bottom'
  /** false para diálogos que exigen decisión: el backdrop no cierra. Default true. */
  dismissOnBackdrop?: boolean
  /** Id del titulo que etiqueta este dialogo (aria-labelledby en la carcasa). */
  labelledBy?: string
  children: ReactNode
}

export function OverlayShell({ open, onClose, alignment = 'center', dismissOnBackdrop = true, labelledBy, children }: OverlayShellProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // a11y-5: si una capa mas alta (popover, menu) ya consumio el Escape,
  // este dialogo no cae con ella.
  // bsh-3 / a11y-4: Tab cicla dentro del marco — el foco no se escapa del
  // dialogo por el final ni por el principio.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented && !e.nativeEvent.defaultPrevented) {
        e.preventDefault()
        e.stopPropagation()
        onClose?.()
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
        if (!focusables.length) return
        const primero = focusables[0]
        const ultimo = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault()
          ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          primero.focus()
        }
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    const el = panelRef.current
    if (el) {
      const focusable = el.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      focusable?.focus()
    }
    return () => {
      document.body.style.overflow = ''
      if (prev instanceof HTMLElement) prev.focus()
    }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  // El dialogo vive en un portal: ningún transform/overflow del ancestro lo
  // atrapa (position:fixed dentro de un containing block deja de ser fixed).
  return createPortal(
    <div className={css.root} data-alignment={alignment} onKeyDown={handleKeyDown}>
      <div className={css.backdrop} onClick={dismissOnBackdrop ? onClose : undefined} />
      <div ref={panelRef} className={css.panel} role="dialog" aria-labelledby={labelledBy} aria-modal="true">
        {children}
      </div>
    </div>,
    document.body,
  )
}
