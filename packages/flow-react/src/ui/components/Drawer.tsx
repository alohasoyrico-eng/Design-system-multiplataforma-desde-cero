import { useId, type ReactNode } from 'react'
import { OverlayShell } from '../primitives/OverlayShell'
import { useT } from '../../i18n/useSafeIntl'
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
  const t = useT()
  const titleId = useId()
  return (
    <OverlayShell
      open={open}
      onClose={onClose}
      alignment={side === 'left' ? 'start' : 'end'}
      labelledBy={title ? titleId : undefined}
    >
      <div className={css.root} style={{ width }}>
        <div className={css.header}>
          <div id={titleId} className={css.title}>{title}</div>
          <button className={css.close} onClick={onClose} aria-label={t('common.close', 'Cerrar')}>
            <span className="flow-symbol flow-symbol--default" aria-hidden="true">close</span>
          </button>
        </div>
        <div className={css.body}>{children}</div>
        {footer && <div className={css.footer}>{footer}</div>}
      </div>
    </OverlayShell>
  )
}
