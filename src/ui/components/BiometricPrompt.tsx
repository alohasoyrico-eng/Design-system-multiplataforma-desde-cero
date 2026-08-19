import type { CSSProperties } from 'react'
import css from './BiometricPrompt.module.css'

export interface BiometricPromptProps {
  method?: 'face' | 'fingerprint'
  state?: 'idle' | 'scanning' | 'success' | 'error'
  title?: string
  description?: string
  onUse?: () => void
  onFallback?: () => void
  fallbackLabel?: string
  style?: CSSProperties
}

const METHOD_ICON = {
  face: 'face',
  fingerprint: 'fingerprint',
}

const STATE_LABEL: Record<string, string> = {
  idle: '',
  scanning: 'Verificando...',
  success: 'Verificado',
  error: 'No reconocido',
}

export function BiometricPrompt({
  method = 'face',
  state = 'idle',
  title,
  description,
  onUse,
  onFallback,
  fallbackLabel = 'Usar passcode',
  style,
}: BiometricPromptProps) {
  return (
    <div className={css.root} style={style}>
      {title && <div className={css.title}>{title}</div>}
      {description && <div className={css.description}>{description}</div>}

      <button
        className={css.biometric}
        data-state={state}
        onClick={onUse}
        type="button"
        aria-label={`${method === 'face' ? 'Reconocimiento facial' : 'Huella digital'}${STATE_LABEL[state] ? ` — ${STATE_LABEL[state]}` : ''}`}
        disabled={state === 'scanning' || state === 'success'}
      >
        <span className={`flow-icon ${css.icon}`} aria-hidden="true">
          {state === 'success' ? 'check_circle' : state === 'error' ? 'error' : METHOD_ICON[method]}
        </span>
      </button>

      {state !== 'idle' && (
        <div
          className={css.stateLabel}
          data-state={state}
          role={state === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {STATE_LABEL[state]}
        </div>
      )}

      <button
        className={css.fallback}
        onClick={onFallback}
        type="button"
      >
        {fallbackLabel}
      </button>
    </div>
  )
}
