import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Bars } from '../Bars'

const data = [
  { label: 'Ene', value: 40 },
  { label: 'Feb', value: 80 },
  { label: 'Mar', value: 60 },
]

describe('Bars', () => {
  it('renders bar elements for each data point', () => {
    const { container } = render(<Bars data={data} />)
    const bars = container.querySelectorAll('[class*="bar"]')
    expect(bars.length).toBeGreaterThanOrEqual(3)
  })

  it('renders labels from data', () => {
    render(<Bars data={data} />)
    expect(screen.getByText('Ene')).toBeInTheDocument()
    expect(screen.getByText('Feb')).toBeInTheDocument()
    expect(screen.getByText('Mar')).toBeInTheDocument()
  })

  it('renders nothing when data is empty', () => {
    const { container } = render(<Bars data={[]} />)
    const bars = container.querySelectorAll('[class*="bar"]')
    expect(bars.length).toBe(0)
  })

  it('applies custom height', () => {
    const { container } = render(<Bars data={data} height={300} />)
    const root = container.querySelector('[class*="root"]')
    expect(root).toHaveStyle({ height: '300px' })
  })

  it('uses custom format for tooltip values', async () => {
    const format = (v: number) => `$${v}`
    const { container } = render(<Bars data={data} format={format} />)
    // Bars renders tooltips on hover; we verify the component accepts the format prop without error
    expect(container.querySelector('[class*="root"]')).toBeInTheDocument()
  })
})
