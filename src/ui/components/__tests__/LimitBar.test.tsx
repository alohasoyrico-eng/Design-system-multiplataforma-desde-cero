import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LimitBar } from '../LimitBar'

describe('LimitBar', () => {
  it('renders label', () => {
    render(<LimitBar label="Gasto mensual" current={500} max={1000} />)
    expect(screen.getByText('Gasto mensual')).toBeInTheDocument()
  })

  it('renders current and max values', () => {
    render(<LimitBar label="Límite" current={500} max={1000} />)
    expect(screen.getByText('$500 / $1,000')).toBeInTheDocument()
  })

  it('renders progress fill with correct width', () => {
    const { container } = render(<LimitBar label="Test" current={250} max={1000} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ width: '25%' })
  })

  it('handles zero max gracefully', () => {
    const { container } = render(<LimitBar label="Test" current={0} max={0} />)
    const fill = container.querySelector('[class*="fill"]')
    expect(fill).toHaveStyle({ width: '0%' })
  })

  it('renders track element', () => {
    const { container } = render(<LimitBar label="Bar" current={10} max={100} />)
    expect(container.querySelector('[class*="track"]')).toBeInTheDocument()
  })
})
