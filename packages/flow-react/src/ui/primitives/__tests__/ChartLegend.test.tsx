import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ChartLegend } from '../ChartLegend'

const items = [
  { label: 'Combustible', color: 'var(--viz-3)', value: '73%', icon: 'local_gas_station' },
  { label: 'Peaje', color: 'var(--viz-4)', value: '17%' },
  { label: 'Mantenimiento', color: 'var(--viz-5)', shape: 'square' as const },
]

describe('ChartLegend', () => {
  it('renders all item labels', () => {
    render(<ChartLegend items={items} />)
    expect(screen.getByText('Combustible')).toBeInTheDocument()
    expect(screen.getByText('Peaje')).toBeInTheDocument()
    expect(screen.getByText('Mantenimiento')).toBeInTheDocument()
  })

  it('renders color swatches', () => {
    const { container } = render(<ChartLegend items={items} />)
    const swatches = container.querySelectorAll('[class*="swatch"]')
    expect(swatches).toHaveLength(3)
  })

  it('renders icons when provided', () => {
    render(<ChartLegend items={items} />)
    expect(screen.getByText('local_gas_station')).toBeInTheDocument()
  })

  it('does not render icon when not provided', () => {
    render(<ChartLegend items={[{ label: 'Test', color: 'red' }]} />)
    const icons = screen.queryAllByText((_, el) => el?.classList.contains('flow-symbol') ?? false)
    expect(icons).toHaveLength(0)
  })

  it('renders values when provided', () => {
    render(<ChartLegend items={items} />)
    expect(screen.getByText('73%')).toBeInTheDocument()
    expect(screen.getByText('17%')).toBeInTheDocument()
  })

  it('supports vertical direction', () => {
    const { container } = render(<ChartLegend items={items} direction="vertical" />)
    expect(container.firstChild).toHaveAttribute('data-direction', 'vertical')
  })

  it('defaults to horizontal direction', () => {
    const { container } = render(<ChartLegend items={items} />)
    expect(container.firstChild).toHaveAttribute('data-direction', 'horizontal')
  })

  it('renders empty when items is empty', () => {
    const { container } = render(<ChartLegend items={[]} />)
    expect(container.firstChild?.childNodes).toHaveLength(0)
  })

  it('renders square swatch shape', () => {
    const { container } = render(<ChartLegend items={items} />)
    const squares = container.querySelectorAll('[data-shape="square"]')
    expect(squares).toHaveLength(1)
  })
})
