import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Activo</Badge>)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('sets tone data attribute', () => {
    const { container } = render(<Badge tone="success">OK</Badge>)
    expect(container.firstChild).toHaveAttribute('data-tone', 'success')
  })

  it('defaults to default tone', () => {
    const { container } = render(<Badge>Label</Badge>)
    expect(container.firstChild).toHaveAttribute('data-tone', 'default')
  })

  it('renders live dot when live prop is set', () => {
    const { container } = render(<Badge live>Online</Badge>)
    expect(container.querySelector('.dot')).toBeInTheDocument()
  })

  it('does not render live dot by default', () => {
    const { container } = render(<Badge>Offline</Badge>)
    expect(container.querySelector('.dot')).not.toBeInTheDocument()
  })

  it('renders all tone variants', () => {
    const tones = ['default', 'success', 'warning', 'danger', 'info'] as const
    tones.forEach((t) => {
      const { container, unmount } = render(<Badge tone={t}>X</Badge>)
      expect(container.firstChild).toHaveAttribute('data-tone', t)
      unmount()
    })
  })
})
