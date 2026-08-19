import { Fragment, type CSSProperties } from 'react'
import css from './Stepper.module.css'

export interface StepperStep {
  label: string
  description?: string
}

export interface StepperProps {
  steps: StepperStep[]
  current?: number
  orientation?: 'horizontal' | 'vertical'
  style?: CSSProperties
}

export function Stepper({ steps, current = 0, orientation = 'horizontal', style }: StepperProps) {
  return (
    <ol
      className={css.root}
      data-orientation={orientation}
      style={style}
    >
      <span className={css.srOnly}>
        Paso {current + 1} de {steps.length}{steps[current] ? `: ${steps[current].label}` : ''}
      </span>
      {steps.map((step, i) => {
        const status = i < current ? 'done' : i === current ? 'active' : 'pending'
        return (
          <Fragment key={i}>
            <li className={css.step} data-status={status} aria-current={status === 'active' ? 'step' : undefined}>
              <span className={css.indicator} data-status={status} aria-hidden="true">
                {status === 'done' ? (
                  <span className={`flow-icon ${css.check}`}>check</span>
                ) : (
                  i + 1
                )}
              </span>
              <span className={css.text}>
                <span className={css.label}>{step.label}</span>
                {step.description && <span className={css.description}>{step.description}</span>}
              </span>
            </li>
            {i < steps.length - 1 && (
              <span className={css.connector} data-done={i < current || undefined} aria-hidden="true" />
            )}
          </Fragment>
        )
      })}
    </ol>
  )
}
