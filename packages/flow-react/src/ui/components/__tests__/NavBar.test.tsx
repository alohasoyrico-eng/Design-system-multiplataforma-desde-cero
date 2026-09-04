import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { NavBar } from '../NavBar'

describe('NavBar', () => {
  it('renders title', () => {
    render(<NavBar title="Detalle de viaje" />)
    expect(screen.getByText('Detalle de viaje')).toBeInTheDocument()
  })

  it('renders back button', () => {
    render(<NavBar title="Página" onBack={() => {}} />)
    expect(screen.getByLabelText('Volver')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<NavBar title="Página" onBack={onBack} />)
    await user.click(screen.getByLabelText('Volver'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('renders trailing slot', () => {
    render(<NavBar title="Test" trailing={<button>Guardar</button>} />)
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })
})
