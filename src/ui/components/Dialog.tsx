import type { ReactNode } from 'react'
import { OverlayShell } from '../primitives/OverlayShell'
import css from './Dialog.module.css'

export interface DialogProps {
  open: boolean
  onClose?: () => void
  title?: string
  description?: string
  actions?: ReactNode
  tone?: 'danger'
  /** Ancho del modal (número en px o string CSS). Default el max-width del shell. */
  width?: number | string
  children?: ReactNode
}

export function Dialog({ open, onClose, title, description, actions, tone, width, children }: DialogProps) {
  return (
    <OverlayShell open={open} onClose={onClose}>
      <div className={css.root} style={width !== undefined ? { width, maxWidth: '90vw' } : undefined}>
        {title && <div className={css.title} data-tone={tone || undefined}>{title}</div>}
        {description && <div className={css.description}>{description}</div>}
        {children}
        {actions && <div className={css.actions}>{actions}</div>}
      </div>
    </OverlayShell>
  )
}
