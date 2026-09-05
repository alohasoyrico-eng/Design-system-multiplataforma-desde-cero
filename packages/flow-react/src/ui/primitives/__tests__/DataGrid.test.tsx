import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DataGrid } from '../DataGrid'

const fuente = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8')

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'age', label: 'Edad', align: 'right' as const },
]

const rows = [
  { id: '1', name: 'Ana', age: 30 },
  { id: '2', name: 'Luis', age: 25 },
  { id: '3', name: 'Maria', age: 35 },
]

describe('DataGrid', () => {
  it('renders a table with column headers', () => {
    render(<DataGrid columns={columns} rows={rows} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Edad')).toBeInTheDocument()
  })

  it('renders row data', () => {
    render(<DataGrid columns={columns} rows={rows} />)
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('calls onRowClick when a row is clicked', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<DataGrid columns={columns} rows={rows} onRowClick={onRowClick} />)
    await user.click(screen.getByText('Luis'))
    expect(onRowClick).toHaveBeenCalledWith(rows[1])
  })

  it('marks selected row with data-selected', () => {
    const { container } = render(
      <DataGrid columns={columns} rows={rows} rowKey="id" selectedKey="2" />,
    )
    const selectedRow = container.querySelector('[data-selected]')
    expect(selectedRow).toBeInTheDocument()
    expect(selectedRow).toHaveTextContent('Luis')
  })

  it('sets density data attribute when compact', () => {
    const { container } = render(
      <DataGrid columns={columns} rows={rows} density="compact" />,
    )
    expect(container.firstChild).toHaveAttribute('data-density', 'compact')
  })

  it('does not set density attribute for default', () => {
    const { container } = render(
      <DataGrid columns={columns} rows={rows} />,
    )
    expect(container.firstChild).not.toHaveAttribute('data-density')
  })

  it('sorts by column when header is clicked', async () => {
    const user = userEvent.setup()
    render(<DataGrid columns={columns} rows={rows} sortable />)
    await user.click(screen.getByText('Nombre'))
    const cells = screen.getAllByRole('cell')
    const nameCells = cells.filter((_, i) => i % 2 === 0)
    expect(nameCells[0]).toHaveTextContent('Ana')
    expect(nameCells[1]).toHaveTextContent('Luis')
    expect(nameCells[2]).toHaveTextContent('Maria')
  })
})

describe('DataGrid · conformance canon', () => {
  // dg-1: zebra por token, jamas rgba a mano
  it('dg-1: el zebra default sale de --surface-sunken', () => {
    expect(fuente('../DataGrid.tsx')).toMatch(/zebraToken = 'var\(--surface-sunken\)'/)
  })

  // dg-2: header ordenable = boton enfocable con aria-sort
  it('dg-2: ordenar pone aria-sort y el header es un boton', async () => {
    const user = userEvent.setup()
    render(<DataGrid columns={columns} rows={rows} />)
    const boton = screen.getByRole('button', { name: 'Nombre' })
    await user.click(boton)
    expect(boton.closest('th')).toHaveAttribute('aria-sort', 'ascending')
  })

  // dg-3: fila clickeable enfocable, Enter y Espacio, sin role=button
  it('dg-3: la fila clickeable tabula, dispara con Enter y Espacio y conserva su rol de fila', async () => {
    const onRowClick = vi.fn()
    render(<DataGrid columns={columns} rows={rows} onRowClick={onRowClick} />)
    const fila = screen.getByText('Ana').closest('tr')!
    expect(fila.getAttribute('role')).toBeNull()
    fila.focus()
    expect(fila).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    expect(onRowClick).toHaveBeenCalledTimes(2)
  })

  // dg-9: el contenedor desplaza en horizontal, nunca recorta
  it('dg-9: el root desplaza con overflow-x auto en vez de recortar', () => {
    expect(fuente('../DataGrid.module.css')).toMatch(/\.root\s*\{[^}]*overflow-x:\s*auto/)
  })

  // dg-10: la piel reemplaza clases sin duplicar la mecanica
  it('dg-10: Table es DataGrid con skin — no reimplementa orden ni teclado', () => {
    const piel = fuente('../../components/Table.tsx')
    expect(piel).toMatch(/<DataGrid/)
    expect(piel).toMatch(/skin=\{\{/)
    expect(piel).not.toMatch(/aria-sort|onKeyDown|localeCompare/)
  })
})

describe('DataGrid · GridColumn.priority', () => {
  it('marca th y td con data-priority para el retiro responsivo', () => {
    const { container } = render(
      <DataGrid
        columns={[{ key: 'a', label: 'Core' }, { key: 'b', label: 'Extra', priority: 3 }]}
        rows={[{ a: 1, b: 2 }]}
      />,
    )
    expect(container.querySelectorAll('[data-priority="3"]')).toHaveLength(2)
    expect(container.querySelector('th[data-priority="3"]')).toHaveTextContent('Extra')
  })
})
