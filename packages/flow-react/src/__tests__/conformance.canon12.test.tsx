/**
 * Conformance con el canon — fc-5: si la libreria no carga, FlowChart
 * degrada a mensaje; nunca a un hueco. Este archivo vive solo: su mock de
 * echarts/core revienta el import dinamico para simular la carga fallida
 * (CDN caido, chunk bloqueado por CSP, red corporativa).
 */
import { screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('echarts/core', () => {
  throw new Error('chunk perdido')
})

import { renderWithIntl } from '../test-utils'
import { FlowChart } from '../ui/primitives/FlowChart'

describe('conformance canon · flow-chart (carga fallida)', () => {
  it('fc-5: si la libreria no carga, degrada a mensaje; nunca a un hueco', async () => {
    renderWithIntl(
      <FlowChart
        series={[{ label: 'Ingresos', values: [10, 20, 30] }]}
        labels={['a', 'b', 'c']}
        ariaLabel="Ingresos"
      />,
    )
    await waitFor(() => {
      expect(screen.getByText(/La gráfica no pudo cargarse/)).toBeInTheDocument()
    })
    expect(screen.getByRole('img', { name: /no pudo cargarse/ })).toBeInTheDocument()
  })

  it('fc-5: sin datos el estado vacio gana — no intenta cargar nada', () => {
    renderWithIntl(<FlowChart ariaLabel="Vacia" />)
    expect(screen.getByText('Sin datos para este periodo')).toBeInTheDocument()
  })
})
