import type { CSSProperties } from 'react'
import { useIntl, type IntlShape } from 'react-intl'
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

function getStateLabel(intl: IntlShape, state: string): string {
  switch (state) {
    case 'scanning': return intl.formatMessage({ id: 'biometric.scanning', defaultMessage: 'Verificando...' })
    case 'success': return intl.formatMessage({ id: 'biometric.success', defaultMessage: 'Verificado' })
    case 'error': return intl.formatMessage({ id: 'biometric.error', defaultMessage: 'No reconocido' })
    default: return ''
  }
}

export function BiometricPrompt({
  method = 'face',
  state = 'idle',
  title,
  description,
  onUse,
  onFallback,
  fallbackLabel,
  style,
}: BiometricPromptProps) {
  const intl = useIntl()
  const resolvedFallbackLabel = fallbackLabel ?? intl.formatMessage({ id: 'biometric.fallback', defaultMessage: 'Usar passcode' })
  const methodLabel = method === 'face'
    ? intl.formatMessage({ id: 'biometric.faceId', defaultMessage: 'Reconocimiento facial' })
    : intl.formatMessage({ id: 'biometric.fingerprint', defaultMessage: 'Huella digital' })
  const stateLabel = getStateLabel(intl, state)

  return (
    <div className={css.root} style={style}>
      {title && <div className={css.title}>{title}</div>}
      {description && <div className={css.description}>{description}</div>}

      <button
        className={css.biometric}
        data-state={state}
        onClick={onUse}
        type="button"
        aria-label={`${methodLabel}${stateLabel ? ` — ${stateLabel}` : ''}`}
        disabled={state === 'scanning' || state === 'success'}
      >
        <span className={`flow-symbol ${css.icon}`} aria-hidden="true">
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
          {stateLabel}
        </div>
      )}

      <button
        className={css.fallback}
        onClick={onFallback}
        type="button"
      >
        {resolvedFallbackLabel}
      </button>
    </div>
  )
}
