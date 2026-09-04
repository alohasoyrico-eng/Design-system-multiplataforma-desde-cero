import { useIntl } from 'react-intl'
import { IconButton } from '../primitives/IconButton'
import { Popover } from '../primitives/Popover'
import css from './NotificationCenter.module.css'

export interface NotificationItem {
  id: string
  tone: 'warning' | 'danger' | 'success' | 'info'
  title: string
  desc?: string
  time: string
  read: boolean
}

export interface NotificationCenterProps {
  items?: NotificationItem[]
  /** Lado del panel respecto a la campana. Default 'right'. */
  align?: 'left' | 'right'
  onItemClick?: (item: NotificationItem) => void
  onMarkAllRead?: () => void
}

const TONE_ICONS: Record<string, { icon: string; color: string }> = {
  warning: { icon: 'warning', color: 'var(--status-warning-text)' },
  danger: { icon: 'error', color: 'var(--status-danger-text)' },
  success: { icon: 'check_circle', color: 'var(--status-success-text)' },
  info: { icon: 'info', color: 'var(--status-info-text)' },
}

export function NotificationCenter({ items = [], align = 'right', onItemClick, onMarkAllRead }: NotificationCenterProps) {
  const intl = useIntl()
  const unread = items.filter((n) => !n.read).length
  const notificationsLabel = intl.formatMessage({ id: 'notifications.label', defaultMessage: 'Notificaciones' })
  const unreadSuffix = unread ? `, ${intl.formatMessage({ id: 'notifications.unread', defaultMessage: '{count} sin leer' }, { count: unread })}` : ''

  return (
    <Popover
      trigger={
        <IconButton
          icon="notifications"
          ariaLabel={notificationsLabel + unreadSuffix}
          badge={unread > 0 ? true : undefined}
        />
      }
      align={align}
    >
      {({ close }) => (
        <div className={css.root}>
          <div className={css.header}>
            <span className={css.headerTitle}>{notificationsLabel}</span>
            {unread > 0 && (
              <button className={css.markRead} onClick={() => onMarkAllRead?.()}>
                Marcar todo como leido
              </button>
            )}
          </div>
          <div className={css.list}>
            {items.map((n) => {
              const t = TONE_ICONS[n.tone] || TONE_ICONS.info
              return (
                <button
                  key={n.id}
                  className={css.notifItem}
                  data-unread={!n.read || undefined}
                  onClick={() => { onItemClick?.(n); close() }}
                >
                  <span className={`flow-symbol flow-symbol--fill ${css.notifIcon}`} style={{ color: t.color }} aria-hidden="true">{t.icon}</span>
                  <div className={css.notifBody}>
                    <div className={css.notifTitle} data-unread={!n.read || undefined}>{n.title}</div>
                    {n.desc && <div className={css.notifDesc}>{n.desc}</div>}
                    <div className={css.notifTime}>{n.time}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </Popover>
  )
}
