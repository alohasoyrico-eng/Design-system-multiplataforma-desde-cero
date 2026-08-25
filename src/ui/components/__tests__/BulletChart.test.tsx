import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BulletChart } from '../BulletChart'

const rows = [
  { label: 'Ventas', value: 75, target: 100 },
  { label: 'Gastos', value: 120, target: 90, prev: 80 },
]

describe('BulletChart', () => {
  it('renders row labels', () => {
    render(<BulletChart rows={rows} />)
    expect(screen.getByText('Ventas')).toBeInTheDocument()
    expect(screen.getByText('Gastos')).toBeInTheDocument()
  })

  it('renders bar elements for each row', () => {
    const { container } = render(<BulletChart rows={rows} />)
    const bars = container.querySelectorAll('[class*="bar"]')
    expect(bars.length).toBeGreaterThanOrEqual(2)
  })

  it('renders target markers', () => {
    const { container } = render(<BulletChart rows={rows} />)
    const targets = container.querySelectorAll('[class*="target"]')
    expect(targets.length).toBe(2)
  })

  it('renders previous period bar when prev is provided', () => {
    const { container } = render(<BulletChart rows={rows} />)
    const prevBars = container.querySelectorAll('[class*="prev"]')
    expect(prevBars.length).toBe(1)
  })

  it('renders value text for each row', () => {
    render(<BulletChart rows={rows} />)
    expect(screen.getByText('75')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
  })

  it('uses format function for values', () => {
    const format = (v: number) => `$${v}k`
    render(<BulletChart rows={rows} format={format} />)
    expect(screen.getByText('$75k')).toBeInTheDocument()
    expect(screen.getByText('$120k')).toBeInTheDocument()
  })

  it('marks over-target values with data-over', () => {
    const { container } = render(<BulletChart rows={rows} />)
    const overBars = container.querySelectorAll('[data-over]')
    // Gastos has value 120 > target 90, so it should be marked over
    expect(overBars.length).toBeGreaterThanOrEqual(1)
  })

  it('renders empty state when rows is empty', () => {
    render(<BulletChart rows={[]} />)
    expect(screen.getByText('Sin datos para este periodo')).toBeInTheDocument()
  })

  it('renders legend items', () => {
    render(<BulletChart rows={rows} />)
    expect(screen.getByText('Real')).toBeInTheDocument()
    expect(screen.getByText('Meta')).toBeInTheDocument()
    expect(screen.getByText('Periodo anterior')).toBeInTheDocument()
  })
})
