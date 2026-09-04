import { useState, useRef, useEffect, type FormEvent, type ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { Input } from '../primitives/Input'
import { Button } from '../primitives/Button'
import { Field } from '../primitives/Field'
import css from './AuthForm.module.css'

export type AuthMode = 'login' | 'signup' | 'recover'

export interface AuthSubmitData {
  email: string
  password: string
  name: string
  mode: AuthMode
}

export interface AuthFormProps {
  mode: AuthMode
  loading?: boolean
  onSubmit: (data: AuthSubmitData) => void
  title?: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  submitLabel?: string
}

export function AuthForm({
  mode,
  loading,
  onSubmit,
  title,
  subtitle,
  children,
  footer,
  submitLabel,
}: AuthFormProps) {
  const intl = useIntl()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [name, setName] = useState('')
  const [emailErr, setEmailErr] = useState<string | null>(null)
  const [passErr, setPassErr] = useState<string | null>(null)
  const [formErr, setFormErr] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setEmailErr(null)
    setPassErr(null)
    setFormErr(null)
  }, [mode])

  const focusInput = (n: number) => {
    const inputs = formRef.current?.querySelectorAll<HTMLInputElement>('input')
    inputs?.[n]?.focus()
  }

  const emailIndex = mode === 'signup' ? 1 : 0
  const passIndex = mode === 'signup' ? 2 : 1

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setEmailErr(null)
    setPassErr(null)
    setFormErr(null)

    if (!email.includes('@')) {
      setEmailErr(intl.formatMessage({ id: 'auth.emailError', defaultMessage: 'Ingresa un correo válido.' }))
      focusInput(emailIndex)
      return
    }

    if (mode !== 'recover' && (!pass || pass.length < 8)) {
      if (mode === 'signup') {
        setPassErr(intl.formatMessage({ id: 'auth.passwordError', defaultMessage: 'La contraseña debe tener al menos 8 caracteres.' }))
        focusInput(passIndex)
      } else {
        setFormErr(intl.formatMessage({ id: 'auth.credentialsError', defaultMessage: 'Correo o contraseña incorrectos.' }))
        focusInput(emailIndex)
      }
      return
    }

    onSubmit({ email, password: pass, name, mode })
  }

  const defaultTitle = mode === 'login' ? intl.formatMessage({ id: 'auth.login', defaultMessage: 'Entrar' })
    : mode === 'signup' ? intl.formatMessage({ id: 'auth.signup', defaultMessage: 'Crear cuenta' })
    : intl.formatMessage({ id: 'auth.recover', defaultMessage: 'Recuperar contraseña' })

  const defaultSubmitLabel = mode === 'login' ? intl.formatMessage({ id: 'auth.submitLogin', defaultMessage: 'Entrar' })
    : mode === 'signup' ? intl.formatMessage({ id: 'auth.submitSignup', defaultMessage: 'Crear cuenta' })
    : intl.formatMessage({ id: 'auth.submitRecover', defaultMessage: 'Enviar instrucciones' })

  return (
    <form ref={formRef} onSubmit={submit} className={css.root}>
      <div>
        <h1 className={css.title}>{title ?? defaultTitle}</h1>
        {subtitle && <p className={css.subtitle}>{subtitle}</p>}
      </div>

      {mode === 'signup' && (
        <Field label="Nombre" htmlFor="auth-name" required>
          <Input
            id="auth-name"
            value={name}
            onChange={setName}
            icon="person"
            autoComplete="name"
            placeholder="Ana Sosa"
          />
        </Field>
      )}

      <Field label="Correo" htmlFor="auth-email" required error={emailErr ?? undefined}>
        <Input
          id="auth-email"
          value={email}
          onChange={v => { setEmail(v); if (emailErr) setEmailErr(null) }}
          icon="mail"
          placeholder="ana@flota.mx"
          type="email"
          autoComplete="email"
          invalid={!!emailErr}
        />
      </Field>

      {mode !== 'recover' && (
        <Field
          label="Contraseña"
          htmlFor="auth-pass"
          required
          help={mode === 'signup' ? intl.formatMessage({ id: 'auth.passwordHint', defaultMessage: 'Mínimo 8 caracteres.' }) : undefined}
          error={passErr ?? undefined}
        >
          <Input
            id="auth-pass"
            value={pass}
            onChange={v => { setPass(v); if (passErr) setPassErr(null); if (formErr) setFormErr(null) }}
            icon="lock"
            placeholder="••••••••"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            revealable
          />
        </Field>
      )}

      {formErr && <p className={css.error} role="alert">{formErr}</p>}

      {children}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
      >
        {submitLabel ?? defaultSubmitLabel}
      </Button>

      {footer}
    </form>
  )
}
