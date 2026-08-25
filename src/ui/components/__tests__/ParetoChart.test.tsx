import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ParetoChart } from '../ParetoChart'

// Mock FlowChart since ECharts requires a real canvas context
vi.mock('../../primitives/FlowChart', () => ({
  FlowChart: (props: Record<string, unknown>) => (
    <div data-testid="flow-chart" data-type={props.type} aria-label={props.ariaLabel as string}>
      {(props.labels as string[])?.map((l: string) => (
        <span key={l} data-label>{l}</span>
      ))}
    </div>
  ),
}))

const data = [
  { label: 'Producto A', value: 50 },
  { label: 'Producto B', value: 30 },
  { label: 'Producto C', value: 15 },
  { label: 'Producto D', value: 5 },
]

describe('ParetoChart', () => {
  it('renders FlowChart with type pareto', () => {
    const { getByTestId } = render(<ParetoChart data={data} />)
    expect(getByTestId('flow-chart')).toHaveAttribute('data-type', 'pareto')
  })

  it('renders sorted labels', () => {
    const { getByTestId } = render(<ParetoChart data={data} />)
    const chart = getByTestId('flow-chart')
    expect(chart).toHaveTextContent('Producto A')
    expect(chart).toHaveTextContent('Producto B')
    expect(chart).toHaveTextContent('Producto C')
    expect(chart).toHaveTextContent('Producto D')
  })

  it('sorts data by value descending', () => {
    const unsorted = [
      { label: 'Z', value: 10 },
      { label: 'A', value: 90 },
    ]
    const { getByTestId } = render(<ParetoChart data={unsorted} />)
    const labels = getByTestId('flow-chart').querySelectorAll('[data-label]')
    expect(labels[0]).toHaveTextContent('A')
    expect(labels[1]).toHaveTextContent('Z')
  })

  it('renders aria label with threshold percentage', () => {
    const { getByTestId } = render(<ParetoChart data={data} threshold={0.8} />)
    expect(getByTestId('flow-chart')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('80%')
    )
  })

  it('renders with empty data without error', () => {
    const { getByTestId } = render(<ParetoChart data={[]} />)
    expect(getByTestId('flow-chart')).toBeInTheDocument()
  })
})
