import type { CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import css from './Timeline.module.css'

export interface TimelineItem {
  title: string
  timestamp?: string
  status?: 'done' | 'active' | 'pending' | 'error'
  description?: string
  icon?: string
}

export interface TimelineProps {
  items: TimelineItem[]
  mode?: 'steps' | 'events'
  style?: CSSProperties
}

const STATUS_ICON: Record<string, string> = {
  done: 'check',
  active: 'radio_button_checked',
  pending: 'radio_button_unchecked',
  error: 'close',
}

const STATUS_COLOR: Record<string, string> = {
  done: 'var(--status-success)',
  active: 'var(--action-accent)',
  pending: 'var(--text-disabled)',
  error: 'var(--status-danger)',
}

export function Timeline({ items, mode = 'steps', style }: TimelineProps) {
  const intl = useIntl()
  const STATUS_LABEL: Record<string, string> = {
    done: intl.formatMessage({ id: 'timeline.done', defaultMessage: 'Completado' }),
    active: intl.formatMessage({ id: 'timeline.active', defaultMessage: 'En curso' }),
    pending: intl.formatMessage({ id: 'timeline.pending', defaultMessage: 'Pendiente' }),
    error: intl.formatMessage({ id: 'timeline.error', defaultMessage: 'Error' }),
  }
  const isEvents = mode === 'events'

  return (
    <ol className={css.root} data-mode={mode} style={style}>
      {items.map((item, i) => {
        const status = item.status || 'pending'
        const last = i === items.length - 1

        if (isEvents) {
          return (
            <li key={i} className={css.eventItem}>
              <span aria-hidden="true" className={css.eventDot} data-status={status} />
              <div className={css.eventBody}>
                <div className={css.eventHeader}>
                  <span className={css.eventTitle}>{item.title}</span>
                  <span className={css.eventStatus} style={{ color: STATUS_COLOR[status] }}>
                    {STATUS_LABEL[status]}
                  </span>
                  {item.timestamp && (
                    <span className={css.eventTimestamp}>{item.timestamp}</span>
                  )}
                </div>
                {item.description && (
                  <span className={css.eventDescription}>{item.description}</span>
                )}
              </div>
            </li>
          )
        }

        return (
          <li key={i} className={css.stepItem}>
            <div className={css.stepRail}>
              <span aria-hidden="true" className={css.stepDot} data-status={status}>
                <span className={`flow-symbol ${css.stepDotIcon}`} aria-hidden="true">
                  {item.icon || STATUS_ICON[status]}
                </span>
              </span>
              {!last && <span className={css.stepConnector} />}
            </div>
            <div className={css.stepBody} style={{ paddingBottom: last ? 0 : 22 }}>
              <div className={css.stepHeader}>
                <span className={css.stepTitle}>{item.title}</span>
                {item.timestamp && (
                  <span className={css.stepTimestamp}>{item.timestamp}</span>
                )}
              </div>
              {item.description && (
                <div className={css.stepDescription}>{item.description}</div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
