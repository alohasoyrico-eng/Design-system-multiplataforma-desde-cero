import { OverlayShell } from '../primitives/OverlayShell'
import { IconButton } from '../primitives/IconButton'
import { useT } from '../../i18n/useSafeIntl'
import css from './WidgetLibrary.module.css'

export interface WidgetDef {
  id: string
  title: string
  visible: boolean
}

export interface WidgetLibraryProps {
  open: boolean
  onClose: () => void
  /** En el orden del dashboard. */
  widgets: WidgetDef[]
  onToggle: (id: string) => void
  /** Reorden accesible: botones subir/bajar, no arrastre. */
  onMove: (id: string, dir: -1 | 1) => void
  title?: string
}

export function WidgetLibrary({ open, onClose, widgets, onToggle, onMove, title }: WidgetLibraryProps) {
  const t = useT()
  return (
    <OverlayShell open={open} onClose={onClose} alignment="bottom">
      <div className={css.panel}>
        <div className={css.header}>
          <span className={css.title}>{title ?? t('dashboard.customize', 'Personalizar dashboard')}</span>
          <IconButton icon="close" ariaLabel={t('common.close', 'Cerrar')} onClick={onClose} />
        </div>
        <ul className={css.list}>
        {widgets.map((w, i) => (
          <li key={w.id} className={css.row} data-hidden={!w.visible || undefined}>
            <span className={css.name}>{w.title}</span>
            <IconButton
              icon="arrow_upward"
              ariaLabel={`${t('common.moveUp', 'Subir')}: ${w.title}`}
              disabled={i === 0}
              onClick={() => onMove(w.id, -1)}
            />
            <IconButton
              icon="arrow_downward"
              ariaLabel={`${t('common.moveDown', 'Bajar')}: ${w.title}`}
              disabled={i === widgets.length - 1}
              onClick={() => onMove(w.id, 1)}
            />
            <IconButton
              icon={w.visible ? 'visibility_off' : 'visibility'}
              ariaLabel={`${w.visible ? t('common.hide', 'Ocultar') : t('common.show', 'Mostrar')}: ${w.title}`}
              onClick={() => onToggle(w.id)}
            />
          </li>
        ))}
        </ul>
      </div>
    </OverlayShell>
  )
}
