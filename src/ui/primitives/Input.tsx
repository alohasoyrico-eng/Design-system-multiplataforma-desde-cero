import { useState, type ReactNode, type CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import { ControlShell } from './ControlShell'
import css from './Input.module.css'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg'
  filled?: boolean
  disabled?: boolean
  error?: boolean
  type?: string
  revealable?: boolean
  /** Adorno al final del control (unidad, contador, icono). */
  trailing?: ReactNode
  mono?: boolean
  /** Nombre accesible cuando no hay <Field> que etiquete el control. */
  ariaLabel?: string
  /** Autorrelleno del navegador (email, current-password, tel…): sin esto
      el gestor de contraseñas no funciona. */
  autoComplete?: string
  style?: CSSProperties
  id?: string
}

export function Input({
  value,
  onChange,
  placeholder,
  icon,
  size = 'md',
  filled,
  disabled,
  error,
  type = 'text',
  revealable,
  trailing,
  mono,
  ariaLabel,
  style,
  ...rest
}: InputProps) {
  const intl = useIntl()
  const [shown, setShown] = useState(false)

  const reveal = revealable ? (
    <button
      type="button"
      tabIndex={0}
      aria-label={shown ? intl.formatMessage({ id: 'common.hide', defaultMessage: 'Ocultar' }) : intl.formatMessage({ id: 'common.show', defaultMessage: 'Mostrar' })}
      aria-pressed={shown}
      onClick={() => setShown(v => !v)}
      className={css.reveal}
    >
      <span className="flow-symbol flow-symbol--default" aria-hidden="true">
        {shown ? 'visibility_off' : 'visibility'}
      </span>
    </button>
  ) : undefined

  return (
    <ControlShell
      size={size}
      filled={filled}
      disabled={disabled}
      error={error}
      leading={icon && <span className="flow-symbol flow-symbol--md" aria-hidden="true">{icon}</span>}
      trailing={reveal ?? trailing}
      style={style}
    >
      <input
        type={revealable ? (shown ? 'text' : 'password') : type}
        className={css.input}
        data-mono={mono || undefined}
        value={value}
        aria-label={ariaLabel}
        aria-invalid={error || undefined}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
      />
    </ControlShell>
  )
}
