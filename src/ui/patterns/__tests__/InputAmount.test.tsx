import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { InputAmount } from '../InputAmount'

describe('InputAmount', () => {
  it('renders input element', () => {
    render(<InputAmount />)
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument()
  })

  it('renders currency label', () => {
    render(<InputAmount currency="MXN" />)
    expect(screen.getByText('MXN')).toBeInTheDocument()
  })

  it('renders default currency symbol', () => {
    render(<InputAmount />)
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('calls onChange when typing digits', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<InputAmount value="" onChange={onChange} />)
    await user.type(screen.getByPlaceholderText('0.00'), '1')
    expect(onChange).toHaveBeenCalled()
  })

  it('displays formatted value', () => {
    render(<InputAmount value="1234" />)
    expect(screen.getByDisplayValue('1,234')).toBeInTheDocument()
  })

  it('sets aria-invalid when invalid', () => {
    render(<InputAmount invalid />)
    expect(screen.getByPlaceholderText('0.00')).toHaveAttribute('aria-invalid', 'true')
  })
})
