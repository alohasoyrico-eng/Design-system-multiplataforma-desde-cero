import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Progress } from '../Progress'

describe('Progress', () => {
  it('renders a progressbar role', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow and aria-valuemax', () => {
    render(<Progress value={30} max={200} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(bar).toHaveAttribute('aria-valuemax', '200')
  })

  it('renders label text', () => {
    render(<Progress value={10} label="Progreso" />)
    expect(screen.getByText('Progreso')).toBeInTheDocument()
  })

  it('shows value fraction when showValue is true', () => {
    render(<Progress value={25} max={50} showValue />)
    expect(screen.getByText('25/50')).toBeInTheDocument()
  })

  it('does not show value fraction by default', () => {
    const { container } = render(<Progress value={25} max={50} />)
    expect(container.textContent).not.toContain('25/50')
  })

  it('sets tone data attribute on the bar', () => {
    const { container } = render(<Progress value={50} tone="warning" />)
    const bar = container.querySelector('[data-tone="warning"]')
    expect(bar).toBeInTheDocument()
  })

  it('defaults tone to accent', () => {
    const { container } = render(<Progress value={50} />)
    const bar = container.querySelector('[data-tone="accent"]')
    expect(bar).toBeInTheDocument()
  })
})
