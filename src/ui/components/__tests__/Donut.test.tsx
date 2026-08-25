import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Donut } from '../Donut'

vi.mock('../../primitives/FlowChart', () => ({
  FlowChart: (props: { ariaLabel?: string }) => (
    <div data-testid="flow-chart" aria-label={props.ariaLabel} />
  ),
}))

const segments = [
  { label: 'Comida', value: 60 },
  { label: 'Transporte', value: 30 },
  { label: 'Otros', value: 10 },
]

describe('Donut', () => {
  it('renders center value', () => {
    render(<Donut segments={segments} centerValue="$100" />)
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  it('renders center label', () => {
    render(<Donut segments={segments} centerLabel="Total" />)
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('renders both center value and label', () => {
    render(<Donut segments={segments} centerValue="$100" centerLabel="Total" />)
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('renders legend items with labels', () => {
    render(<Donut segments={segments} />)
    expect(screen.getByText('Comida')).toBeInTheDocument()
    expect(screen.getByText('Transporte')).toBeInTheDocument()
    expect(screen.getByText('Otros')).toBeInTheDocument()
  })

  it('renders percentage in legend', () => {
    render(<Donut segments={segments} />)
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
  })

  it('hides legend when legend=false', () => {
    render(<Donut segments={segments} legend={false} />)
    expect(screen.queryByText('60%')).not.toBeInTheDocument()
  })

  it('renders with empty segments', () => {
    const { container } = render(<Donut segments={[]} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('passes aria label to FlowChart', () => {
    render(<Donut segments={segments} />)
    expect(screen.getByTestId('flow-chart')).toHaveAttribute(
      'aria-label',
      'Reparto: Comida, Transporte, Otros',
    )
  })

  it('renders icon in legend when segment has icon', () => {
    const withIcon = [
      { label: 'Fuel', value: 70, icon: 'local_gas_station' },
      { label: 'Toll', value: 30, icon: 'toll' },
    ]
    render(<Donut segments={withIcon} />)
    expect(screen.getByText('local_gas_station')).toBeInTheDocument()
    expect(screen.getByText('toll')).toBeInTheDocument()
  })
})
