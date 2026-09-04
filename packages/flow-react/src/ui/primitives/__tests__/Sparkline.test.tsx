import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Sparkline } from '../Sparkline'

describe('Sparkline', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Sparkline values={[1, 2, 3]} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders a polyline from values', () => {
    const { container } = render(<Sparkline values={[10, 20, 30]} />)
    const polyline = container.querySelector('polyline')
    expect(polyline).toBeInTheDocument()
    expect(polyline?.getAttribute('points')).toBeTruthy()
  })

  it('renders dot when showDot is true (default)', () => {
    const { container } = render(<Sparkline values={[5, 10, 15]} />)
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('does not render dot when showDot is false', () => {
    const { container } = render(<Sparkline values={[5, 10, 15]} showDot={false} />)
    expect(container.querySelector('circle')).not.toBeInTheDocument()
  })

  it('returns null for empty values', () => {
    const { container } = render(<Sparkline values={[]} />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('applies custom width and height', () => {
    const { container } = render(<Sparkline values={[1, 2]} width={200} height={60} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '200')
    expect(svg).toHaveAttribute('height', '60')
  })

  it('is aria-hidden', () => {
    const { container } = render(<Sparkline values={[1, 2, 3]} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
