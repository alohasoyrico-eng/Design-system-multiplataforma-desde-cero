import type { ReactNode, CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import css from './ChatMessage.module.css'

interface ToolChip {
  label: string
  icon?: string
  status?: 'running' | 'done'
}

export interface ChatMessageProps {
  role?: 'user' | 'agent'
  text?: string
  tool?: ToolChip
  streaming?: boolean
  children?: ReactNode
  timestamp?: string
  style?: CSSProperties
}

export function ChatMessage({
  role = 'agent',
  text,
  tool,
  streaming = false,
  children,
  timestamp,
  style,
}: ChatMessageProps) {
  const intl = useIntl()
  const ariaLabel = role === 'user'
    ? intl.formatMessage({ id: 'chat.userMessage', defaultMessage: 'Tu mensaje' })
    : intl.formatMessage({ id: 'chat.agentMessage', defaultMessage: 'Respuesta del asistente' })

  return (
    <div className={css.root} data-role={role} style={style} aria-label={ariaLabel}>
      {tool && (
        <div className={css.toolChip}>
          {tool.status === 'running' ? (
            <span className={css.toolSpinner} aria-hidden="true" />
          ) : (
            <span className={`flow-symbol ${css.toolDone}`} aria-hidden="true">check_circle</span>
          )}
          <span className={`flow-symbol ${css.toolIcon}`} aria-hidden="true">{tool.icon || 'bolt'}</span>
          {tool.label}
        </div>
      )}

      <div className={css.bubble} data-rich={children ? '' : undefined}>
        {text && <span>{text}</span>}
        {streaming && (
          <span
            className={css.streamingDots}
            data-no-text={!text ? '' : undefined}
            role="status"
            aria-label={intl.formatMessage({ id: 'chat.typing', defaultMessage: 'Escribiendo' })}
          >
            <span className={css.dot} aria-hidden="true" />
            <span className={css.dot} aria-hidden="true" />
            <span className={css.dot} aria-hidden="true" />
          </span>
        )}
        {children && <div className={css.richContent}>{children}</div>}
      </div>

      {timestamp && <span className={css.timestamp}>{timestamp}</span>}
    </div>
  )
}
