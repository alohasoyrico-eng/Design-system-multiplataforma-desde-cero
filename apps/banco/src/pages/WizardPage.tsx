import { useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card } from '@alohasoyrico-eng/flow-react'
import { Input } from '@alohasoyrico-eng/flow-react'
import { Select } from '@alohasoyrico-eng/flow-react'
import { Field } from '@alohasoyrico-eng/flow-react'
import { Wizard, WizardSummary, WizardSummarySection, WizardSummaryRow } from '@alohasoyrico-eng/flow-react'
import { PageHeader } from '@alohasoyrico-eng/flow-react'
import { useNotify } from '../app/NotifyContext'
import { useTrack } from '@alohasoyrico-eng/flow-react'

const STEPS = [
  { label: 'Vehículo', description: 'Datos de la unidad' },
  { label: 'Conductor', description: 'Asignar conductor' },
  { label: 'Confirmación', description: 'Revisar y enviar' },
]

interface FormData {
  plate: string
  brand: string
  model: string
  year: string
  type: string
  vin: string
  driver: string
  license: string
  phone: string
  email: string
}

const EMPTY: FormData = {
  plate: '', brand: '', model: '', year: '', type: '', vin: '',
  driver: '', license: '', phone: '', email: '',
}

type Errors = Partial<Record<keyof FormData, string>>

function validateStep(step: number, data: FormData): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!data.plate.trim()) e.plate = 'La placa es obligatoria.'
    if (!data.brand.trim()) e.brand = 'La marca es obligatoria.'
    if (!data.model.trim()) e.model = 'El modelo es obligatorio.'
    if (!data.year) e.year = 'El año es obligatorio.'
    if (!data.type) e.type = 'El tipo es obligatorio.'
  }
  if (step === 1) {
    if (!data.driver.trim()) e.driver = 'El nombre es obligatorio.'
    if (!data.license.trim()) e.license = 'La licencia es obligatoria.'
    if (!data.phone.trim()) e.phone = 'El teléfono es obligatorio.'
  }
  return e
}

const YEARS = Array.from({ length: 10 }, (_, i) => {
  const y = String(2026 - i)
  return { value: y, label: y }
})

export function WizardPage() {
  const navigate = useNavigate()
  const track = useTrack()
  const notify = useNotify()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const set = (key: keyof FormData) => (value: string | string[]) => {
    setData((d) => ({ ...d, [key]: value as string }))
    setErrors((e) => {
      if (!e[key]) return e
      const next = { ...e }
      delete next[key]
      return next
    })
  }

  const focusFirstError = (errs: Errors) => {
    const firstKey = Object.keys(errs)[0]
    if (firstKey && formRef.current) {
      const el = formRef.current.querySelector<HTMLElement>(`[data-field="${firstKey}"] input, [data-field="${firstKey}"] [role="combobox"]`)
      el?.focus()
    }
  }

  const handleNext = () => {
    const errs = validateStep(step, data)
    if (Object.keys(errs).length) {
      setErrors(errs)
      focusFirstError(errs)
      return
    }
    setErrors({})
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setErrors({})
    setStep((s) => s - 1)
  }

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      track('unit_added', { source: 'wizard' })
      notify(`Unidad ${data.plate} registrada correctamente`)
      navigate({ to: '/unidades' })
    }, 1500)
  }

  return (
    <>
      <PageHeader
        breadcrumb={['Flota', 'Unidades', 'Alta de unidad']}
        title="Alta de unidad"
      />

      <Card>
        <Wizard
          steps={STEPS}
          current={step}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Registrar unidad"
        >
          {step === 0 && (
            <div ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-stack)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-stack)' }}>
                <div data-field="plate">
                  <Field label="Placa" htmlFor="wz-plate" required error={errors.plate}>
                    <Input value={data.plate} onChange={set('plate')} placeholder="ABC-123-X" invalid={!!errors.plate} />
                  </Field>
                </div>
                <div data-field="vin">
                  <Field label="VIN" htmlFor="wz-vin" help="Número de identificación vehicular (opcional).">
                    <Input value={data.vin} onChange={set('vin')} placeholder="1HGBH41JXMN109186" />
                  </Field>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-stack)' }}>
                <div data-field="brand">
                  <Field label="Marca" htmlFor="wz-brand" required error={errors.brand}>
                    <Input value={data.brand} onChange={set('brand')} placeholder="Toyota" invalid={!!errors.brand} />
                  </Field>
                </div>
                <div data-field="model">
                  <Field label="Modelo" htmlFor="wz-model" required error={errors.model}>
                    <Input value={data.model} onChange={set('model')} placeholder="Corolla" invalid={!!errors.model} />
                  </Field>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-stack)' }}>
                <div data-field="year">
                  <Field label="Año" htmlFor="wz-year" required error={errors.year}>
                    <Select options={YEARS} value={data.year} onChange={set('year')} placeholder="Seleccionar…" invalid={!!errors.year} />
                  </Field>
                </div>
                <div data-field="type">
                  <Field label="Tipo de unidad" htmlFor="wz-type" required error={errors.type}>
                    <Select
                      options={[
                        { value: 'sedan', label: 'Sedán' },
                        { value: 'van', label: 'Van' },
                        { value: 'moto', label: 'Moto' },
                        { value: 'camion', label: 'Camión' },
                      ]}
                      value={data.type}
                      onChange={set('type')}
                      placeholder="Seleccionar…"
                      invalid={!!errors.type}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-stack)' }}>
              <div data-field="driver">
                <Field label="Nombre completo" htmlFor="wz-driver" required error={errors.driver}>
                  <Input value={data.driver} onChange={set('driver')} placeholder="Juan Pérez" invalid={!!errors.driver} />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-stack)' }}>
                <div data-field="license">
                  <Field label="Número de licencia" htmlFor="wz-license" required error={errors.license}>
                    <Input value={data.license} onChange={set('license')} placeholder="LIC-12345" invalid={!!errors.license} />
                  </Field>
                </div>
                <div data-field="phone">
                  <Field label="Teléfono" htmlFor="wz-phone" required error={errors.phone}>
                    <Input value={data.phone} onChange={set('phone')} placeholder="+52 55 1234 5678" type="tel" invalid={!!errors.phone} />
                  </Field>
                </div>
              </div>
              <div data-field="email">
                <Field label="Correo electrónico" htmlFor="wz-email" help="Opcional. Se usará para notificaciones.">
                  <Input value={data.email} onChange={set('email')} placeholder="juan@ejemplo.com" type="email" />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <WizardSummary>
              <WizardSummarySection title="Vehículo" onEdit={() => setStep(0)}>
                <WizardSummaryRow label="Placa" value={data.plate} />
                <WizardSummaryRow label="Marca / Modelo" value={`${data.brand} ${data.model}`} />
                <WizardSummaryRow label="Año" value={data.year} />
                <WizardSummaryRow label="Tipo" value={data.type === 'sedan' ? 'Sedán' : data.type === 'van' ? 'Van' : data.type === 'moto' ? 'Moto' : 'Camión'} />
                {data.vin && <WizardSummaryRow label="VIN" value={data.vin} />}
              </WizardSummarySection>
              <WizardSummarySection title="Conductor" onEdit={() => setStep(1)}>
                <WizardSummaryRow label="Nombre" value={data.driver} />
                <WizardSummaryRow label="Licencia" value={data.license} />
                <WizardSummaryRow label="Teléfono" value={data.phone} />
                {data.email && <WizardSummaryRow label="Email" value={data.email} />}
              </WizardSummarySection>
            </WizardSummary>
          )}
        </Wizard>
      </Card>
    </>
  )
}
