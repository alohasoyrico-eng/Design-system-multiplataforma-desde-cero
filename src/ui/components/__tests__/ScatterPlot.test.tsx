import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { ScatterPlot } from '../ScatterPlot'

// Mock FlowChart since ECharts requires a real canvas context
vi.mock('../../primitives/FlowChart', () => ({
  FlowChart: (props: Record<string, unknown>) => {
    const option = props.option as Record<string, Record<string, string>> | undefined
    return (
      <div data-testid="flow-chart" data-type={props.type as string} aria-label={props.ariaLabel as string}>
        {option?.xAxis?.name && <span data-x-label>{option.xAxis.name}</span>}
        {option?.yAxis?.name && <span data-y-label>{option.yAxis.name}</span>}
      </div>
    )
  },
}))

const points = [
  { id: 'a', x: 10, y: 20, label: 'Alpha' },
  { id: 'b', x: 30, y: 40, label: 'Beta' },
  { id: 'c', x: 50, y: 60, label: 'Gamma' },
]

describe('ScatterPlot', () => {
  it('renders FlowChart with type scatter', () => {
    const { getByTestId } = renderWithIntl(<ScatterPlot points={points} />)
    expect(getByTestId('flow-chart')).toHaveAttribute('data-type', 'scatter')
  })

  it('renders x-axis label', () => {
    const { getByTestId } = renderWithIntl(<ScatterPlot points={points} xLabel="Peso (kg)" />)
    const xLabel = getByTestId('flow-chart').querySelector('[data-x-label]')
    expect(xLabel).toHaveTextContent('Peso (kg)')
  })

  it('renders y-axis label', () => {
    const { getByTestId } = renderWithIntl(<ScatterPlot points={points} yLabel="Altura (cm)" />)
    const yLabel = getByTestId('flow-chart').querySelector('[data-y-label]')
    expect(yLabel).toHaveTextContent('Altura (cm)')
  })

  it('includes point count in aria label', () => {
    const { getByTestId } = renderWithIntl(<ScatterPlot points={points} xLabel="X" yLabel="Y" />)
    expect(getByTestId('flow-chart')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('3 unidades')
    )
  })

  it('renders with empty points without error', () => {
    const { getByTestId } = renderWithIntl(<ScatterPlot points={[]} />)
    expect(getByTestId('flow-chart')).toBeInTheDocument()
  })
})
