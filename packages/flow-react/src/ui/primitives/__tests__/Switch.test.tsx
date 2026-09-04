import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Switch } from '../Switch'

describe('Switch', () => {
  it('renders with a label', () => {
    render(<Switch label="Activo" />)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('renders a checkbox role', () => {
    render(<Switch label="Modo oscuro" />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('reflects checked state', () => {
    render(<Switch checked label="On" />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onChange with toggled value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} label="Toggle" />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('does not fire onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch disabled onChange={onChange} label="Disabled" />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
