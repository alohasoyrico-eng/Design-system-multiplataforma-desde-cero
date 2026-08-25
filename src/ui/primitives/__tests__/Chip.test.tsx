import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Chip } from '../Chip'

describe('Chip', () => {
  it('renders label text', () => {
    render(<Chip label="Tag" />)
    expect(screen.getByText('Tag')).toBeInTheDocument()
  })

  it('renders as span (non-interactive) when no onClick', () => {
    const { container } = render(<Chip label="Static" />)
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })

  it('renders as button when onClick is provided', () => {
    render(<Chip label="Click me" onClick={() => {}} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('fires onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Chip label="Action" onClick={onClick} />)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('sets aria-pressed on clickable chip', () => {
    render(<Chip label="Selected" selected onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders remove button with accessible label', () => {
    render(<Chip label="Removable" onRemove={() => {}} />)
    expect(screen.getByLabelText('Quitar Removable')).toBeInTheDocument()
  })

  it('fires onRemove without triggering onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(<Chip label="Both" onClick={onClick} onRemove={onRemove} />)
    await user.click(screen.getByLabelText('Quitar Both'))
    expect(onRemove).toHaveBeenCalledOnce()
    expect(onClick).not.toHaveBeenCalled()
  })
})
