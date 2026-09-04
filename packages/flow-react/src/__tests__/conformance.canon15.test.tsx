/**
 * Conformance con el canon — tanda 15: el cierre al 100%.
 * Los ultimos criterios, todos features nuevas del 4-sep:
 * - mc-2: pines del mapa como botones reales (inertes al puntero)
 * - sct-3 / tmp-3: listbox paralelo al lienzo de ECharts
 * - od-3: el onboarding del conductor gana el paso de documentos (FileUpload,
 *   cuya zona es boton por upl-1: subir sin arrastrar)
 * - it-6 lo vigila scripts/check-targets.mjs, que ahora tambien mide
 *   src/layout y src/pages/internal-tools.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// jsdom no trae ResizeObserver (MapCanvas lo usa para su lienzo)
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', MockResizeObserver)

const propsCapturadas: Record<string, unknown>[] = []
vi.mock('../ui/primitives/FlowChart', () => ({
  FlowChart: (props: Record<string, unknown>) => {
    propsCapturadas.push(props)
    return <div data-testid="flowchart" />
  },
}))

import { QuickAction } from '../ui/components/QuickAction'
import { ScatterPlot } from '../ui/components/ScatterPlot'
import { Treemap } from '../ui/components/Treemap'
import { MapCanvas } from '../ui/components/MapCanvas'
import { IntlProvider } from 'react-intl'

const ultima = () => propsCapturadas[propsCapturadas.length - 1]

// ── map-canvas ─────────────────────────────────────────────────────────────
describe('conformance canon · map-canvas (teclado)', () => {
  const pines = [
    { id: 'u1', lat: 19.4326, lon: -99.1332, label: 'Unidad 42', subtitle: '$1,240 hoy' },
    { id: 'u2', lat: 19.44, lon: -99.14, label: 'Unidad 43', subtitle: '$890 hoy' },
  ]

  it('mc-2: cada pin es enfocable por teclado y trae ariaLabel con lugar y valor', () => {
    const onPinClick = vi.fn()
    render(<MapCanvas center={[19.4326, -99.1332]} pins={pines} onPinClick={onPinClick} />)
    const pin = screen.getByRole('button', { name: 'Unidad 42, $1,240 hoy' })
    expect(pin).toBeInTheDocument()
    pin.focus()
    expect(document.activeElement).toBe(pin)
    fireEvent.click(pin)
    expect(onPinClick).toHaveBeenCalledWith('u1')
    // inerte al puntero: el raton sigue siendo del canvas (pan y hit-test)
    const hoja = readFileSync(join(__dirname, '..', 'ui', 'components', 'MapCanvas.module.css'), 'utf8')
    expect(hoja).toMatch(/\.pinTarget\s*\{[^}]*pointer-events:\s*none/)
    expect(hoja).toMatch(/\.pinTarget\s*\{[^}]*width:\s*var\(--hit-target-min\)/)
  })
})

// ── scatter (teclado) ──────────────────────────────────────────────────────
describe('conformance canon · scatter (teclado)', () => {
  const puntos = [
    { id: 'a', x: 1, y: 10, label: 'Norte' },
    { id: 'b', x: 2, y: 20, label: 'Sur' },
    { id: 'c', x: 3, y: 30, label: 'Centro' },
  ]

  it('sct-3: la seleccion se alcanza por teclado y el seleccionado se distingue por forma y tamano', () => {
    const onSelect = vi.fn()
    render(
      <IntlProvider locale="es">
        <ScatterPlot points={puntos} selectedId="b" onSelect={onSelect} xLabel="Costo" yLabel="Km" />
      </IntlProvider>,
    )
    // forma y tamano, no solo color: el seleccionado viaja como diamante mayor
    const valores = (ultima().series as { values: unknown[] }[])[0].values
    const seleccionado = valores.find((v) => typeof v === 'object' && !Array.isArray(v)) as { symbol: string; symbolSize: number }
    expect(seleccionado.symbol).toBe('diamond')
    expect(seleccionado.symbolSize).toBeGreaterThan(10)

    // teclado: un solo tab stop, flechas recorren, Enter selecciona
    const lista = screen.getByRole('listbox', { name: /Puntos/ })
    lista.focus()
    fireEvent.keyDown(lista, { key: 'ArrowDown' })
    fireEvent.keyDown(lista, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith(puntos[1])
    const activo = lista.getAttribute('aria-activedescendant')!
    expect(document.getElementById(activo)!.textContent).toContain('Sur')
  })
})

// ── treemap (teclado) ──────────────────────────────────────────────────────
describe('conformance canon · treemap (teclado)', () => {
  const nodos = [
    { label: 'Norte', value: 900 },
    { label: 'Sur', value: 500 },
  ]

  it('tmp-3: con onDrill los nodos son operables por teclado, no solo por clic', () => {
    const onDrill = vi.fn()
    render(<Treemap nodes={nodos} onDrill={onDrill} />)
    const lista = screen.getByRole('listbox', { name: 'Regiones del treemap' })
    lista.focus()
    fireEvent.keyDown(lista, { key: 'ArrowDown' })
    fireEvent.keyDown(lista, { key: 'Enter' })
    expect(onDrill).toHaveBeenCalledWith(nodos[1])
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })
})

// ── quick-action ───────────────────────────────────────────────────────────
describe('conformance canon · quick-action (etiqueta)', () => {
  it('qa-2: la etiqueta es siempre visible y obligatoria — sin ella seria un IconButton', () => {
    render(<QuickAction icon="add" label="Nueva unidad" />)
    const etiqueta = screen.getByText('Nueva unidad')
    expect(etiqueta).toBeVisible()
    expect(etiqueta.getAttribute('aria-hidden')).toBeNull()
    const src = readFileSync(join(__dirname, '..', 'ui', 'components', 'QuickAction.tsx'), 'utf8')
    expect(src).toMatch(/label: string\n/)
  })
})
