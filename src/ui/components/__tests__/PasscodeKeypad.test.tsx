import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PasscodeKeypad } from '../PasscodeKeypad'

describe('PasscodeKeypad', () => {
  it('renders digit buttons 0-9', () => {
    render(<PasscodeKeypad />)
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument()
    }
  })

  it('renders delete button', () => {
    render(<PasscodeKeypad />)
    expect(screen.getByRole('button', { name: 'Borrar' })).toBeInTheDocument()
  })

  it('renders dot indicators matching length', () => {
    render(<PasscodeKeypad length={4} />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-label', '0 de 4 dígitos ingresados')
  })

  it('calls onChange when digit pressed', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PasscodeKeypad value="" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '5' }))
    expect(onChange).toHaveBeenCalledWith('5')
  })

  it('appends digit to existing value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PasscodeKeypad value="12" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '3' }))
    expect(onChange).toHaveBeenCalledWith('123')
  })

  it('calls onChange with truncated value on backspace', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PasscodeKeypad value="123" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Borrar' }))
    expect(onChange).toHaveBeenCalledWith('12')
  })

  it('shows error message when invalid', () => {
    render(<PasscodeKeypad invalid />)
    expect(screen.getByRole('alert')).toHaveTextContent('Código incorrecto')
  })

  it('does not accept digits beyond length', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PasscodeKeypad length={4} value="1234" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '5' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
