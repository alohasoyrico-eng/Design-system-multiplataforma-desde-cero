import { useState, type ReactNode, type CSSProperties } from 'react'
import { OverlayShell } from '../primitives/OverlayShell'
import { IconButton } from '../primitives/IconButton'
import { useT } from '../../i18n/useSafeIntl'
import css from './DocumentViewer.module.css'

export interface DocumentViewerProps {
  title: string
  /** El documento lo pinta el producto (iframe, imagen, render de PDF). */
  children: ReactNode
  /** Descargar, compartir… viven en la cabecera del marco. */
  actions?: ReactNode
  expandable?: boolean
  /** Alto del marco en línea; el expandido ocupa la pantalla. */
  height?: number | string
  style?: CSSProperties
}

export function DocumentViewer({ title, children, actions, expandable = true, height, style }: DocumentViewerProps) {
  const t = useT()
  const [expanded, setExpanded] = useState(false)

  const header = (isExpanded: boolean) => (
    <div className={css.header}>
      <span className={css.title}>{title}</span>
      {actions && <div className={css.actions}>{actions}</div>}
      {expandable && (
        <IconButton
          icon={isExpanded ? 'close_fullscreen' : 'open_in_full'}
          ariaLabel={
            isExpanded
              ? t('documentViewer.collapse', 'Salir de pantalla completa')
              : t('documentViewer.expand', 'Pantalla completa')
          }
          onClick={() => setExpanded(!isExpanded)}
        />
      )}
    </div>
  )

  return (
    <>
      <div className={css.frame} style={{ ...(height != null ? { height } : {}), ...style }}>
        {header(false)}
        <div className={css.body}>{expanded ? null : children}</div>
      </div>
      <OverlayShell open={expanded} onClose={() => setExpanded(false)}>
        <div className={css.fullscreen}>
          {header(true)}
          <div className={css.body}>{expanded ? children : null}</div>
        </div>
      </OverlayShell>
    </>
  )
}
