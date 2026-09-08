import type { ReactNode, CSSProperties } from 'react'
import { Card } from './Card'
import { IconButton } from '../primitives/IconButton'
import { Skeleton } from '../primitives/Skeleton'
import { useT } from '../../i18n/useSafeIntl'
import css from './WidgetFrame.module.css'

export interface WidgetFrameProps {
  title: string
  children: ReactNode
  hidden?: boolean
  /** Muestra el cromo de personalización; un widget oculto se pinta atenuado
      en vez de desaparecer. */
  customizing?: boolean
  /** dsh-p4: mientras carga, el hueco se rellena con Skeleton del tamaño
      final y el marco lleva aria-busy — la página no salta al llegar el dato. */
  loading?: boolean
  onToggle?: () => void
  /** Acciones del widget en su cabecera (Ajustar, Exportar…) — a la derecha
      del título, antes del toggle de personalización. Nació de eOne: sus
      widgets con escritura (Objetivos) necesitan actuar desde el marco. */
  actions?: ReactNode
  style?: CSSProperties
}

export function WidgetFrame({ title, children, hidden, customizing, loading, onToggle, actions, style }: WidgetFrameProps) {
  const t = useT()
  // wf-1: oculto y sin personalizar, nada en el árbol.
  if (hidden && !customizing) return null
  /* La SUPERFICIE es del Card — una sola tarjeta en el sistema. La pieza
     llegó PORTADA del registro de eOne con su superficie legada (radius-md
     + borde, sin sombra): una cuarta piel que no existía en el vocabulario
     del Card. Cazado por el dueño de eOne, 7-sep — tres veces. */
  return (
    <Card padding="none" style={style}>
    <section
      className={css.root}
      data-hidden={hidden || undefined}
      aria-label={title}
      aria-busy={loading || undefined}
    >
      <div className={css.header}>
        <span className={css.title}>{title}</span>
        {actions && <div className={css.actions}>{actions}</div>}
        {customizing && onToggle && (
          <IconButton
            icon={hidden ? 'visibility' : 'visibility_off'}
            ariaLabel={`${hidden ? t('common.show', 'Mostrar') : t('common.hide', 'Ocultar')}: ${title}`}
            onClick={onToggle}
          />
        )}
      </div>
      <div className={css.body}>
        {loading ? <Skeleton variant="card" style={{ width: '100%', height: '100%', minHeight: 120 }} /> : children}
      </div>
    </section>
    </Card>
  )
}
