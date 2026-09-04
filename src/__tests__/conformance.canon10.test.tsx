/**
 * Conformance con el canon — tanda 10 (familia viz, parte 2).
 * Cada test cita el id del criterio automatizado del contrato canonico.
 * Items: smallmultiples, chart-gantt, chart-kanban.
 * gnt-2 queda fuera anotado: GanttTask no declara dependencias en el repo,
 * asi que no hay grafo que pueda ser circular — divergencia de API.
 */
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import type { ReactNode } from 'react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { SmallMultiples } from '../ui/components/SmallMultiples'
import { GanttChart } from '../ui/components/GanttChart'
import { KanbanBoard } from '../ui/components/KanbanBoard'

const uiDe = (rel: string) => readFileSync(join(__dirname, '..', 'ui', rel), 'utf8')
const conIntl = (ui: ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

// ── smallmultiples ─────────────────────────────────────────────────────────
const celdas = [
  { id: 'u1', label: 'Unidad 42', values: [10, 40, 20] },
  { id: 'u2', label: 'Unidad 43', values: [100, 400, 200] },
]

describe('conformance canon · smallmultiples', () => {
  it('smm-v1: sin datos muestra estado vacio con texto', () => {
    render(<SmallMultiples items={[]} />)
    expect(screen.getByText('Sin datos para este periodo')).toBeInTheDocument()
  })

  it('smm-1: todas las celdas comparten la misma escala Y y eso se declara en la interfaz', () => {
    const { container } = render(<SmallMultiples items={celdas} height={46} />)
    const lineas = container.querySelectorAll('polyline')
    // el maximo global (400) toca el techo; el maximo local de u1 (40) queda abajo
    const ysDe = (pl: Element) => pl.getAttribute('points')!.split(' ').map((p) => parseFloat(p.split(',')[1]))
    expect(Math.min(...ysDe(lineas[1]))).toBeLessThan(Math.min(...ysDe(lineas[0])))
    expect(uiDe('components/SmallMultiples.tsx')).toMatch(/misma escala Y/)
  })

  it('smm-2: una entidad sin valores o con una sola muestra no rompe la escala de las demas', () => {
    const { container } = render(
      <SmallMultiples items={[...celdas, { id: 'u3', label: 'Nueva', values: [50] }, { id: 'u4', label: 'Vacia', values: [] }]} />,
    )
    for (const pl of container.querySelectorAll('polyline')) {
      expect(pl.getAttribute('points')).not.toMatch(/NaN|Infinity/)
    }
    // la celda vacia no dibuja linea; las demas siguen ahi
    expect(container.querySelectorAll('polyline')).toHaveLength(3)
  })

  it('smm-3: con onSelect cada celda es operable por teclado y su nombre incluye la entidad', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<SmallMultiples items={celdas} onSelect={onSelect} />)
    const celda = screen.getByRole('button', { name: /Unidad 42/ })
    celda.focus()
    await user.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith(celdas[0])
  })

  it('smm-v3: el color sale de la paleta de dataviz y el outlier usa negativo', () => {
    const { container } = render(
      <SmallMultiples items={celdas} isOutlier={(it) => it.id === 'u2'} />,
    )
    const lineas = container.querySelectorAll('polyline')
    expect(lineas[0].getAttribute('stroke')).toBe('var(--viz-neutral)')
    expect(lineas[1].getAttribute('stroke')).toBe('var(--viz-negative)')
  })

  it('smm-4: la celda dibuja su propia carcasa — infraccion R3 declarada en el contrato', () => {
    expect(uiDe('components/SmallMultiples.tsx')).not.toMatch(/from '\.\.\/primitives\/ControlShell'/)
  })
})

