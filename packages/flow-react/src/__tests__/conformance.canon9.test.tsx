/**
 * Conformance con el canon — tanda 9 (familia viz, parte 1).
 * Cada test cita el id del criterio automatizado del contrato canonico.
 * Items: sparkline, bars, donut, scatter, pareto, treemap, bullet.
 * FlowChart va aqui como stub que captura props: lo que el componente le
 * entrega ES su contrato; el interior de ECharts se mide aparte (canon9b).
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import type { ReactNode } from 'react'

const propsCapturadas: Record<string, unknown>[] = []
vi.mock('../ui/primitives/FlowChart', () => ({
  FlowChart: (props: Record<string, unknown>) => {
    propsCapturadas.push(props)
    return <div data-testid="flowchart" />
  },
}))

import { Sparkline } from '../ui/primitives/Sparkline'
import { Bars } from '../ui/components/Bars'
import { Donut } from '../ui/components/Donut'
import { ScatterPlot } from '../ui/components/ScatterPlot'
import { ParetoChart } from '../ui/components/ParetoChart'
import { Treemap } from '../ui/components/Treemap'
import { BulletChart } from '../ui/components/BulletChart'

const conIntl = (ui: ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)
const ultima = () => propsCapturadas[propsCapturadas.length - 1]

// ── sparkline ──────────────────────────────────────────────────────────────
describe('conformance canon · sparkline', () => {
  it('spk-1: un solo valor da linea plana; cero valores no dibuja nada', () => {
    const { container, rerender } = render(<Sparkline values={[]} />)
    expect(container.firstChild).toBeNull()
    rerender(<Sparkline values={[42]} width={120} height={40} />)
    const puntos = container.querySelector('polyline')!.getAttribute('points')!
    expect(puntos).not.toMatch(/NaN/)
    const ys = new Set(puntos.split(' ').map((p) => p.split(',')[1]))
    expect(ys.size).toBe(1)
  })

  it('spk-2: todos los valores iguales dan una linea centrada, no una division por cero', () => {
    const { container } = render(<Sparkline values={[7, 7, 7, 7]} height={40} />)
    const puntos = container.querySelector('polyline')!.getAttribute('points')!
    expect(puntos).not.toMatch(/NaN|Infinity/)
    for (const p of puntos.split(' ')) expect(parseFloat(p.split(',')[1])).toBe(20)
  })

  it('spk-3: esta oculta al lector de pantalla: la cifra la dice el KPI que la contiene', () => {
    const { container } = render(<Sparkline values={[1, 2, 3]} />)
    expect(container.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true')
  })

  it('spk-4: el color sale de la paleta de dataviz, no de la de texto', () => {
    const { container } = render(<Sparkline values={[1, 2, 3]} />)
    expect(container.querySelector('polyline')!.getAttribute('stroke')).toBe('var(--viz-1)')
  })

  it('spk-5: el punto final no late: no hay animacion que apagar', () => {
    const { container } = render(<Sparkline values={[1, 2, 3]} showDot />)
    const punto = container.querySelector('circle')!
    expect(punto.getAttribute('class')).toBeNull()
    expect(container.innerHTML).not.toMatch(/animation/)
  })
})

// ── bars ───────────────────────────────────────────────────────────────────
describe('conformance canon · bars', () => {
  it('brs-v1: sin datos no dibuja rejilla vacia: muestra estado vacio con texto', () => {
    render(<Bars data={[]} />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('brs-v2: un solo dato o todos iguales no dividen por cero', () => {
    const { container } = render(<Bars data={[{ label: 'a', value: 5 }]} />)
    for (const bar of container.querySelectorAll('[class*="bar"]')) {
      expect((bar as HTMLElement).style.height).not.toMatch(/NaN|Infinity/)
    }
  })

  it('brs-v3: el color sale de la paleta de dataviz', () => {
    const { container } = render(<Bars data={[{ label: 'a', value: 5 }, { label: 'b', value: 3 }]} />)
    const barra = container.querySelector('[class*="bar"]') as HTMLElement
    expect(barra.style.background).toContain('var(--viz-1)')
  })

  it('brs-1: con highlightMax exactamente una barra va en acento; con empate, ninguna', () => {
    const { container, rerender } = render(
      <Bars highlightMax data={[{ label: 'a', value: 5 }, { label: 'b', value: 9 }, { label: 'c', value: 3 }]} />,
    )
    expect(container.querySelectorAll('[data-max]')).toHaveLength(1)
    rerender(
      <Bars highlightMax data={[{ label: 'a', value: 9 }, { label: 'b', value: 9 }, { label: 'c', value: 3 }]} />,
    )
    expect(container.querySelectorAll('[data-max]')).toHaveLength(0)
  })
})

// ── donut ──────────────────────────────────────────────────────────────────
describe('conformance canon · donut', () => {
  it('dnt-v1: sin datos muestra estado vacio con texto, no un lienzo', () => {
    render(<Donut segments={[]} />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
    expect(screen.queryByTestId('flowchart')).not.toBeInTheDocument()
  })

  it('dnt-v2: un solo dato no divide por cero: la leyenda dice 100%', () => {
    render(<Donut segments={[{ label: 'Combustible', value: 1200 }]} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('dnt-v3: el color sale de la paleta de dataviz', () => {
    render(<Donut segments={[{ label: 'a', value: 1 }, { label: 'b', value: 2 }]} />)
    const serie = (ultima().series as { data: { color: string }[] }[])[0]
    for (const seg of serie.data) expect(seg.color).toMatch(/^var\(--viz-/)
  })
})

// ── scatter ────────────────────────────────────────────────────────────────
describe('conformance canon · scatter', () => {
  it('sct-v1: sin datos muestra estado vacio con texto', () => {
    conIntl(<ScatterPlot points={[]} />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('sct-v2: un solo dato no deja la escala en Infinity: los valores llegan finitos', () => {
    conIntl(<ScatterPlot points={[{ id: 'u1', x: 4, y: 9 }]} xLabel="Costo" yLabel="Km" />)
    const serie = (ultima().series as { values: unknown[][] }[])[0]
    expect(serie.values).toHaveLength(1)
    expect(Number.isFinite(serie.values[0][0])).toBe(true)
  })

  it('sct-1: los dos ejes llevan nombre con unidad', () => {
    conIntl(<ScatterPlot points={[{ id: 'u1', x: 4, y: 9 }]} xLabel="Costo (MXN)" yLabel="Recorrido (km)" />)
    const opcion = ultima().option as { xAxis: { name: string }; yAxis: { name: string } }
    expect(opcion.xAxis.name).toBe('Costo (MXN)')
    expect(opcion.yAxis.name).toBe('Recorrido (km)')
  })

  it('sct-v3: el color de series y umbrales sale de la paleta de dataviz', () => {
    conIntl(<ScatterPlot points={[{ id: 'u1', x: 4, y: 9 }]} xThreshold={5} />)
    expect(JSON.stringify(ultima().series)).toContain('var(--viz-axis)')
  })
})

// ── pareto ─────────────────────────────────────────────────────────────────
describe('conformance canon · pareto', () => {
  const desordenado = [
    { label: 'Peajes', value: 200 },
    { label: 'Combustible', value: 900 },
    { label: 'Servicio', value: 500 },
  ]

  it('prt-v1: sin datos muestra estado vacio con texto', () => {
    render(<ParetoChart data={[]} />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('prt-1: ordena de mayor a menor por su cuenta', () => {
    render(<ParetoChart data={desordenado} />)
    expect(ultima().labels).toEqual(['Combustible', 'Servicio', 'Peajes'])
    expect((ultima().series as { values: number[] }[])[0].values).toEqual([900, 500, 200])
  })

  it('prt-v3: acento solo hasta el umbral; el resto en neutral de dataviz', () => {
    render(<ParetoChart data={desordenado} threshold={0.8} />)
    const colores = ultima().itemColors as string[]
    expect(colores.every((c) => c === 'var(--viz-accent)' || c === 'var(--viz-neutral)')).toBe(true)
    expect(colores[0]).toBe('var(--viz-accent)')
  })

  it('prt-v2: un solo dato no divide por cero', () => {
    render(<ParetoChart data={[{ label: 'Unica', value: 100 }]} />)
    expect((ultima().itemColors as string[]).length).toBe(1)
  })
})

// ── treemap ────────────────────────────────────────────────────────────────
describe('conformance canon · treemap', () => {
  it('tmp-v1: sin datos muestra estado vacio con texto', () => {
    render(<Treemap nodes={[]} />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('tmp-v2: un solo nodo no rompe la escala: llega como dato unico y finito', () => {
    render(<Treemap nodes={[{ label: 'Norte', value: 100 }]} />)
    const serie = (ultima().series as { data: { value: number }[] }[])[0]
    expect(serie.data).toHaveLength(1)
    expect(Number.isFinite(serie.data[0].value)).toBe(true)
  })

  it('tmp-v3: el color sale de la paleta de dataviz; el desvio usa positivo/negativo', () => {
    render(<Treemap nodes={[{ label: 'a', value: 1 }, { label: 'b', value: 2, deviation: 0.2 }]} />)
    const serie = (ultima().series as { data: { color: string }[] }[])[0]
    expect(serie.data[0].color).toMatch(/^var\(--viz-/)
    expect(serie.data[1].color).toBe('var(--viz-negative)')
  })
})

// ── bullet ─────────────────────────────────────────────────────────────────
describe('conformance canon · bullet', () => {
  it('blt-v1: sin datos muestra estado vacio con texto', () => {
    conIntl(<BulletChart rows={[]} />)
    expect(screen.getByText('Sin datos para este periodo')).toBeInTheDocument()
  })

  it('blt-v2: un solo dato o todos iguales no dividen por cero', () => {
    const { container } = conIntl(<BulletChart rows={[{ label: 'Norte', value: 0, target: 0 }]} />)
    for (const barra of container.querySelectorAll('[class*="bar"], [class*="target"]')) {
      const st = (barra as HTMLElement).getAttribute('style') || ''
      expect(st).not.toMatch(/NaN|Infinity/)
    }
  })

  it('blt-3: un valor que supera el maximo no se sale del carril y se senala', () => {
    const { container } = conIntl(
      <BulletChart rows={[{ label: 'Norte', value: 150, target: 90, max: 100 }]} />,
    )
    const barra = container.querySelector('[data-over]') as HTMLElement
    expect(barra).not.toBeNull()
    expect(parseFloat(barra.style.width)).toBeLessThanOrEqual(100)
  })

  it('blt-v3: el color sale de la paleta de dataviz', () => {
    const { container } = conIntl(<BulletChart rows={[{ label: 'N', value: 10, target: 90 }]} />)
    const barra = container.querySelector('[class*="bar"]') as HTMLElement
    expect(barra.getAttribute('style')).toContain('var(--viz-1)')
  })
})
