import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { Stepper, type StepperStep } from '../primitives/Stepper'
import { Button } from '../primitives/Button'
import css from './Wizard.module.css'

export interface WizardProps {
  steps: StepperStep[]
  current: number
  onBack?: () => void
  onNext?: () => void
  onSubmit?: () => void
  submitting?: boolean
  nextLabel?: string
  submitLabel?: string
  children: ReactNode
}

export function Wizard({
  steps,
  current,
  onBack,
  onNext,
  onSubmit,
  submitting,
  nextLabel,
  submitLabel,
  children,
}: WizardProps) {
  const intl = useIntl()
  const resolvedNextLabel = nextLabel ?? intl.formatMessage({ id: 'common.next', defaultMessage: 'Siguiente' })
  const resolvedSubmitLabel = submitLabel ?? intl.formatMessage({ id: 'common.confirm', defaultMessage: 'Confirmar' })
  const isLast = current >= steps.length - 1

  return (
    <div className={css.root}>
      <Stepper steps={steps} current={current} style={{ width: '100%', justifyContent: 'space-between' }} />
      <div className={css.body}>{children}</div>
      <div className={css.actions}>
        {current > 0 ? (
          <Button variant="ghost" icon="arrow_back" onClick={onBack} disabled={submitting}>
            Volver
          </Button>
        ) : (
          <span />
        )}
        <div className={css.actionsEnd}>
          {isLast ? (
            <Button variant="primary" onClick={onSubmit} loading={submitting} disabled={submitting}>
              {resolvedSubmitLabel}
            </Button>
          ) : (
            <Button variant="primary" iconTrailing="arrow_forward" onClick={onNext}>
              {resolvedNextLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export interface WizardSummaryProps {
  children: ReactNode
}

export function WizardSummary({ children }: WizardSummaryProps) {
  return <div className={css.summary}>{children}</div>
}

export interface WizardSummarySectionProps {
  title: string
  onEdit?: () => void
  children: ReactNode
}

export function WizardSummarySection({ title, onEdit, children }: WizardSummarySectionProps) {
  return (
    <div className={css.summarySection}>
      <div className={css.summaryTitle}>
        {title}
        {onEdit && (
          <button className={css.summaryEdit} onClick={onEdit} type="button">
            Editar
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

export interface WizardSummaryRowProps {
  label: string
  value: string
}

export function WizardSummaryRow({ label, value }: WizardSummaryRowProps) {
  return (
    <div className={css.summaryRow}>
      <span className={css.summaryLabel}>{label}</span>
      <span className={css.summaryValue}>{value}</span>
    </div>
  )
}
