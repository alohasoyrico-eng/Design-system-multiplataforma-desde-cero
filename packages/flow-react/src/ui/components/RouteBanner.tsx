import type { CSSProperties } from 'react'
import { useT } from '../../i18n/useSafeIntl'
import css from './RouteBanner.module.css'
import { Card } from '../components/Card'
import { IconButton } from '../primitives/IconButton'

export interface RouteBannerProps {
  icon?: string
  title: string
  subtitle: string
  onClose?: () => void
  style?: CSSProperties
}

export function RouteBanner({ icon = 'navigation', title, subtitle, onClose, style }: RouteBannerProps) {
  const t = useT()
  return (
    <div className={css.root} style={style}>
      <Card padding={14}>
        <div className={css.content}>
          <span className={`flow-symbol flow-symbol--fill ${css.icon}`} aria-hidden="true">
            {icon}
          </span>
          <div className={css.info}>
            <span className={css.title}>{title}</span>
            <span className={css.subtitle}>{subtitle}</span>
          </div>
          {onClose && <IconButton icon="close" ariaLabel={t('common.close', 'Cerrar')} size="sm" onClick={onClose} />}
        </div>
      </Card>
    </div>
  )
}
