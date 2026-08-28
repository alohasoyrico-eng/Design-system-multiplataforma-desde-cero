import { useState, useRef, useEffect } from 'react'
import { Checkbox } from '../ui/primitives/Checkbox'
import { Toast, ToastStack } from '../ui/components/Toast'
import { AuthForm, type AuthMode, type AuthSubmitData } from '../ui/patterns/AuthForm'
import css from './AuthPage.module.css'

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const after = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const goTo = (m: AuthMode) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMode(m)
  }

  const handleSubmit = (data: AuthSubmitData) => {
    setLoading(true)
    const msg = data.mode === 'recover'
      ? 'Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.'
      : data.mode === 'login'
        ? 'Bienvenida de vuelta.'
        : 'Cuenta creada. Revisa tu correo.'
    after(900, () => {
      setLoading(false)
      setToast(msg)
      after(msg.length > 60 ? 5000 : 3500, () => setToast(null))
    })
  }

  return (
    <div className={css.root}>
      <section className={css.brand} aria-hidden="true">
        <img src="/assets/flow-logo.svg" alt="" className={css.logo} />
        <div>
          <div className={css.headline}>
            Todo tu día,<br />
            <span className={css.headlineAccent}>en movimiento.</span>
          </div>
          <p className={css.tagline}>
            Gestiona tu flota, tus conductores y tus viajes desde un solo lugar.
          </p>
        </div>
        <small className={css.copyright}>© 2026 Flow Mobility</small>
      </section>

      <main className={css.formPanel}>
        <AuthForm
          mode={mode}
          loading={loading}
          onSubmit={handleSubmit}
          subtitle={
            mode === 'login' ? <>¿Primera vez en Flow? <a href="#" onClick={goTo('signup')} className={css.link}>Crea tu cuenta</a></>
            : mode === 'signup' ? <>¿Ya tienes cuenta? <a href="#" onClick={goTo('login')} className={css.link}>Entra</a></>
            : 'Ingresa tu correo y te enviaremos instrucciones.'
          }
          footer={
            mode === 'recover'
              ? <p className={css.legal}><a href="#" onClick={goTo('login')} className={css.link}>Volver al inicio de sesión</a></p>
              : <p className={css.legal}>Al continuar aceptas los <a href="#">Términos</a> y el <a href="#">Aviso de privacidad</a>.</p>
          }
        >
          {mode !== 'recover' && (
            <div className={css.options}>
              <Checkbox checked={remember} onChange={setRemember} label="Recordarme" />
              {mode === 'login' && (
                <a href="#" onClick={goTo('recover')} className={css.forgot}>¿Olvidaste tu contraseña?</a>
              )}
            </div>
          )}
        </AuthForm>
      </main>

      <ToastStack>
        {toast && <Toast tone="success" message={toast} onDismiss={() => setToast(null)} />}
      </ToastStack>
    </div>
  )
}
