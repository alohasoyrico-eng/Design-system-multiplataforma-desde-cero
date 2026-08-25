import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CircularProgress } from '../CircularProgress'

describe('CircularProgress', () => {
  it('renders with progressbar role', () => {
    render(<CircularProgress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow and aria-valuemax', () => {
    render(<CircularProgress value={30} max={200} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(bar).toHaveAttribute('aria-valuemax', '200')
  })

  it('sets aria-valuemin to 0', () => {
    render(<CircularProgress value={10} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0')
  })

  it('renders label text', () => {
    render(<CircularProgress value={75} label="Progreso" />)
    expect(screen.getByText('Progreso')).toBeInTheDocument()
  })

  it('sets aria-label from label prop', () => {
    render(<CircularProgress value={75} label="Progreso" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Progreso')
  })

  it('renders SVG with circles', () => {
    const { container } = render(<CircularProgress value={50} />)
    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(2)
  })

  it('sets stroke-dasharray on arc circle', () => {
    const size = 56
    const strokeWidth = 5
    const r = (size - strokeWidth) / 2
    const c = 2 * Math.PI * r
    const { container } = render(<CircularProgress value={50} max={100} size={size} strokeWidth={strokeWidth} />)
    const arc = container.querySelectorAll('circle')[1]
    expect(arc).toHaveAttribute('stroke-dasharray', String(c))
    expect(arc).toHaveAttribute('stroke-dashoffset', String(c * 0.5))
  })

  it('shows percentage when showValue is true', () => {
    render(<CircularProgress value={75} max={100} showValue />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('does not show percentage by default', () => {
    render(<CircularProgress value={75} max={100} />)
    expect(screen.queryByText('75%')).not.toBeInTheDocument()
  })
})
