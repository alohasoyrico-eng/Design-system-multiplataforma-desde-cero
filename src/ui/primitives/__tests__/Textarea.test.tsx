import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from '../Textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea placeholder="Escribe aqui" />)
    expect(screen.getByPlaceholderText('Escribe aqui')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Escribe aqui').tagName).toBe('TEXTAREA')
  })

  it('calls onChange with typed value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Textarea value="" onChange={onChange} placeholder="Mensaje" />)
    await user.type(screen.getByPlaceholderText('Mensaje'), 'H')
    expect(onChange).toHaveBeenCalledWith('H')
  })

  it('renders with placeholder text', () => {
    render(<Textarea placeholder="Ingresa tu comentario" />)
    expect(screen.getByPlaceholderText('Ingresa tu comentario')).toBeInTheDocument()
  })

  it('sets rows attribute', () => {
    render(<Textarea rows={5} placeholder="Multi" />)
    expect(screen.getByPlaceholderText('Multi')).toHaveAttribute('rows', '5')
  })

  it('defaults to 3 rows', () => {
    render(<Textarea placeholder="Default" />)
    expect(screen.getByPlaceholderText('Default')).toHaveAttribute('rows', '3')
  })

  it('disables the textarea', () => {
    render(<Textarea disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('sets aria-invalid when invalid', () => {
    render(<Textarea invalid placeholder="Error" />)
    expect(screen.getByPlaceholderText('Error')).toHaveAttribute('aria-invalid', 'true')
  })
})
