import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { Input } from '../Input'

describe('Input', () => {
  it('renders a text input by default', () => {
    renderWithIntl(<Input placeholder="Nombre" />)
    expect(screen.getByPlaceholderText('Nombre')).toHaveAttribute('type', 'text')
  })

  it('calls onChange with the new value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithIntl(<Input value="" onChange={onChange} placeholder="Nombre" />)
    await user.type(screen.getByPlaceholderText('Nombre'), 'A')
    expect(onChange).toHaveBeenCalledWith('A')
  })

  it('disables the native input', () => {
    renderWithIntl(<Input disabled placeholder="Bloqueado" />)
    expect(screen.getByPlaceholderText('Bloqueado')).toBeDisabled()
  })

  it('renders as password when revealable', () => {
    renderWithIntl(<Input revealable placeholder="Clave" />)
    expect(screen.getByPlaceholderText('Clave')).toHaveAttribute('type', 'password')
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithIntl(<Input revealable placeholder="Clave" />)
    const input = screen.getByPlaceholderText('Clave')
    expect(input).toHaveAttribute('type', 'password')
    await user.click(screen.getByLabelText('Mostrar'))
    expect(input).toHaveAttribute('type', 'text')
    await user.click(screen.getByLabelText('Ocultar'))
    expect(input).toHaveAttribute('type', 'password')
  })

  it('sets data-mono when mono prop is true', () => {
    renderWithIntl(<Input mono placeholder="ID" />)
    expect(screen.getByPlaceholderText('ID')).toHaveAttribute('data-mono')
  })
})

describe('Input — trailing', () => {
  it('renderiza el adorno trailing', () => {
    renderWithIntl(<Input value="120" trailing={<span>km</span>} />)
    expect(screen.getByText('km')).toBeInTheDocument()
  })

  it('revealable tiene prioridad sobre trailing', () => {
    renderWithIntl(<Input value="x" revealable trailing={<span>km</span>} />)
    expect(screen.queryByText('km')).toBeNull()
    expect(screen.getByRole('button', { name: 'Mostrar' })).toBeInTheDocument()
  })
})
