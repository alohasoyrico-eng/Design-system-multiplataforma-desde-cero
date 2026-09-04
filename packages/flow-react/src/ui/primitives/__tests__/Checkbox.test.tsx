import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from '../Checkbox'

describe('Checkbox', () => {
  it('renders a checkbox role', () => {
    render(<Checkbox label="Acepto" />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('reflects checked state', () => {
    render(<Checkbox checked label="Checked" />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onChange with toggled value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Toggle" />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('shows check icon when checked', () => {
    const { container } = render(<Checkbox checked label="Done" />)
    expect(container.querySelector('.icon')).toHaveTextContent('check')
  })

  it('shows remove icon when indeterminate', () => {
    const { container } = render(<Checkbox indeterminate label="Partial" />)
    expect(container.querySelector('.icon')).toHaveTextContent('remove')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Checkbox disabled label="Nope" />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
