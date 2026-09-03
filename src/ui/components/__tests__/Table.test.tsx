import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Table } from '../Table'

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'amount', label: 'Monto', align: 'right' as const, mono: true },
]

const rows = [
  { name: 'Gasolina', amount: 500 },
  { name: 'Peaje', amount: 120 },
  { name: 'Servicio', amount: 800 },
]

describe('Table', () => {
  it('renders column headers', () => {
    render(<Table columns={columns} rows={rows} />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Monto')).toBeInTheDocument()
  })

  it('renders row data', () => {
    render(<Table columns={columns} rows={rows} />)
    expect(screen.getByText('Gasolina')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('Peaje')).toBeInTheDocument()
  })

  it('renders all rows', () => {
    const { container } = render(<Table columns={columns} rows={rows} />)
    const bodyRows = container.querySelectorAll('tbody tr')
    expect(bodyRows).toHaveLength(3)
  })

  it('sets data-density for compact', () => {
    const { container } = render(<Table columns={columns} rows={rows} density="compact" />)
    expect(container.firstChild).toHaveAttribute('data-density', 'compact')
  })

  it('does not set data-density for default', () => {
    const { container } = render(<Table columns={columns} rows={rows} />)
    expect(container.firstChild).not.toHaveAttribute('data-density')
  })
})

describe('Table · orden controlado', () => {
  const cols = [{ key: 'n', label: 'Nombre' }]
  const rows = [{ n: 'B' }, { n: 'A' }]

  it('controlado: no reordena y emite onSortChange', async () => {
    const onSortChange = vi.fn()
    const { container } = render(
      <Table columns={cols} rows={rows} sort={null} onSortChange={onSortChange} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Nombre' }))
    expect(onSortChange).toHaveBeenCalledWith({ key: 'n', dir: 'asc' })
    const celdas = container.querySelectorAll('td')
    expect(celdas[0]).toHaveTextContent('B')
  })

  it('sin controlar: ordena localmente y el header es un botón de teclado', async () => {
    const { container } = render(<Table columns={cols} rows={rows} />)
    const th = screen.getByRole('button', { name: 'Nombre' })
    th.focus()
    await userEvent.keyboard('{Enter}')
    expect(container.querySelectorAll('td')[0]).toHaveTextContent('A')
  })
})
