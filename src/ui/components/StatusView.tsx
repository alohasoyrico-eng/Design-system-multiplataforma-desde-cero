import type { ReactNode, CSSProperties } from 'react'

type StatusType = 'loading' | 'success' | 'error' | 'pending' | 'offline'

const CONFIG: Record<StatusType, { icon: string; color: string; bg: string }> = {
  success: { icon: 'check_circle', color: 'var(--status-success-text)', bg: 'var(--status-success-bg)' },
  error: { icon: 'error', color: 'var(--status-danger-text)', bg: 'var(--status-danger-bg)' },
  pending: { icon: 'schedule', color: 'var(--status-warning-text)', bg: 'var(--status-warning-bg)' },
  loading: { icon: 'sync', color: 'var(--text-accent)', bg: 'var(--surface-sunken)' },
  offline: { icon: 'cloud_off', color: 'var(--text-muted)', bg: 'var(--surface-sunken)' },
}

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
  const cfg = CONFIG[status] || CONFIG.loading
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      gap: 8, padding: '40px 28px', fontFamily: 'var(--font-body)', boxSizing: 'border-box',
      ...(fullScreen ? { minHeight: '100%', flex: 1 } : {}), ...style,
    }}>
      <span style={{
        position: 'relative', width: 84, height: 84, borderRadius: '50%', background: cfg.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6,
      }}>
        {status === 'loading' && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: '2.5px solid var(--action-accent)', borderTopColor: 'transparent',
              animation: 'flowSpin 1s linear infinite',
            }}
          />
        )}
        <span
          className={`flow-icon${status === 'success' || status === 'error' ? ' flow-icon--fill' : ''}`}
          aria-hidden="true"
          style={{
            fontSize: 40, color: cfg.color,
            animation: status === 'loading' ? 'flowSpin 1.4s linear infinite'
              : status === 'success' ? 'flowScaleIn var(--dur-base) var(--ease-spring)' : 'none',
          }}
        >
          {cfg.icon}
        </span>
      </span>
      {title && <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>}
      {description && (
        <div role="status" style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.55, maxWidth: 320 }}>
          {description}
        </div>
      )}
      {(primaryAction || secondaryAction) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14, width: '100%', maxWidth: 280 }}>
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}
