import { useState, useRef, useEffect } from 'react'
import { Stepper, type StepperStep } from '../ui/components/Stepper'
import { Card } from '../ui/components/Card'
import { Input } from '../ui/primitives/Input'
import { Select } from '../ui/primitives/Select'
import { Field } from '../ui/primitives/Field'
import { Button } from '../ui/primitives/Button'
import { Badge } from '../ui/primitives/Badge'
import { Chip } from '../ui/primitives/Chip'
import { OTPInput } from '../ui/components/OTPInput'
import { OnboardingCarousel } from '../ui/components/OnboardingCarousel'
import { StatusView } from '../ui/components/StatusView'
import css from './OnboardingPage.module.css'

const STEPS: StepperStep[] = [
  { label: 'Empresa', description: 'Datos básicos' },
  { label: 'Verificación', description: 'Confirma tu correo' },
  { label: 'Equipo', description: 'Invita (opcional)' },
  { label: 'Primera unidad', description: 'Opcional' },
]

const FLEET_SIZES = [
  { value: 's', label: '1–10 unidades' },
  { value: 'm', label: '11–50 unidades' },
  { value: 'l', label: '50+ unidades' },
]

function Resend() {
  const [left, setLeft] = useState(42)
  useEffect(() => {
    const t = setInterval(() => setLeft(l => l > 0 ? l - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])
  if (left > 0) {
    return <span className={css.resendTimer}>Reenviar en 0:{String(left).padStart(2, '0')}</span>
  }
  return (
    <a href="#" onClick={e => { e.preventDefault(); setLeft(42) }} className={css.resendLink}>
      Reenviar código
    </a>
  )
}

const WELCOME_SLIDES = [
  { icon: 'rocket_launch', title: 'Bienvenido a Flow', description: 'Tu plataforma para gestionar flotas y operaciones en tiempo real.' },
  { icon: 'map', title: 'Seguimiento GPS', description: 'Monitorea todas tus unidades con actualizaciones cada 15 segundos.' },
  { icon: 'insights', title: 'Reportes inteligentes', description: 'Analiza datos de operación con visualizaciones interactivas.' },
]

export function OnboardingPage() {
  const [phase, setPhase] = useState<'welcome' | 'form' | 'success'>('welcome')
  const [welcomeIdx, setWelcomeIdx] = useState(0)
  const [step, setStep] = useState(0)
  const [company, setCompany] = useState('')
  const [size, setSize] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [invites, setInvites] = useState<string[]>([])
  const [inv, setInv] = useState('')
  const [plate, setPlate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const after = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const clearError = (key: string) => {
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n })
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!company.trim()) e.company = 'El nombre es obligatorio.'
      if (!email.includes('@')) e.email = 'Ingresa un correo válido.'
    }
    if (Object.keys(e).length) {
      setErrors(e)
      return false
    }
    setErrors({})
    return true
  }

  const next = () => {
    if (!validate()) return
    if (step === 1 && code.length < 6) return
    setStep(s => s + 1)
  }

  const skip = () => {
    if (step === 3) {
      finish()
    } else {
      setStep(s => s + 1)
    }
  }

  const finish = () => {
    setSubmitting(true)
    after(1500, () => {
      setSubmitting(false)
      setPhase('success')
    })
  }

  const addInvite = () => {
    if (!inv.includes('@')) return
    setInvites(list => [...list, inv])
    setInv('')
  }

  const isLast = step === STEPS.length - 1
  const canAdvance = step === 0 ? (!!company.trim() && email.includes('@'))
    : step === 1 ? code.length >= 6
    : true

  if (phase === 'welcome') {
    return (
      <div className={css.root} style={{ justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 420, height: 520 }}>
          <OnboardingCarousel
            slides={WELCOME_SLIDES}
            index={welcomeIdx}
            onIndexChange={setWelcomeIdx}
            onDone={() => setPhase('form')}
            onSkip={() => setPhase('form')}
            doneLabel="Crear mi cuenta"
          />
        </div>
      </div>
    )
  }

  if (phase === 'success') {
    return (
      <div className={css.root} style={{ justifyContent: 'center' }}>
        <StatusView
          status="success"
          title="¡Cuenta creada!"
          description={`${company || 'Tu empresa'} ya está lista. Te enviamos un correo a ${email || 'tu dirección'} con los siguientes pasos.`}
          primaryAction={<Button variant="accent" icon="dashboard" onClick={() => window.location.href = '/'}>Ir al dashboard</Button>}
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className={css.root}>
      <img src="/assets/flow-logo.png" alt="Flow" className={css.logo} />
      <h1 className={css.title}>Crea tu flota</h1>

      <Stepper
        current={step}
        steps={STEPS}
        style={{ marginBottom: 32, width: '100%', justifyContent: 'space-between' }}
      />

      <Card>
        <div className={css.stepContent}>
          {step === 0 && (
            <div className={css.fields}>
              <Field label="Nombre de la empresa" htmlFor="ob-company" required error={errors.company}>
                <Input
                  value={company}
                  onChange={v => { setCompany(v); clearError('company') }}
                  icon="apartment"
                  placeholder="Transportes Vidal SA"
                  error={!!errors.company}
                />
              </Field>
              <div className={css.grid2}>
                <Field label="Tamaño de flota">
                  <Select
                    value={size}
                    onChange={v => setSize(String(v))}
                    placeholder="Selecciona…"
                    options={FLEET_SIZES}
                  />
                </Field>
                <Field label="Correo de trabajo" htmlFor="ob-email" required error={errors.email}>
                  <Input
                    value={email}
                    onChange={v => { setEmail(v); clearError('email') }}
                    type="email"
                    icon="mail"
                    placeholder="marta@flota.mx"
                    error={!!errors.email}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className={css.verify}>
              <p className={css.verifyHint}>
                Enviamos un código de activación a <b>{email || 'tu correo'}</b>.
              </p>
              <OTPInput length={6} value={code} onChange={setCode} autoFocus />
              <Resend />
            </div>
          )}

          {step === 2 && (
            <div className={css.fields}>
              <Field
                label="Invita a tu equipo"
                htmlFor="ob-invite"
                help="Recibirán un correo con su código. Puedes saltarlo y hacerlo después."
              >
                <div className={css.inviteRow}>
                  <Input
                    value={inv}
                    onChange={setInv}
                    type="email"
                    icon="mail"
                    placeholder="persona@flota.mx"
                    style={{ flex: 1 }}
                  />
                  <Button
                    variant="secondary"
                    icon="add"
                    disabled={!inv.includes('@')}
                    onClick={addInvite}
                  >
                    Agregar
                  </Button>
                </div>
              </Field>
              {invites.length > 0 && (
                <div className={css.chips}>
                  {invites.map(i => (
                    <Chip
                      key={i}
                      label={i}
                      onRemove={() => setInvites(list => list.filter(x => x !== i))}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className={css.fields}>
              <Field
                label="Placa de tu primera unidad"
                htmlFor="ob-plate"
                help="Opcional: el dashboard te guiará si lo saltas."
              >
                <Input
                  value={plate}
                  onChange={setPlate}
                  icon="local_taxi"
                  placeholder="JMX-214-B"
                />
              </Field>
              {plate.length >= 5 && (
                <Badge tone="success" icon="check">Lista para crearse con la cuenta</Badge>
              )}
            </div>
          )}
        </div>

        <div className={css.actions}>
          <Button
            variant="ghost"
            icon="arrow_back"
            onClick={() => setStep(s => s - 1)}
            style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
          >
            Atrás
          </Button>
          <div className={css.actionsEnd}>
            {(step === 2 || step === 3) && (
              <Button variant="ghost" onClick={skip} disabled={submitting}>
                Saltar
              </Button>
            )}
            <Button
              variant={isLast ? 'accent' : 'primary'}
              iconTrailing={isLast ? undefined : 'arrow_forward'}
              icon={isLast ? 'check' : undefined}
              disabled={!canAdvance || submitting}
              loading={submitting}
              onClick={isLast ? finish : next}
            >
              {isLast ? 'Crear cuenta' : 'Continuar'}
            </Button>
          </div>
        </div>
      </Card>

      <p className={css.footer}>El tiempo hasta tu primera unidad activa es nuestra métrica de éxito.</p>
    </div>
  )
}
