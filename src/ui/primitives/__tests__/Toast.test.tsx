import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toast, ToastStack } from '../Toast'

describe('Toast', () => {
  it('renders with alert role', () => {
    render(<Toast message="Guardado" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows the message text', () => {
    render(<Toast message="Operación exitosa" />)
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument()
  })

  it('renders dismiss button when onDismiss is provided', () => {
    render(<Toast message="X" onDismiss={() => {}} />)
    expect(screen.getByLabelText('Cerrar')).toBeInTheDocument()
  })

  it('does not render dismiss button without onDismiss', () => {
    render(<Toast message="No dismiss" />)
    expect(screen.queryByLabelText('Cerrar')).not.toBeInTheDocument()
  })

  it('fires onDismiss on click', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Toast message="Bye" onDismiss={onDismiss} />)
    await user.click(screen.getByLabelText('Cerrar'))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})

describe('ToastStack', () => {
  it('renders with aria-live polite', () => {
    const { container } = render(<ToastStack><div>Toast</div></ToastStack>)
    expect(container.firstChild).toHaveAttribute('aria-live', 'polite')
  })
})

describe('Toast — acción inline', () => {
  it('renderiza el botón de acción y dispara onAction', async () => {
    const onAction = vi.fn()
    render(<Toast message="Unidad eliminada" actionLabel="Deshacer" onAction={onAction} />)
    await userEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('sin onAction no renderiza acción aunque haya label', () => {
    render(<Toast message="X" actionLabel="Deshacer" />)
    expect(screen.queryByRole('button', { name: 'Deshacer' })).toBeNull()
  })
})
