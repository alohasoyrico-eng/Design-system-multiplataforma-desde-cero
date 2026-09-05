import { useState } from 'react'
import css from './AuthOTPScreen.module.css'
import { PhoneFrame } from './PhoneFrame'
import { BiometricPrompt } from '@alohasoyrico-eng/flow-react'
import { PasscodeKeypad } from '@alohasoyrico-eng/flow-react'
import { OTPInput } from '@alohasoyrico-eng/flow-react'
import { Button } from '@alohasoyrico-eng/flow-react'

type Mode = 'bio' | 'pin' | 'sms' | 'done'

export function AuthOTPScreen() {
  const [mode, setMode] = useState<Mode>('bio')
  const [pin, setPin] = useState('')
  const [pinErr, setPinErr] = useState(false)
  // ao-3: un intento fallido dice cuantos quedan antes de bloquear
  const [intentos, setIntentos] = useState(3)
  const [sms, setSms] = useState('')
  const [bioState, setBioState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')

  const handleBioTap = () => {
    setBioState('scanning')
    setTimeout(() => {
      setBioState('success')
      setTimeout(() => setMode('done'), 700)
    }, 1100)
  }

  const handlePasscodeComplete = (v: string) => {
    if (v === '000000') {
      setPinErr(true)
      setIntentos((n) => n - 1)
      setTimeout(() => { setPin(''); setPinErr(false) }, 500)
    } else {
      setMode('done')
    }
  }

  const reset = () => {
    setMode('bio')
    setBioState('idle')
    setPin('')
    setSms('')
  }

  return (
    <PhoneFrame dark>
      <div className={css.view}>
        <img
          src="/flow-logo.svg"
          alt="Flow"
          className={css.logo}
        />

        {mode === 'bio' && (
          <div className={css.center}>
            <span className={css.greeting}>Hola, Diego</span>
            <div onClick={handleBioTap} style={{ cursor: 'pointer' }}>
              <BiometricPrompt
                method="face"
                state={bioState}
                title="Face ID"
                description={bioState === 'success' ? 'Bienvenido.' : 'Toca para verificar.'}
                onFallback={() => setMode('pin')}
                fallbackLabel="Usar passcode"
              />
            </div>
          </div>
        )}

        {mode === 'pin' && (
          <div className={css.center} data-mode="dark">
            <span className={css.greeting}>Ingresa tu passcode</span>
            <PasscodeKeypad
              value={pin}
              invalid={pinErr}
              biometricIcon="ar_on_you"
              onBiometric={() => { setMode('bio'); setPin('') }}
              onChange={(v) => { setPinErr(false); setPin(v) }}
              onComplete={handlePasscodeComplete}
            />
            {/* ao-3: el fallo dice cuantos intentos quedan, no solo que fallo */}
            {intentos < 3 && (
              <span className={css.hint} role="alert" style={{ color: 'var(--status-danger-text)' }}>
                {intentos > 0
                  ? `Código incorrecto. Te quedan ${intentos} intento${intentos === 1 ? '' : 's'} antes de bloquear la cuenta.`
                  : 'Cuenta bloqueada temporalmente. Usa el código por SMS.'}
              </span>
            )}
            <span className={css.hint}>Tip: 000000 simula el error</span>
            <button type="button" className={css.linkBtn} onClick={() => setMode('sms')}>
              Recibir código por SMS
            </button>
          </div>
        )}

        {mode === 'sms' && (
          <div className={css.center} data-mode="dark">
            <span className={css.greeting}>Ingresa el código que te enviamos</span>
            {/* ao-2: un solo input con autocomplete one-time-code — el SMS lo
                rellena de una; OTPInput ya cumple el contrato (otp-1..5). */}
            <OTPInput
              length={6}
              value={sms}
              autoFocus
              onChange={setSms}
              onComplete={() => setMode('done')}
            />
            <button type="button" className={css.linkBtn} onClick={() => { setMode('pin'); setSms('') }}>
              Usar passcode
            </button>
          </div>
        )}

        {mode === 'done' && (
          <div className={css.center}>
            <span className={css.successCircle}>
              <span className={`flow-symbol flow-symbol--fill ${css.successIcon}`} aria-hidden="true" style={{ color: 'var(--status-success-text)', animation: 'flowScaleIn var(--dur-base) var(--ease-spring)' }}>
                check_circle
              </span>
            </span>
            <span className={css.successTitle}>Sesión iniciada</span>
            <Button variant="primary" onClick={reset}>Reiniciar demo</Button>
          </div>
        )}
      </div>
    </PhoneFrame>
  )
}
