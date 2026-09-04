import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Stepper } from '../Stepper'

const steps = [
  { label: 'Datos personales' },
  { label: 'Verificación' },
  { label: 'Confirmación' },
]

describe('Stepper', () => {
  it('renders step labels', () => {
    render(<Stepper steps={steps} />)
    expect(screen.getByText('Datos personales')).toBeInTheDocument()
    expect(screen.getByText('Verificación')).toBeInTheDocument()
    expect(screen.getByText('Confirmación')).toBeInTheDocument()
  })

  it('marks current step with aria-current', () => {
    render(<Stepper steps={steps} current={1} />)
    const activeStep = screen.getByText('Verificación').closest('li')!
    expect(activeStep).toHaveAttribute('aria-current', 'step')
  })

  it('marks completed steps with done status', () => {
    const { container } = render(<Stepper steps={steps} current={2} />)
    const indicators = container.querySelectorAll('.indicator')
    expect(indicators[0]).toHaveAttribute('data-status', 'done')
    expect(indicators[1]).toHaveAttribute('data-status', 'done')
    expect(indicators[2]).toHaveAttribute('data-status', 'active')
  })

  it('shows check icon for completed steps', () => {
    const { container } = render(<Stepper steps={steps} current={1} />)
    const doneIndicator = container.querySelectorAll('.indicator')[0]
    expect(doneIndicator.querySelector('.flow-symbol')).toHaveTextContent('check')
  })

  it('shows step number for pending steps', () => {
    const { container } = render(<Stepper steps={steps} current={0} />)
    const indicators = container.querySelectorAll('.indicator')
    expect(indicators[1]).toHaveTextContent('2')
    expect(indicators[2]).toHaveTextContent('3')
  })

  it('sets orientation data attribute', () => {
    const { container } = render(<Stepper steps={steps} orientation="vertical" />)
    const ol = container.querySelector('ol')!
    expect(ol).toHaveAttribute('data-orientation', 'vertical')
  })

  it('defaults to horizontal orientation', () => {
    const { container } = render(<Stepper steps={steps} />)
    const ol = container.querySelector('ol')!
    expect(ol).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('renders step description when provided', () => {
    const stepsWithDesc = [{ label: 'Paso 1', description: 'Ingresa tus datos' }]
    render(<Stepper steps={stepsWithDesc} />)
    expect(screen.getByText('Ingresa tus datos')).toBeInTheDocument()
  })
})
