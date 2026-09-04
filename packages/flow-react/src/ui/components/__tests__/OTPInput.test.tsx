import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { OTPInput } from '../OTPInput'

function ControlledOTP({ length = 4, onComplete }: { length?: number; onComplete?: (v: string) => void }) {
  const [value, setValue] = useState('')
  return <OTPInput length={length} value={value} onChange={setValue} onComplete={onComplete} />
}

describe('OTPInput', () => {
  it('renders input with correct aria-label', () => {
    render(<OTPInput length={6} />)
    expect(screen.getByLabelText('Código de 6 dígitos')).toBeInTheDocument()
  })

  it('renders the correct number of visual boxes', () => {
    const { container } = render(<OTPInput length={4} />)
    const boxes = container.querySelectorAll('[class*="box"]')
    expect(boxes).toHaveLength(4)
  })

  it('displays entered digits in boxes', () => {
    const { container } = render(<OTPInput length={4} value="12" />)
    const digits = container.querySelectorAll('[class*="digit"]')
    expect(digits).toHaveLength(2)
    expect(digits[0]).toHaveTextContent('1')
    expect(digits[1]).toHaveTextContent('2')
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OTPInput length={6} value="" onChange={onChange} />)
    await user.type(screen.getByLabelText('Código de 6 dígitos'), '1')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onComplete when all digits entered', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<ControlledOTP length={4} onComplete={onComplete} />)
    await user.type(screen.getByLabelText('Código de 4 dígitos'), '1234')
    expect(onComplete).toHaveBeenCalledWith('1234')
  })

  it('sets data-invalid on root when invalid', () => {
    const { container } = render(<OTPInput invalid />)
    expect(container.querySelector('[data-invalid]')).toBeInTheDocument()
  })

  it('disables input when disabled', () => {
    render(<OTPInput disabled />)
    expect(screen.getByLabelText('Código de 6 dígitos')).toBeDisabled()
  })
})
