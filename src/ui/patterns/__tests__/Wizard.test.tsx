import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { Wizard } from '../Wizard'

const steps = [
  { label: 'Datos', description: 'Información personal' },
  { label: 'Dirección', description: 'Domicilio fiscal' },
  { label: 'Confirmación', description: 'Revisa y confirma' },
]

describe('Wizard', () => {
  it('renders current step content', () => {
    renderWithIntl(
      <Wizard steps={steps} current={0}>
        <p>Step 1 content</p>
      </Wizard>
    )
    expect(screen.getByText('Step 1 content')).toBeInTheDocument()
  })

  it('renders next button on non-last steps', () => {
    renderWithIntl(
      <Wizard steps={steps} current={0}>
        <p>Content</p>
      </Wizard>
    )
    expect(screen.getByText('Siguiente')).toBeInTheDocument()
  })

  it('renders custom nextLabel', () => {
    renderWithIntl(
      <Wizard steps={steps} current={0} nextLabel="Continuar">
        <p>Content</p>
      </Wizard>
    )
    expect(screen.getByText('Continuar')).toBeInTheDocument()
  })

  it('renders submit button on last step', () => {
    renderWithIntl(
      <Wizard steps={steps} current={2}>
        <p>Summary</p>
      </Wizard>
    )
    expect(screen.getByText('Confirmar')).toBeInTheDocument()
    expect(screen.queryByText('Siguiente')).not.toBeInTheDocument()
  })

  it('renders custom submitLabel on last step', () => {
    renderWithIntl(
      <Wizard steps={steps} current={2} submitLabel="Enviar pedido">
        <p>Summary</p>
      </Wizard>
    )
    expect(screen.getByText('Enviar pedido')).toBeInTheDocument()
  })

  it('renders back button when current > 0', () => {
    renderWithIntl(
      <Wizard steps={steps} current={1}>
        <p>Content</p>
      </Wizard>
    )
    expect(screen.getByText('Volver')).toBeInTheDocument()
  })

  it('does not render back button on first step', () => {
    renderWithIntl(
      <Wizard steps={steps} current={0}>
        <p>Content</p>
      </Wizard>
    )
    expect(screen.queryByText('Volver')).not.toBeInTheDocument()
  })

  it('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    renderWithIntl(
      <Wizard steps={steps} current={0} onNext={onNext}>
        <p>Content</p>
      </Wizard>
    )
    await user.click(screen.getByText('Siguiente'))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    renderWithIntl(
      <Wizard steps={steps} current={1} onBack={onBack}>
        <p>Content</p>
      </Wizard>
    )
    await user.click(screen.getByText('Volver'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('calls onSubmit when submit button is clicked on last step', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderWithIntl(
      <Wizard steps={steps} current={2} onSubmit={onSubmit}>
        <p>Summary</p>
      </Wizard>
    )
    await user.click(screen.getByText('Confirmar'))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('disables submit button when submitting', () => {
    renderWithIntl(
      <Wizard steps={steps} current={2} submitting>
        <p>Summary</p>
      </Wizard>
    )
    expect(screen.getByText('Confirmar')).toBeDisabled()
  })

  it('disables back button when submitting', () => {
    renderWithIntl(
      <Wizard steps={steps} current={2} submitting>
        <p>Summary</p>
      </Wizard>
    )
    expect(screen.getByText('Volver')).toBeDisabled()
  })
})
