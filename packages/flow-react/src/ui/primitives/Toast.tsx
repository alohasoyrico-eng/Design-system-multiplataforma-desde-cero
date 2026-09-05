import { useEffect, useState, useRef, useCallback, useMemo, useContext, createContext, type ReactNode, type FocusEvent } from 'react'
import { createPortal } from 'react-dom'
import { useT } from '../../i18n/useSafeIntl'
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
  const traducir = useT()
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
        <button onClick={onDismiss} aria-label={traducir('common.close', 'Cerrar')} className={css.dismiss}>
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

/* ── ToastHost: la cola, una sola vez ──────────────────────────────────────
   El timeout ya era del Toast (duration con pausa, tst-2); el apilado dejaba
   de existir: cada app lo reinventaba. El host apila con tope (th-1), presta
   useToast() y retira por id o al ejecutar la acción (th-2). */

export interface ToastOptions {
  message: string
  tone?: ToastTone
  actionLabel?: string
  onAction?: () => void
  /** ms hasta el auto-descarte (default 5000). `null` = persistente: solo
      lo retira el botón de cerrar o dismiss(id). */
  duration?: number | null
}

export interface ToastHandle {
  show: (options: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastHandle | null>(null)

export interface ToastHostProps {
  /** Avisos visibles a la vez; al llegar uno más, el más viejo sale (th-1). */
  max?: number
  children: ReactNode
}

export function ToastHost({ max = 3, children }: ToastHostProps) {
  const [avisos, setAvisos] = useState<Array<ToastOptions & { id: string }>>([])
  const seq = useRef(0)

  const dismiss = useCallback((id: string) => {
    setAvisos((a) => a.filter((x) => x.id !== id))
  }, [])

  const show = useCallback(
    (o: ToastOptions) => {
      const id = 'flow-toast-' + ++seq.current
      // th-1: tope con salida FIFO — el más viejo cede el sitio
      setAvisos((a) => [...a, { ...o, id }].slice(-max))
      return id
    },
    [max],
  )

  const handle = useMemo(() => ({ show, dismiss }), [show, dismiss])

  return (
    <ToastContext.Provider value={handle}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <ToastStack>
            {avisos.map((a) => (
              <Toast
                key={a.id}
                message={a.message}
                tone={a.tone}
                actionLabel={a.actionLabel}
                onAction={
                  a.onAction
                    ? () => {
                        a.onAction!()
                        dismiss(a.id) // th-2: la acción también retira el aviso
                      }
                    : undefined
                }
                duration={a.duration === null ? undefined : (a.duration ?? 5000)}
                onDismiss={() => dismiss(a.id)}
              />
            ))}
          </ToastStack>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastHandle {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // th-3: fallar claro, no un undefined río abajo
    throw new Error('useToast requiere un <ToastHost> arriba en el árbol.')
  }
  return ctx
}
