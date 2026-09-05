import { useState, useEffect } from 'react'
import css from './OnboardingDriverScreen.module.css'
import { PhoneFrame } from './PhoneFrame'
import { OnboardingCarousel } from '@alohasoyrico-eng/flow-react'
import { OTPInput } from '@alohasoyrico-eng/flow-react'
import { PasscodeKeypad } from '@alohasoyrico-eng/flow-react'
import { Select, Flag, InputPhone } from '@alohasoyrico-eng/flow-react'
import { BiometricPrompt } from '@alohasoyrico-eng/flow-react'
import { PaymentCard } from '@alohasoyrico-eng/flow-react'
import { IconButton } from '@alohasoyrico-eng/flow-react'
import { Button } from '@alohasoyrico-eng/flow-react'
import { Field } from '@alohasoyrico-eng/flow-react'
import { Input } from '@alohasoyrico-eng/flow-react'
import { FileUpload, type UploadedFile } from '@alohasoyrico-eng/flow-react'
import { Switch } from '@alohasoyrico-eng/flow-react'

const SLIDES = [
  { title: 'Controla cada litro', description: 'Monitorea cargas, rutas y consumos desde tu teléfono. Nada se escapa.', icon: 'local_gas_station' },
  { title: 'Paga sin efectivo', description: 'Una tarjeta inteligente para gasolina, casetas y servicios. Sin vales, sin recibos.', icon: 'credit_card' },
  { title: 'Rutas más baratas', description: 'Te mostramos la estación con el mejor precio en tu camino. Ahorra en cada viaje.', icon: 'route' },
  { title: 'Todo en tiempo real', description: 'Alertas de cada cargo, límites por conductor y reportes automáticos para tu flota.', icon: 'notifications_active' },
]

// pai-p5: el pais es RECETA, no componente — Select searchable + Flag +
// renderOption, con la lista como dato del proyecto. pai-p2: se busca por
// nombre, ISO y lada (todo viaja en el label buscable).
const PAISES = [
  { value: 'MX', label: 'México · MX · +52', lada: '+52' },
  { value: 'CO', label: 'Colombia · CO · +57', lada: '+57' },
  { value: 'AR', label: 'Argentina · AR · +54', lada: '+54' },
  { value: 'CL', label: 'Chile · CL · +56', lada: '+56' },
  { value: 'ES', label: 'España · ES · +34', lada: '+34' },
  { value: 'US', label: 'Estados Unidos · US · +1', lada: '+1' },
]

const STEPS = ['carousel', 'welcome', 'email', 'emailCode', 'phone', 'smsCode', 'docs', 'card', 'passcode', 'notif', 'bio', 'done', 'login', 'loginDone'] as const
type Step = typeof STEPS[number]

function Resend() {
  const [left, setLeft] = useState(42)
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])
  return left > 0
    ? <span className={css.resendTimer}>Reenviar en 0:{String(left).padStart(2, '0')}</span>
    : <button type="button" className={css.resendLink} onClick={() => setLeft(42)}>Reenviar código</button>
}

function StepHeader({ step, total, onBack, title, subtitle }: {
  step: number; total: number; onBack?: () => void; title: string; subtitle?: string
}) {
  return (
    <div className={css.stepHeader}>
      <div className={css.stepNav}>
        {onBack && <IconButton icon="arrow_back" ariaLabel="Atrás" variant="tonal" size="sm" onClick={onBack} />}
        <div className={css.progressTrack}>
          <div className={css.progressFill} style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <span className={css.stepCount}>{step}/{total}</span>
      </div>
      <h1 className={css.stepTitle}>{title}</h1>
      {subtitle && <p className={css.stepSubtitle}>{subtitle}</p>}
    </div>
  )
}

