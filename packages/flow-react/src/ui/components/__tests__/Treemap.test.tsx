import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Treemap } from '../Treemap'

/* FlowChart is a wrapper around ECharts, so we mock it to test the data transformation */
vi.mock('../../primitives/FlowChart', () => ({
  FlowChart: (props: Record<string, unknown>) => (
    <div data-testid="flow-chart" data-type={props.type} aria-label={props.ariaLabel as string}>
      {JSON.stringify(props.series)}
    </div>
  ),
}))

const nodes = [
  { label: 'CDMX', value: 500, deviation: 0.15 },
  { label: 'GDL', value: 300, deviation: -0.05 },
  { label: 'MTY', value: 200 },
]

describe('Treemap', () => {
  it('renders FlowChart with treemap type', () => {
    const { getByTestId } = render(<Treemap nodes={nodes} />)
    expect(getByTestId('flow-chart')).toHaveAttribute('data-type', 'treemap')
  })

  it('passes node labels to chart series', () => {
    const { getByTestId } = render(<Treemap nodes={nodes} />)
    const content = getByTestId('flow-chart').textContent!
    expect(content).toContain('CDMX')
    expect(content).toContain('GDL')
    expect(content).toContain('MTY')
  })

  it('passes node values to chart series', () => {
    const { getByTestId } = render(<Treemap nodes={nodes} />)
    const content = getByTestId('flow-chart').textContent!
    expect(content).toContain('500')
    expect(content).toContain('300')
    expect(content).toContain('200')
  })

  it('sets aria-label on chart', () => {
    const { getByTestId } = render(<Treemap nodes={nodes} />)
    expect(getByTestId('flow-chart')).toHaveAttribute(
      'aria-label',
      'Gasto por región, tamaño por valor y color por desvío vs presupuesto',
    )
  })
})
