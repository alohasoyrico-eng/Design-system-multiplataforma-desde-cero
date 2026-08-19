import { useId, type ReactNode, type CSSProperties } from 'react'
import css from './Field.module.css'

export interface FieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  help?: string
  error?: string
  children: ReactNode
  style?: CSSProperties
}

export function Field({ label, htmlFor, required, help, error, children, style }: FieldProps) {
  const autoId = useId()
  const messageId = `${htmlFor ?? autoId}-msg`

  if (import.meta.env.DEV && !htmlFor) {
    console.warn('[Field] htmlFor is missing — label will not be associated with a control.')
  }

  return (
    <div className={css.root} style={style}>
      <label className={css.label} htmlFor={htmlFor}>
        {label}
        {required && <span className={css.required} aria-hidden="true"> *</span>}
      </label>
      {children}
      <div
        className={css.message}
        id={messageId}
        role={error ? 'alert' : undefined}
        data-error={error ? '' : undefined}
      >
        {error ?? help}
      </div>
    </div>
  )
}