export function OnboardingDriverScreen() {
  const [idx, setIdx] = useState(0)
  const [slideIdx, setSlideIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [code1, setCode1] = useState('')
  const [code2, setCode2] = useState('')
  const [pais, setPais] = useState<string | string[] | undefined>('MX')
  const [cardNum, setCardNum] = useState('')
  const [pin, setPin] = useState('')
  const [pin2, setPin2] = useState('')
  const [confirmPin, setConfirmPin] = useState(false)
  const [pinErr, setPinErr] = useState(false)
  const [notif, setNotif] = useState(true)
  const [bioState, setBioState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [loginBioState, setLoginBioState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [loginPin, setLoginPin] = useState('')
  const [loginPinErr, setLoginPinErr] = useState(false)
  const [loginMode, setLoginMode] = useState<'bio' | 'pin'>('bio')
  const [emailValid, setEmailValid] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [phoneValid, setPhoneValid] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [cardValid, setCardValid] = useState(false)
  const [docs, setDocs] = useState<UploadedFile[]>([])
  const [cardError, setCardError] = useState('')

  const step = STEPS[idx]
  const next = () => setIdx(Math.min(idx + 1, STEPS.length - 1))
  const back = () => setIdx(Math.max(idx - 1, 0))
  const fmtCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  const isPhoneValid = (v: string) => v.replace(/\D/g, '').length >= 10

  const handleEmailChange = (v: string) => {
    setEmail(v)
    setEmailError('')
    setEmailValid(false)
    if (emailTouched && v && !isEmailValid(v)) {
      setEmailError('Ingresa un correo válido')
    } else if (emailTouched && isEmailValid(v)) {
      setEmailValid(true)
    }
  }

  const handleEmailSubmit = () => {
    setEmailTouched(true)
    if (!isEmailValid(email)) {
      setEmailError('Ingresa un correo válido')
      setEmailValid(false)
      return
    }
    setEmailError('')
    setEmailValid(true)
    setTimeout(next, 600)
  }

  const handlePhoneChange = (v: string) => {
    setPhone(v)
    setPhoneError('')
    setPhoneValid(false)
    if (phoneTouched && v && !isPhoneValid(v)) {
      setPhoneError('El número debe tener al menos 10 dígitos')
    } else if (phoneTouched && isPhoneValid(v)) {
      setPhoneValid(true)
    }
  }

  const handlePhoneSubmit = () => {
    setPhoneTouched(true)
    if (!isPhoneValid(phone)) {
      setPhoneError('El número debe tener al menos 10 dígitos')
      setPhoneValid(false)
      return
    }
    setPhoneError('')
    setPhoneValid(true)
    setTimeout(next, 600)
  }

  const handleCardSubmit = () => {
    const digits = cardNum.replace(/\s/g, '')
    if (digits.length < 16) {
      setCardError('El número debe tener 16 dígitos')
      setCardValid(false)
      return
    }
    setCardError('')
    setCardValid(true)
    setTimeout(next, 600)
  }

  const isDarkStep = step === 'login' || step === 'loginDone'

  return (
    <PhoneFrame dark={isDarkStep}>
      <div className={css.screen}>
        {step === 'carousel' && (
          <OnboardingCarousel
            slides={SLIDES}
            index={slideIdx}
            onIndexChange={setSlideIdx}
            onSkip={next}
            onDone={next}
            style={{ margin: '-44px calc(var(--space-5) * -1) calc(var(--space-6) * -1)' }}
          />
        )}

        {step === 'welcome' && (
          <>
            <img src="/flow-logo.svg" alt="Flow" className={css.logo} />
            <div className={css.welcomeBottom}>
              <h1 className={css.heroTitle}>
                Todo tu día,<br /><span className={css.heroAccent}>en movimiento.</span>
              </h1>
              <p className={css.heroDesc}>
                Activa tu tarjeta Flow en unos minutos. Solo necesitas tu correo, tu teléfono y tu tarjeta.
              </p>
              <Button variant="primary" size="lg" fullWidth onClick={next}>Comenzar</Button>
              <span className={css.loginHint}>¿Ya tienes cuenta? <button type="button" className={css.loginLink}>Entrar</button></span>
            </div>
          </>
        )}

        {step === 'email' && (
          <>
            <StepHeader step={1} total={8} onBack={back} title="Tu correo" subtitle="Te enviaremos un código de activación para confirmarlo." />
            <Field label="Correo" htmlFor="ob-email" error={emailError} valid={emailValid} validMessage="Correo válido">
              <Input id="ob-email" type="email" icon="mail" size="lg" placeholder="diego@correo.mx" value={email} onChange={handleEmailChange} invalid={!!emailError} />
            </Field>
            <div className={css.bottomAction}>
              <Button variant="primary" size="lg" fullWidth onClick={handleEmailSubmit}>Enviar código</Button>
            </div>
          </>
        )}

        {step === 'emailCode' && (
          <>
            <StepHeader step={2} total={8} onBack={back} title="Confirma tu correo" subtitle={`Enviamos un código de 6 dígitos a ${email || 'tu correo'}.`} />
            <div className={css.otpCenter}>
              <OTPInput length={6} value={code1} onChange={setCode1} onComplete={() => setTimeout(next, 300)} autoFocus />
              <Resend />
            </div>
          </>
        )}

        {step === 'phone' && (
          <>
            <StepHeader step={3} total={8} onBack={back} title="Tu teléfono" subtitle="Lo confirmamos con un SMS. Es tu segundo canal de seguridad." />
            {/* pai-p1: la bandera acompaña al nombre, nunca lo sustituye.
                pai-p3: país y teléfono son dos controles; la lada viaja como prefijo. */}
            <Field label="País" htmlFor="ob-pais">
              <Select
                id="ob-pais"
                size="lg"
                searchable
                value={pais}
                onChange={setPais}
                options={PAISES}
                renderOption={(o) => (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Flag country={String(o.value).toLowerCase()} size={16} />
                    {o.label}
                  </span>
                )}
              />
            </Field>
            <Field label="Teléfono móvil" htmlFor="ob-phone" error={phoneError} valid={phoneValid} validMessage="Número válido">
              {/* tel-1..tel-4: la pieza real — lada como adorno con bandera,
                  sincronizada al país; formateo 2-4-4; emite solo dígitos. */}
              <InputPhone
                id="ob-phone"
                size="lg"
                placeholder="55 1234 5678"
                value={phone}
                onChange={handlePhoneChange}
                invalid={!!phoneError}
                prefix={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Flag country={String(pais ?? 'mx').toLowerCase()} size={16} />
                    {PAISES.find((c) => c.value === pais)?.lada ?? '+52'}
                  </span>
                }
              />
            </Field>
            <div className={css.bottomAction}>
              <Button variant="primary" size="lg" fullWidth onClick={handlePhoneSubmit}>Enviar SMS</Button>
            </div>
          </>
        )}

        {step === 'smsCode' && (
          <>
            <StepHeader step={4} total={8} onBack={back} title="Código SMS" subtitle={`Enviamos un OTP a ${phone || 'tu teléfono'}. Se llena solo al llegar.`} />
            <div className={css.otpCenter}>
              <OTPInput length={6} value={code2} onChange={setCode2} onComplete={() => setTimeout(next, 300)} autoFocus />
              <Resend />
            </div>
          </>
        )}

        {/* od-3: subir se puede sin arrastrar — la zona de FileUpload es un
            boton que abre camara o archivos (upl-1); en movil el arrastre no existe. */}
        {step === 'docs' && (
          <>
            <StepHeader step={5} total={8} onBack={back} title="Tu licencia" subtitle="Una foto o PDF del frente. El botón abre tu cámara o tus archivos." />
            <FileUpload
              files={docs}
              onChange={setDocs}
              accept="image/*,.pdf"
              multiple={false}
              label="Subir licencia de conducir"
              hint="JPG, PNG o PDF"
            />
            <div className={css.bottomAction}>
              <Button variant="primary" size="lg" fullWidth disabled={!docs.length} onClick={next}>Continuar</Button>
            </div>
          </>
        )}

        {step === 'card' && (
          <>
            <StepHeader step={6} total={8} onBack={back} title="Tu tarjeta Flow" subtitle="Captura el número de 16 dígitos tal como aparece al frente." />
            <div className={css.cardPreview}>
              <PaymentCard
                holder=""
                last4={cardNum.replace(/\s/g, '').slice(-4) || '••••'}
                variant="ink"
                label="Flota"
              />
            </div>
            <Field label="Número de tarjeta" htmlFor="ob-card" error={cardError} valid={cardValid} validMessage="Tarjeta válida">
              <Input id="ob-card" mono icon="credit_card" size="lg" placeholder="5231 0000 0000 0000" value={cardNum} onChange={(v) => { setCardNum(fmtCard(v)); setCardError(''); setCardValid(false) }} invalid={!!cardError} />
            </Field>
            <div className={css.bottomAction}>
              <Button variant="primary" size="lg" fullWidth onClick={handleCardSubmit}>Validar tarjeta</Button>
            </div>
          </>
        )}

        {step === 'passcode' && (
          <>
            <StepHeader
              step={6} total={8} onBack={back}
              title={confirmPin ? 'Repite tu passcode' : 'Crea tu passcode'}
              subtitle={confirmPin ? 'Una vez más para confirmarlo.' : '6 dígitos para entrar y autorizar pagos.'}
            />
            <div className={css.keypadCenter}>
              <PasscodeKeypad
                value={confirmPin ? pin2 : pin}
                invalid={pinErr}
                onChange={(v) => { setPinErr(false); confirmPin ? setPin2(v) : setPin(v) }}
                onComplete={(v) => {
                  if (!confirmPin) { setConfirmPin(true); return }
                  if (v === pin) { next() } else {
                    setPinErr(true)
                    setTimeout(() => { setPin2(''); setPinErr(false) }, 500)
                  }
                }}
              />
            </div>
          </>
        )}

        {step === 'notif' && (
          <>
            <StepHeader step={8} total={8} onBack={back} title="Avisos que importan" subtitle="Te avisamos de cada cargo, depósito y alerta de seguridad." />
            <div className={css.notifCard}>
              <div className={css.notifRow}>
                <span className="flow-symbol flow-symbol--lg" aria-hidden="true" style={{ color: 'var(--text-accent)' }}>notifications_active</span>
                <div className={css.notifInfo}>
                  <span className={css.notifTitle}>Notificaciones push</span>
                  <span className={css.notifHint}>Cargos en tiempo real</span>
                </div>
                <Switch checked={notif} onChange={setNotif} />
              </div>
            </div>
            <div className={css.bottomAction}>
              <Button variant="primary" size="lg" fullWidth onClick={next}>Continuar</Button>
            </div>
          </>
        )}

        {step === 'bio' && (
          <div className={css.bioCenter}>
            <BiometricPrompt
              method="face"
              state={bioState}
              title="Activa Face ID"
              description={bioState === 'success' ? 'Listo. Entrarás sin teclear.' : 'Entra y autoriza pagos con tu cara.'}
              onUse={() => {
                setBioState('scanning')
                setTimeout(() => setBioState('success'), 1200)
                setTimeout(next, 2100)
              }}
              onFallback={next}
              fallbackLabel="Ahora no"
            />
          </div>
        )}

        {step === 'done' && (
          <div className={css.doneCenter}>
            <span className={css.successCircle}>
              <span className={`flow-symbol flow-symbol--fill ${css.successIcon}`} aria-hidden="true" style={{ color: 'var(--status-success-text)', animation: 'flowScaleIn var(--dur-base) var(--ease-spring)' }}>
                check_circle
              </span>
            </span>
            <h1 className={css.doneTitle}>Tarjeta activada</h1>
            <p className={css.doneDesc}>
              Tu tarjeta •••• {cardNum.replace(/\s/g, '').slice(-4) || '4821'} está lista para usarse.
            </p>
            <Button variant="primary" size="lg" onClick={() => { setLoginBioState('idle'); setLoginMode('bio'); setLoginPin(''); next() }}>Entrar a la app</Button>
          </div>
        )}

        {step === 'login' && (
          <div className={css.loginView}>
            <img src="/flow-logo.svg" alt="Flow" className={css.logo} />

            {loginMode === 'bio' && (
              <div className={css.bioCenter}>
                <span className={css.loginGreeting}>Hola, Diego</span>
                <BiometricPrompt
                  method="face"
                  state={loginBioState}
                  title="Face ID"
                  description={loginBioState === 'success' ? 'Bienvenido.' : 'Toca para verificar.'}
                  onUse={() => {
                    setLoginBioState('scanning')
                    setTimeout(() => setLoginBioState('success'), 1100)
                    setTimeout(next, 2000)
                  }}
                  onFallback={() => setLoginMode('pin')}
                  fallbackLabel="Usar passcode"
                />
              </div>
            )}

            {loginMode === 'pin' && (
              <div className={css.bioCenter}>
                <span className={css.loginGreeting}>Ingresa tu passcode</span>
                <PasscodeKeypad
                  value={loginPin}
                  invalid={loginPinErr}
                  biometricIcon="ar_on_you"
                  onBiometric={() => { setLoginMode('bio'); setLoginPin('') }}
                  onChange={(v) => { setLoginPinErr(false); setLoginPin(v) }}
                  onComplete={(v) => {
                    if (v === '000000') {
                      setLoginPinErr(true)
                      setTimeout(() => { setLoginPin(''); setLoginPinErr(false) }, 500)
                    } else {
                      next()
                    }
                  }}
                />
                <span className={css.loginHintText}>Tip: 000000 simula el error</span>
              </div>
            )}
          </div>
        )}

        {step === 'loginDone' && (
          <div className={css.loginView}>
            <div className={css.doneCenter}>
              <span className={css.successCircle}>
                <span className={`flow-symbol flow-symbol--fill ${css.successIcon}`} aria-hidden="true" style={{ color: 'var(--status-success-text)', animation: 'flowScaleIn var(--dur-base) var(--ease-spring)' }}>
                  check_circle
                </span>
              </span>
              <h1 className={css.doneTitle}>Sesión iniciada</h1>
              <Button variant="primary" size="lg" onClick={() => setIdx(0)}>Reiniciar demo</Button>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  )
}
