import { useState, type CSSProperties } from 'react'
import { Popover } from '../primitives/Popover'
import { Button } from '../primitives/Button'
import { IconButton } from '../primitives/IconButton'
import { useT } from '../../i18n/useSafeIntl'
import css from './SavedViews.module.css'

export interface SavedView {
  id: string
  name: string
}

export interface SavedViewsProps {
  views: SavedView[]
  /** La vista aplicada se marca con aria-current. */
  activeId?: string | null
  onApply: (id: string) => void
  /** Guarda la combinación actual con el nombre capturado. */
  onSave: (name: string) => void
  onDelete: (id: string) => void
  max?: number
  style?: CSSProperties
}

export function SavedViews({ views, activeId, onApply, onSave, onDelete, max = 12, style }: SavedViewsProps) {
  const t = useT()
  const [name, setName] = useState('')
  const full = views.length >= max
  const canSave = !full && name.trim().length > 0

  const save = () => {
    if (!canSave) return
    onSave(name.trim())
    setName('')
  }

  return (
    <Popover
      trigger={
        <Button variant="ghost" size="sm" icon="bookmark">
          {t('savedViews.trigger', 'Vistas')}
        </Button>
      }
    >
      {() => (
        <div className={css.panel} style={style}>
          <ul className={css.list}>
            {views.map(v => (
              <li key={v.id} className={css.row}>
                <button
                  type="button"
                  className={css.apply}
                  aria-current={v.id === activeId ? 'true' : undefined}
                  onClick={() => onApply(v.id)}
                >
                  {v.name}
                </button>
                <IconButton
                  icon="delete"
                  ariaLabel={`${t('savedViews.delete', 'Eliminar vista')}: ${v.name}`}
                  onClick={() => onDelete(v.id)}
                />
              </li>
            ))}
          </ul>
          <div className={css.footer}>
            <input
              className={css.name}
              value={name}
              aria-label={t('savedViews.name', 'Nombre de la vista')}
              placeholder={t('savedViews.name', 'Nombre de la vista')}
              disabled={full}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save() }}
            />
            <Button size="sm" onClick={save} disabled={!canSave}>
              {t('savedViews.save', 'Guardar vista')}
            </Button>
          </div>
          <div className={css.count} aria-live="polite">
            {views.length}/{max}
            {full && ` · ${t('savedViews.full', 'cupo lleno: borra una vista para guardar otra')}`}
          </div>
        </div>
      )}
    </Popover>
  )
}
