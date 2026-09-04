import type { ReactNode, CSSProperties } from 'react'
import css from './StatusView.module.css'

type StatusType = 'loading' | 'success' | 'error' | 'pending' | 'offline'

const ICONS: Record<StatusType, string> = {
  success: 'check_circle',
  error: 'error',
  pending: 'schedule',
  loading: 'sync',
  offline: 'cloud_off',
}

const FILLED: Set<StatusType> = new Set(['success', 'error'])

export interface StatusViewProps {
  status?: StatusType
  title?: string
  description?: string
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  fullScreen?: boolean
  style?: CSSProperties
}

export function StatusView({ status = 'loading', title, description, primaryAction, secondaryAction, fullScreen = false, style }: StatusViewProps) {
  // stv-1: el cambio de estado se anuncia — loading con aria-busy,
  // error y offline interrumpen con role=alert, el resto avisa polite.
  const urgente = status === 'error' || status === 'offline'
  return (
    <div
      className={css.root}
      data-full-screen={fullScreen || undefined}
      aria-busy={status === 'loading' || undefined}
      style={style}
    >
      <span className={css.iconWrap} data-status={status}>
        {status === 'loading' && <span className={css.spinner} aria-hidden="true" />}
        <span
          className={`flow-symbol${FILLED.has(status) ? ' flow-symbol--fill' : ''} ${css.statusIcon}`}
          aria-hidden="true"
          data-status={status}
        >
          {ICONS[status]}
        </span>
      </span>
      {title && <div className={css.title}>{title}</div>}
      {description && (
        <div role={urgente ? 'alert' : 'status'} className={css.description}>{description}</div>
      )}
      {(primaryAction || secondaryAction) && (
        <div className={css.actions}>
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}
