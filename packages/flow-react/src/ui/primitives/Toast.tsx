import { useEffect, useState, type ReactNode, type FocusEvent } from 'react'
import css from './Toast.module.css'

export type ToastTone = 'success' | 'warning' | 'danger' | 'info'

export interface ToastProps {
  message: string
  tone?: ToastTone
  /** Acción inline (p. ej. “Deshacer”). Requiere onAction. */
  actionLabel?: string
  onAction?: () => void
  /** Milisegundos hasta el auto-descarte; requiere onDismiss. El temporizador
      se pausa con el puntero encima o el foco dentro (tst-2). */
  duration?: number
  onDismiss?: () => void
}

export interface ToastStackProps {
  children: ReactNode
}

const TONES: Record<ToastTone, { icon: string; color: string }> = {
  success: { icon: 'check_circle', color: 'var(--status-success-text)' },
  warning: { icon: 'warning', color: 'var(--status-warning-text)' },
  danger: { icon: 'error', color: 'var(--status-danger-text)' },
  info: { icon: 'info', color: 'var(--status-info-text)' },
}

export function Toast({ message, tone = 'success', actionLabel, onAction, duration, onDismiss }: ToastProps) {
  const t = TONES[tone]
  const [pausado, setPausado] = useState(false)

  // tst-2: el temporizador no corre mientras el puntero esta encima o el foco
  // esta dentro; al salir se reinicia completo.
  useEffect(() => {
    if (duration == null || !onDismiss || pausado) return
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss, pausado])

  const alPerderFoco = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPausado(false)
  }

  return (
    <div
      role="status"
      className={css.root}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={alPerderFoco}
    >
      <span className={`flow-symbol flow-symbol--fill ${css.icon}`} style={{ color: t.color }} aria-hidden="true">
        {t.icon}
      </span>
      <span className={css.message}>{message}</span>
      {actionLabel && onAction && (
        <button onClick={onAction} className={css.action}>
          {actionLabel}
        </button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Cerrar" className={css.dismiss}>
          <span className="flow-symbol flow-symbol--md" aria-hidden="true">close</span>
        </button>
      )}
    </div>
  )
}

export function ToastStack({ children }: ToastStackProps) {
  return (
    <div aria-live="polite" className={css.stack}>
      {children}
    </div>
  )
}
