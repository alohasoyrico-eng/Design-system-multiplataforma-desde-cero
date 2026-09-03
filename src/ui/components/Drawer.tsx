import type { ReactNode } from 'react'
import { OverlayShell } from '../primitives/OverlayShell'
import css from './Drawer.module.css'

export interface DrawerProps {
  open: boolean
  onClose?: () => void
  title?: string
  width?: number
  /** Lado desde el que entra. Default 'right'. */
  side?: 'right' | 'left'
  footer?: ReactNode
  children?: ReactNode
}

export function Drawer({ open, onClose, title, width = 380, side = 'right', footer, children }: DrawerProps) {
  return (
    <OverlayShell open={open} onClose={onClose} alignment={side === 'left' ? 'start' : 'end'}>
      <div className={css.root} style={{ width }}>
        <div className={css.header}>
          <div className={css.title}>{title}</div>
          <button className={css.close} onClick={onClose} aria-label="Cerrar">
            <span className="flow-symbol flow-symbol--default" aria-hidden="true">close</span>
          </button>
        </div>
        <div className={css.body}>{children}</div>
        {footer && <div className={css.footer}>{footer}</div>}
      </div>
    </OverlayShell>
  )
}
