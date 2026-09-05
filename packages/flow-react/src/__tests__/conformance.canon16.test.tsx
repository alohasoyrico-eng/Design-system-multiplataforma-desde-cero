/**
 * Conformance con el canon — tanda 16: la cola de adopción (F3 de eOne).
 * - dtb-1..dtb-4: DataTable, búsqueda+orden+paginación coordinados
 * - stt-6 vive en conformance.canon.test.tsx junto al resto de StatTile
 * - tb-5 vive en conformance.canon2.test.tsx junto al resto de Table
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import type { ReactNode } from 'react'
import { DataTable } from '../ui/patterns/DataTable'
import { Pagination } from '../ui/primitives/Pagination'

// Input usa useIntl: los patterns se prueban como se montan — bajo provider
const conIntl = (ui: ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

const cols = [
  { key: 'n', label: 'Nombre' },
  { key: 'v', label: 'Viajes' },
]
const filas = Array.from({ length: 25 }, (_, i) => ({
  n: i === 0 ? 'Ana' : i === 24 ? 'Zoe' : `Persona ${String(i).padStart(2, '0')}`,
  v: i,
}))

describe('DataTable · conformance canon', () => {
  // dtb-1: buscar devuelve a la primera página y el recuento se anuncia
  it('dtb-1: buscar resetea la página y anuncia el recuento en aria-live', async () => {
    const { container } = conIntl(
      <DataTable columns={cols} rows={filas} rowKey="n" caption="Personas" pageSize={10} />,
    )
    // ir a la página 3 y buscar: la vista vuelve al principio
    await userEvent.click(screen.getByRole('button', { name: '3' }))
    expect(screen.getByText('Zoe')).toBeInTheDocument()
    await userEvent.type(screen.getByRole('searchbox'), 'Persona')
    expect(screen.getByText('Persona 01')).toBeInTheDocument()
    expect(screen.queryByText('Zoe')).toBeNull()
    const live = container.querySelector('[aria-live="polite"]')!
    expect(live.textContent).toMatch(/23/)
  })

  // dtb-2: el orden se aplica al conjunto filtrado completo, no a la página
  it('dtb-2: ordenar descendente trae la última fila del conjunto, no de la página', async () => {
    conIntl(<DataTable columns={cols} rows={filas} rowKey="n" caption="Personas" pageSize={10} />)
    const header = screen.getByRole('button', { name: 'Viajes' })
    await userEvent.click(header) // asc
    await userEvent.click(header) // desc
    // Zoe (v=24) vive en la última página del orden natural; con desc encabeza la primera
    expect(screen.getByText('Zoe')).toBeInTheDocument()
    expect(screen.queryByText('Ana')).toBeNull()
  })

  // dtb-3: la caja es type=search con nombre accesible y no roba el foco
  it('dtb-3: el searchbox tiene nombre propio y no captura el foco al montar', () => {
    conIntl(<DataTable columns={cols} rows={filas} rowKey="n" caption="Personas" />)
    const caja = screen.getByRole('searchbox', { name: /Personas/ })
    expect(caja).toBeInTheDocument()
    expect(caja).not.toHaveFocus()
  })

  // pag-6: el rango se dice en texto y cambiar el tamaño vuelve a la primera
  it('pag-6: rango «X–Y de Z» y reset al cambiar pageSize', async () => {
    const onChange = vi.fn()
    const onPageSizeChange = vi.fn()
    conIntl(
      <Pagination
        page={2}
        pages={7}
        total={63}
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        onChange={onChange}
        onPageSizeChange={onPageSizeChange}
      />,
    )
    expect(screen.getByText('11–20 de 63')).toBeInTheDocument()
    // el selector existe con nombre accesible
    const selector = screen.getByRole('combobox', { name: /Por página/ })
    await userEvent.click(selector)
    await userEvent.click(screen.getByRole('option', { name: '25' }))
    expect(onPageSizeChange).toHaveBeenCalledWith(25)
    expect(onChange).toHaveBeenCalledWith(1)
  })

  // dtb-4: sin resultados hay estado vacío con la consulta y salida
  it('dtb-4: sin resultados repite la consulta y ofrece limpiar', async () => {
    conIntl(<DataTable columns={cols} rows={filas} rowKey="n" caption="Personas" />)
    await userEvent.type(screen.getByRole('searchbox'), 'xyzzy')
    expect(screen.getByText(/xyzzy/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Limpiar/ }))
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })
})
