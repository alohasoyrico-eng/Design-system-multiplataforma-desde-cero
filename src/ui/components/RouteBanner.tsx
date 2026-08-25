import type { CSSProperties } from 'react'
import css from './RouteBanner.module.css'
import { Card } from './Card'
import { IconButton } from '../primitives/IconButton'

export interface RouteBannerProps {
  icon?: string
  title: string
  subtitle: string
  onClose?: () => void
  style?: CSSProperties
}

export function RouteBanner({ icon = 'navigation', title, subtitle, onClose, style }: RouteBannerProps) {
  return (
    <div className={css.root} style={style}>
      <Card padding={14}>
        <div className={css.content}>
          <span className="flow-icon flow-icon--fill" aria-hidden="true" style={{ fontSize: 22, color: 'var(--text-accent)' }}>
            {icon}
          </span>
          <div className={css.info}>
            <span className={css.title}>{title}</span>
            <span className={css.subtitle}>{subtitle}</span>
          </div>
          {onClose && <IconButton icon="close" ariaLabel="Cerrar" size="sm" onClick={onClose} />}
        </div>
      </Card>
    </div>
  )
}
