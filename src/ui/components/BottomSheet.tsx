import type { ReactNode, CSSProperties } from 'react'
import { IconButton } from '../primitives/IconButton'
import { OverlayShell } from '../primitives/OverlayShell'
import { useT } from '../../i18n/useSafeIntl'
import css from './BottomSheet.module.css'

export interface BottomSheetProps {
  open: boolean
  onClose?: () => void
  title?: string
  children?: ReactNode
  height?: string | number
  fixed?: boolean
  /** Absorbe FlowFullscreenSheet (1.x): pantalla completa, sin radio superior,
      con cabecera de navegación en vez de asa. */
  fullscreen?: boolean
  /** Con fullscreen: flecha atrás en la cabecera. Por defecto cae en onClose. */
  onBack?: () => void
  /** Acciones a la derecha de la cabecera en fullscreen. */
  headerActions?: ReactNode
  style?: CSSProperties
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  height,
  fixed = true,
  fullscreen,
  onBack,
  headerActions,
  style,
}: BottomSheetProps) {
  const t = useT()
  return (
    <OverlayShell open={open} onClose={onClose} alignment="bottom">
      <div
        className={css.root}
        data-fixed={fixed || undefined}
        data-fullscreen={fullscreen || undefined}
        style={{ ...(height != null && !fullscreen ? { height } : {}), ...style }}
      >
        {fullscreen ? (
          <div className={css.header}>
            <IconButton
              icon="arrow_back"
              ariaLabel={t('common.back', 'Volver')}
              onClick={onBack ?? onClose}
            />
            {title && <div className={css.headerTitle}>{title}</div>}
            {headerActions && <div className={css.headerActions}>{headerActions}</div>}
          </div>
        ) : (
          <>
            <button
              className={css.handle}
              onClick={onClose}
              aria-label={t('common.close', 'Cerrar')}
              type="button"
            >
              <span className={css.bar} />
            </button>
            {title && <div className={css.title}>{title}</div>}
          </>
        )}

        <div className={css.body}>{children}</div>
      </div>
    </OverlayShell>
  )
}
