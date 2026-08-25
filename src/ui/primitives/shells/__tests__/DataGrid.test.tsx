import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DataGrid } from '../DataGrid'

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