// ── chart-gantt ────────────────────────────────────────────────────────────
describe('conformance canon · chart-gantt', () => {
  it('gnt-v1: sin datos muestra estado vacio con texto', () => {
    render(<GanttChart tasks={[]} />)
    expect(screen.getByText('Sin datos para este periodo')).toBeInTheDocument()
  })

  it('gnt-v2: una sola tarea o fechas iguales no dividen por cero', () => {
    const { container } = render(
      <GanttChart tasks={[{ id: 't1', name: 'Unica', start: '2026-09-01', end: '2026-09-01' }]} />,
    )
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/)
  })

  it('gnt-3: una tarea de duracion cero se dibuja como hito, no como barra invisible', () => {
    const { container } = render(
      <GanttChart tasks={[
        { id: 't1', name: 'Barra', start: '2026-09-01', end: '2026-09-05' },
        { id: 't2', name: 'Hito', start: '2026-09-03', end: '2026-09-03' },
      ]} />,
    )
    const hito = container.querySelector('[data-milestone]') as HTMLElement
    expect(hito).not.toBeNull()
    expect(hito.style.width).toBe('')
  })

  it('gnt-4: una tarea sin name lleva marcador de posicion visible', () => {
    render(<GanttChart tasks={[{ id: 't1', name: '', start: '2026-09-01', end: '2026-09-05' }]} />)
    expect(screen.getByText('(sin nombre)')).toBeInTheDocument()
  })

  it('gnt-v3: el color sale de la paleta de dataviz', () => {
    const { container } = render(
      <GanttChart tasks={[{ id: 't1', name: 'A', start: '2026-09-01', end: '2026-09-05' }]} />,
    )
    const barra = container.querySelector('[class*="bar"]') as HTMLElement
    expect(barra.getAttribute('style')).toContain('var(--viz-1)')
  })
})

// ── chart-kanban ───────────────────────────────────────────────────────────
const columnas = [
  { id: 'prospecto', label: 'Prospecto', limit: 5 },
  { id: 'activo', label: 'Activo' },
]
const tarjetas = [
  { id: 'c1', columnId: 'prospecto', title: 'Rutas Cobalto' },
  { id: 'c2', columnId: 'prospecto', title: 'Flota Andina' },
  { id: 'c3', columnId: 'activo', title: 'Transportes Sur' },
]
const pintaTarjeta = (it: { title: string }) => <span>{it.title}</span>

describe('conformance canon · chart-kanban', () => {
  it('kb-2: la tarjeta es enfocable y anuncia su columna y posicion', () => {
    conIntl(<KanbanBoard columns={columnas} items={tarjetas} renderCard={pintaTarjeta} />)
    const tarjeta = screen.getByRole('button', { name: /Rutas Cobalto.*columna Prospecto, 1 de 2/ })
    expect(tarjeta.getAttribute('tabindex')).toBe('0')
  })

  it('kb-3: la columna anuncia su cuenta y su limite si lo tiene', () => {
    conIntl(<KanbanBoard columns={columnas} items={tarjetas} renderCard={pintaTarjeta} />)
    expect(screen.getByRole('group', { name: 'Prospecto, 2 tarjetas, limite 5' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Activo, 1 tarjeta' })).toBeInTheDocument()
  })

  it('kb-1: el arrastre tiene equivalente por teclado: Shift+flecha mueve y se anuncia', () => {
    const onMove = vi.fn()
    const { container } = conIntl(
      <KanbanBoard columns={columnas} items={tarjetas} renderCard={pintaTarjeta} onMove={onMove} />,
    )
    const tarjeta = screen.getByRole('button', { name: /Rutas Cobalto/ })
    fireEvent.keyDown(tarjeta, { key: 'ArrowRight', shiftKey: true })
    expect(onMove).toHaveBeenCalledWith('c1', 'activo')
    expect(container.querySelector('[role="status"]')!.textContent).toContain('Movida a Activo')
  })

  it('kb-6: el panel de detalle hereda OverlayShell: dialogo modal que devuelve el foco', async () => {
    const user = userEvent.setup()
    conIntl(
      <KanbanBoard
        columns={columnas}
        items={tarjetas}
        renderCard={pintaTarjeta}
        renderDetail={(it: { title: string }) => <p>Detalle de {it.title}</p>}
      />,
    )
    const tarjeta = screen.getByRole('button', { name: /Rutas Cobalto/ })
    await user.click(tarjeta)
    const dialogo = screen.getByRole('dialog')
    expect(dialogo).toHaveTextContent('Detalle de Rutas Cobalto')
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(tarjeta)
  })

  it('kb-9: renderColumnHeader no puede romper la lectura: el nombre accesible vive en la seccion', () => {
    conIntl(
      <KanbanBoard
        columns={columnas}
        items={tarjetas}
        renderCard={pintaTarjeta}
        renderColumnHeader={() => <div>🎨</div>}
      />,
    )
    expect(screen.getByRole('group', { name: 'Prospecto, 2 tarjetas, limite 5' })).toBeInTheDocument()
  })
})
