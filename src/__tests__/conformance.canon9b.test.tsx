/**
 * Conformance con el canon — tanda 9b (interior de FlowChart, ECharts mockeado).
 * prt-2 vive en el case 'pareto' de FlowChart; fc-4 y fc-7 en su ciclo de vida.
 * fc-5 vive en conformance.canon12: la carga perezosa que degrada a mensaje
 * se prueba con un mock que revienta el import dinamico.
 */
import { waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSetOption = vi.fn()
const mockInit = vi.fn(() => ({
  setOption: mockSetOption,
  showLoading: vi.fn(),
  hideLoading: vi.fn(),
  on: vi.fn(),
  dispose: vi.fn(),
  resize: vi.fn(),
  clear: vi.fn(),
  isDisposed: vi.fn(() => false),
}))

vi.mock('echarts/core', () => ({ use: vi.fn(), init: (...a: unknown[]) => mockInit(...a as []) }))
vi.mock('echarts/charts', () => ({
  BarChart: {}, LineChart: {}, PieChart: {}, ScatterChart: {},
  RadarChart: {}, GaugeChart: {}, FunnelChart: {}, TreemapChart: {},
  HeatmapChart: {}, BoxplotChart: {},
}))
vi.mock('echarts/components', () => ({
  GridComponent: {}, TooltipComponent: {}, LegendComponent: {}, VisualMapComponent: {},
}))
vi.mock('echarts/renderers', () => ({ CanvasRenderer: {} }))

import { renderWithIntl } from '../test-utils'
import { FlowChart } from '../ui/primitives/FlowChart'

beforeEach(() => {
  vi.clearAllMocks()
  document.documentElement.removeAttribute('data-mode')
})

const opcionEmitida = () => mockSetOption.mock.calls[mockSetOption.mock.calls.length - 1][0]

describe('conformance canon · flow-chart y pareto (interior)', () => {
  it('prt-2: la linea de acumulado llega exactamente al 100% en el ultimo punto', async () => {
    renderWithIntl(
      <FlowChart
        type="pareto"
        labels={['a', 'b', 'c']}
        series={[{ label: 'Valor', values: [900, 500, 200.5] }]}
        ariaLabel="Pareto"
      />,
    )
    await waitFor(() => expect(mockSetOption).toHaveBeenCalled())
    const series = opcionEmitida().series as { name: string; data: number[] }[]
    const acumulado = series.find((s) => s.name === 'Acumulado')!
    expect(acumulado.data[acumulado.data.length - 1]).toBe(100)
  })

  it('fc-4: repinta al cambiar data-mode sin remontar', async () => {
    renderWithIntl(
      <FlowChart series={[{ label: 'V', values: [1, 2, 3] }]} labels={['a', 'b', 'c']} ariaLabel="Linea" />,
    )
    await waitFor(() => expect(mockSetOption).toHaveBeenCalled())
    const antes = mockSetOption.mock.calls.length
    const inits = mockInit.mock.calls.length
    document.documentElement.setAttribute('data-mode', 'dark')
    await waitFor(() => expect(mockSetOption.mock.calls.length).toBeGreaterThan(antes))
    expect(mockInit.mock.calls.length).toBe(inits)
  })

  it('fc-7: prefers-reduced-motion desactiva la animacion de entrada', async () => {
    const matchMedia = vi.fn((q: string) => ({
      matches: q.includes('prefers-reduced-motion'),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    vi.stubGlobal('matchMedia', matchMedia)
    renderWithIntl(
      <FlowChart series={[{ label: 'V', values: [1, 2, 3] }]} labels={['a', 'b', 'c']} ariaLabel="Linea" />,
    )
    await waitFor(() => expect(mockSetOption).toHaveBeenCalled())
    expect(JSON.stringify(opcionEmitida())).toContain('"animation":false')
    vi.unstubAllGlobals()
  })
})
