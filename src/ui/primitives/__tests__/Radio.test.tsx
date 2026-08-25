import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Radio } from '../Radio'

describe('Radio', () => {
  it('renders a radio input', () => {
    render(<Radio label="Opcion A" />)
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<Radio label="Opcion B" />)
    expect(screen.getByText('Opcion B')).toBeInTheDocument()
  })

  it('reflects checked state', () => {
    render(<Radio checked label="Checked" />)
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('calls onChange with value on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Radio value="opt1" onChange={onChange} label="Click me" />)
    await user.click(screen.getByRole('radio'))
    expect(onChange).toHaveBeenCalledWith('opt1')
  })

  it('does not fire onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Radio disabled onChange={onChange} label="Disabled" />)
    await user.click(screen.getByRole('radio'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('sets data-disabled on root when disabled', () => {
    const { container } = render(<Radio disabled label="Off" />)
    expect(container.querySelector('[data-disabled]')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<Radio label="Plan" description="Premium plan" />)
    expect(screen.getByText('Premium plan')).toBeInTheDocument()
  })
})
