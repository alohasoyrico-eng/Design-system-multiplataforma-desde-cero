import { useState } from 'react'
import css from './AuthOTPScreen.module.css'
import { PhoneFrame } from './PhoneFrame'
import { BiometricPrompt } from '../../ui/patterns/BiometricPrompt'
import { PasscodeKeypad } from '../../ui/patterns/PasscodeKeypad'
import { Button } from '../../ui/primitives/Button'

type Mode = 'bio' | 'pin' | 'done'

export function AuthOTPScreen() {
  const [mode, setMode] = useState<Mode>('bio')
  const [pin, setPin] = useState('')
  const [pinErr, setPinErr] = useState(false)
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
      setTimeout(() => { setPin(''); setPinErr(false) }, 500)
    } else {
      setMode('done')
    }
  }

  const reset = () => {
    setMode('bio')
    setBioState('idle')
    setPin('')
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
            <span className={css.hint}>Tip: 000000 simula el error</span>
          </div>
        )}

        {mode === 'done' && (
          <div className={css.center}>
            <span className={css.successCircle}>
              <span className="flow-icon flow-icon--fill" aria-hidden="true" style={{ fontSize: 44, color: 'var(--status-success-text)', animation: 'flowScaleIn var(--dur-base) var(--ease-spring)' }}>
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
