import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { InputPhone } from '../InputPhone'

describe('InputPhone', () => {
  it('renders input element', () => {
    render(<InputPhone />)
    expect(screen.getByPlaceholderText('55 1234 5678')).toBeInTheDocument()
  })

  it('renders prefix', () => {
    render(<InputPhone prefix="+52" />)
    expect(screen.getByText('+52')).toBeInTheDocument()
  })

  it('renders custom prefix', () => {
    render(<InputPhone prefix="+1" />)
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<InputPhone value="" onChange={onChange} />)
    await user.type(screen.getByPlaceholderText('55 1234 5678'), '5')
    expect(onChange).toHaveBeenCalled()
  })

  it('formats displayed value', () => {
    render(<InputPhone value="5512345678" />)
    expect(screen.getByDisplayValue('55 1234 5678')).toBeInTheDocument()
  })

  it('sets aria-invalid when invalid', () => {
    render(<InputPhone invalid />)
    expect(screen.getByPlaceholderText('55 1234 5678')).toHaveAttribute('aria-invalid', 'true')
  })
})
