import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Divider } from '../Divider'

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders a vertical separator', () => {
    render(<Divider orientation="vertical" />)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders label text when provided', () => {
    render(<Divider label="O" />)
    expect(screen.getByText('O')).toBeInTheDocument()
    expect(screen.getByRole('separator')).toHaveAttribute('aria-label', 'O')
  })

  it('renders as hr when horizontal without label', () => {
    const { container } = render(<Divider />)
    expect(container.querySelector('hr')).toBeInTheDocument()
  })

  it('applies custom style', () => {
    render(<Divider style={{ marginTop: 16 }} />)
    expect(screen.getByRole('separator')).toHaveStyle({ marginTop: '16px' })
  })
})
