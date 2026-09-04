import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IconButton } from '../IconButton'

describe('IconButton', () => {
  it('renders with aria-label', () => {
    render(<IconButton icon="close" ariaLabel="Cerrar" />)
    expect(screen.getByLabelText('Cerrar')).toBeInTheDocument()
  })

  it('fires onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<IconButton icon="add" ariaLabel="Agregar" onClick={onClick} />)
    await user.click(screen.getByLabelText('Agregar'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is set', () => {
    render(<IconButton icon="delete" ariaLabel="Borrar" disabled />)
    expect(screen.getByLabelText('Borrar')).toBeDisabled()
  })

  it('sets data-variant and data-size', () => {
    render(<IconButton icon="star" ariaLabel="Fav" variant="primary" size="lg" />)
    const btn = screen.getByLabelText('Fav')
    expect(btn).toHaveAttribute('data-variant', 'primary')
    expect(btn).toHaveAttribute('data-size', 'lg')
  })

  it('renders badge indicator when badge prop is set', () => {
    const { container } = render(<IconButton icon="notifications" ariaLabel="Alertas" badge={3} />)
    expect(container.querySelector('.badge')).toBeInTheDocument()
  })

  it('sets data-selected when selected', () => {
    render(<IconButton icon="star" ariaLabel="Fav" selected />)
    expect(screen.getByLabelText('Fav')).toHaveAttribute('data-selected')
  })
})
