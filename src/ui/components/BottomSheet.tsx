import type { ReactNode, CSSProperties } from 'react'
import { OverlayShell } from '../primitives/shells/OverlayShell'
import css from './BottomSheet.module.css'

export interface BottomSheetProps {
  open: boolean
  onClose?: () => void
  title?: string
  children?: ReactNode
  height?: string | number
  fixed?: boolean
  style?: CSSProperties
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  height,
  fixed = true,
  style,
}: BottomSheetProps) {
  return (
    <OverlayShell open={open} onClose={onClose} alignment="bottom">
      <div
        className={css.root}
        data-fixed={fixed || undefined}
        style={{ ...(height != null ? { height } : {}), ...style }}
      >
        <button
          className={css.handle}
          onClick={onClose}
          aria-label="Cerrar"
          type="button"
        >
          <span className={css.bar} />
        </button>

        {title && <div className={css.title}>{title}</div>}

        <div className={css.body}>{children}</div>
      </div>
    </OverlayShell>
  )
}
