import type { ReactNode, CSSProperties } from 'react'
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
  return (
    <div className={css.root} data-role={role} style={style} aria-label={role === 'user' ? 'Tu mensaje' : 'Respuesta del asistente'}>
      {tool && (
        <div className={css.toolChip}>
          {tool.status === 'running' ? (
            <span className={css.toolSpinner} aria-hidden="true" />
          ) : (
            <span className={`flow-icon ${css.toolDone}`} aria-hidden="true">check_circle</span>
          )}
          <span className={`flow-icon ${css.toolIcon}`} aria-hidden="true">{tool.icon || 'bolt'}</span>
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
            aria-label="Escribiendo"
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
