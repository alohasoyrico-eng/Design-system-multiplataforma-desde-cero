import { screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSetOption = vi.fn()
const mockShowLoading = vi.fn()
const mockHideLoading = vi.fn()
const mockOn = vi.fn()
const mockDispose = vi.fn()
const mockResize = vi.fn()
const mockClear = vi.fn()
const mockIsDisposed = vi.fn(() => false)

vi.mock('echarts/core', () => ({
  use: vi.fn(),
  init: vi.fn(() => ({
    setOption: mockSetOption,
    showLoading: mockShowLoading,
    hideLoading: mockHideLoading,
    on: mockOn,
    dispose: mockDispose,
    resize: mockResize,
    clear: mockClear,
    isDisposed: mockIsDisposed,
  })),
}))

vi.mock('echarts/charts', () => ({
  BarChart: {}, LineChart: {}, PieChart: {}, ScatterChart: {},
  RadarChart: {}, GaugeChart: {}, FunnelChart: {}, TreemapChart: {},
  HeatmapChart: {}, BoxplotChart: {},
}))
vi.mock('echarts/components', () => ({
  GridComponent: {}, TooltipComponent: {}, LegendComponent: {}, VisualMapComponent: {}, MarkLineComponent: {},
}))
vi.mock('echarts/renderers', () => ({ CanvasRenderer: {} }))

import { renderWithIntl } from '../../../test-utils'
import { FlowChart } from '../FlowChart'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('FlowChart', () => {
  it('renders empty state when no data', () => {
    renderWithIntl(<FlowChart ariaLabel="Test chart" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Sin datos para este periodo')
    expect(screen.getByText('Sin datos para este periodo')).toBeInTheDocument()
  })

  it('renders custom empty label', () => {
    renderWithIntl(<FlowChart ariaLabel="Chart" emptyLabel="No hay datos" />)
    expect(screen.getByText('No hay datos')).toBeInTheDocument()
  })

  it('renders empty state icon', () => {
    const { container } = renderWithIntl(<FlowChart ariaLabel="Chart" />)
    const icon = container.querySelector('.flow-symbol')
    expect(icon).toHaveTextContent('bar_chart')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders chart container with aria-label when data is present', () => {
    renderWithIntl(
      <FlowChart
        ariaLabel="Revenue chart"
        series={[{ label: 'Revenue', values: [10, 20, 30] }]}
        labels={['Jan', 'Feb', 'Mar']}
      />
    )
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Revenue chart')
  })

  it('applies custom height', () => {
    renderWithIntl(
      <FlowChart
        ariaLabel="Chart"
        height={400}
        series={[{ label: 'A', values: [1] }]}
      />
    )
    expect(screen.getByRole('img').style.height).toBe('400px')
  })

  it('applies custom style', () => {
    renderWithIntl(
      <FlowChart
        ariaLabel="Chart"
        style={{ opacity: 0.5 }}
        series={[{ label: 'A', values: [1] }]}
      />
    )
    expect(screen.getByRole('img').style.opacity).toBe('0.5')
  })

  it('initializes echarts and calls setOption with data', async () => {
    const echarts = await import('echarts/core')
    renderWithIntl(
      <FlowChart
        ariaLabel="Chart"
        type="bar"
        series={[{ label: 'Sales', values: [10, 20] }]}
        labels={['Q1', 'Q2']}
      />
    )
    expect(echarts.init).toHaveBeenCalled()
    expect(mockSetOption).toHaveBeenCalled()
  })

  it('registers onSelect handler', async () => {
    const onSelect = vi.fn()
    renderWithIntl(
      <FlowChart
        ariaLabel="Chart"
        series={[{ label: 'A', values: [1] }]}
        onSelect={onSelect}
      />
    )
    expect(mockOn).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('shows loading state', () => {
    renderWithIntl(
      <FlowChart
        ariaLabel="Chart"
        loading
        series={[{ label: 'A', values: [1] }]}
      />
    )
    expect(mockShowLoading).toHaveBeenCalled()
  })

  it('renders with target value (gauge)', async () => {
    const echarts = await import('echarts/core')
    renderWithIntl(
      <FlowChart ariaLabel="Gauge" type="gauge" target={75} max={100} />
    )
    expect(echarts.init).toHaveBeenCalled()
    expect(mockSetOption).toHaveBeenCalled()
  })

  it('renders with matrix data (heatmap)', async () => {
    const echarts = await import('echarts/core')
    renderWithIntl(
      <FlowChart
        ariaLabel="Heatmap"
        type="heatmap"
        matrix={{ rows: ['A', 'B'], cols: ['X', 'Y'], values: [[0, 0, 5], [1, 1, 10]] }}
      />
    )
    expect(echarts.init).toHaveBeenCalled()
    expect(mockSetOption).toHaveBeenCalled()
  })
})
