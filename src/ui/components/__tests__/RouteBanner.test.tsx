import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RouteBanner } from '../RouteBanner'

describe('RouteBanner', () => {
  it('renders title and subtitle', () => {
    render(<RouteBanner title="Av. Reforma 222" subtitle="En 5 min" />)
    expect(screen.getByText('Av. Reforma 222')).toBeInTheDocument()
    expect(screen.getByText('En 5 min')).toBeInTheDocument()
  })

  it('renders default navigation icon', () => {
    const { container } = render(<RouteBanner title="Test" subtitle="Sub" />)
    const icon = container.querySelector('.flow-symbol')
    expect(icon).toHaveTextContent('navigation')
  })

  it('renders custom icon', () => {
    const { container } = render(<RouteBanner icon="directions" title="Test" subtitle="Sub" />)
    const icon = container.querySelector('.flow-symbol')
    expect(icon).toHaveTextContent('directions')
  })

  it('renders close button when onClose provided', () => {
    render(<RouteBanner title="Test" subtitle="Sub" onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
  })

  it('does not render close button without onClose', () => {
    render(<RouteBanner title="Test" subtitle="Sub" />)
    expect(screen.queryByRole('button', { name: 'Cerrar' })).not.toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<RouteBanner title="Test" subtitle="Sub" onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
