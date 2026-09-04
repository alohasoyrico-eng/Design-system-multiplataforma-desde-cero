import { useEffect, useRef, useCallback, type ReactNode, type KeyboardEvent } from 'react'
import css from './OverlayShell.module.css'

export interface OverlayShellProps {
  open: boolean
  onClose?: () => void
  alignment?: 'center' | 'end' | 'start' | 'bottom'
  /** Id del titulo que etiqueta este dialogo (aria-labelledby en la carcasa). */
  labelledBy?: string
  children: ReactNode
}

export function OverlayShell({ open, onClose, alignment = 'center', labelledBy, children }: OverlayShellProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
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

  if (!open) return null

  return (
    <div className={css.root} data-alignment={alignment} onKeyDown={handleKeyDown}>
      <div className={css.backdrop} onClick={onClose} />
      <div ref={panelRef} className={css.panel} role="dialog" aria-labelledby={labelledBy} aria-modal="true">
        {children}
      </div>
    </div>
  )
}
