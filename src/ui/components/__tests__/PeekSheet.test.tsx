import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PeekSheet } from '../PeekSheet'

describe('PeekSheet', () => {
  it('renders title', () => {
    render(<PeekSheet title="Acciones rápidas"><p>Content</p></PeekSheet>)
    expect(screen.getByText('Acciones rápidas')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(<PeekSheet title="Test"><p>Child content here</p></PeekSheet>)
    expect(screen.getByText('Child content here')).toBeInTheDocument()
  })

  it('renders handle element', () => {
    const { container } = render(<PeekSheet title="Test"><span>X</span></PeekSheet>)
    expect(container.querySelector('.handle')).toBeInTheDocument()
  })
})
