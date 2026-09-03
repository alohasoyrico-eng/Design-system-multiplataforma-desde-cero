import type { ReactNode, CSSProperties } from 'react'
import { IconButton } from '../primitives/IconButton'
import { useT } from '../../i18n/useSafeIntl'
import css from './WidgetFrame.module.css'

export interface WidgetFrameProps {
  title: string
  children: ReactNode
  hidden?: boolean
  /** Muestra el cromo de personalización; un widget oculto se pinta atenuado
      en vez de desaparecer. */
  customizing?: boolean
  onToggle?: () => void
  style?: CSSProperties
}

export function WidgetFrame({ title, children, hidden, customizing, onToggle, style }: WidgetFrameProps) {
  const t = useT()
  // wf-1: oculto y sin personalizar, nada en el árbol.
  if (hidden && !customizing) return null
  return (
    <section className={css.root} data-hidden={hidden || undefined} aria-label={title} style={style}>
      <div className={css.header}>
        <span className={css.title}>{title}</span>
        {customizing && onToggle && (
          <IconButton
            icon={hidden ? 'visibility' : 'visibility_off'}
            ariaLabel={`${hidden ? t('common.show', 'Mostrar') : t('common.hide', 'Ocultar')}: ${title}`}
            onClick={onToggle}
          />
        )}
      </div>
      <div className={css.body}>{children}</div>
    </section>
  )
}
