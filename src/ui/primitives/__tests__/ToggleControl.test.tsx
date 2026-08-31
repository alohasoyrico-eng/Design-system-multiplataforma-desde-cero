import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ToggleControl } from '../ToggleControl'

describe('ToggleControl', () => {
  it('renders a checkbox input', () => {
    render(<ToggleControl><span>visual</span></ToggleControl>)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<ToggleControl label="Enable"><span /></ToggleControl>)
    expect(screen.getByText('Enable')).toBeInTheDocument()
  })

  it('reflects checked state', () => {
    render(<ToggleControl checked><span /></ToggleControl>)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onChange when toggled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ToggleControl checked={false} onChange={onChange}><span /></ToggleControl>)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('sets data-disabled on root when disabled', () => {
    const { container } = render(<ToggleControl disabled><span /></ToggleControl>)
    expect(container.firstChild).toHaveAttribute('data-disabled')
  })

  it('disables the checkbox input', () => {
    render(<ToggleControl disabled><span /></ToggleControl>)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
