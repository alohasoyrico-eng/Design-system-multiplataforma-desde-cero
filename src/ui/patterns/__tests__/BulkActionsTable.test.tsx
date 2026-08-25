import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BulkActionsTable } from '../BulkActionsTable'

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
]

const rows = [
  { id: '1', name: 'Ana', email: 'ana@test.com' },
  { id: '2', name: 'Bruno', email: 'bruno@test.com' },
  { id: '3', name: 'Carla', email: 'carla@test.com' },
]

const actions = [
  { id: 'delete', label: 'Eliminar', icon: 'delete', danger: true },
  { id: 'export', label: 'Exportar', icon: 'download' },
]

describe('BulkActionsTable', () => {
  it('renders cell content from rows', () => {
    render(<BulkActionsTable columns={columns} rows={rows} rowKey="id" />)
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
    expect(screen.getByText('Carla')).toBeInTheDocument()
  })

  it('renders record count when nothing is selected', () => {
    render(<BulkActionsTable columns={columns} rows={rows} rowKey="id" />)
    expect(screen.getByText('3 registros')).toBeInTheDocument()
  })

  it('shows selection count and action buttons when a row is selected', async () => {
    const user = userEvent.setup()
    render(<BulkActionsTable columns={columns} rows={rows} rowKey="id" actions={actions} />)
    const checkboxes = screen.getAllByRole('checkbox')
    // First checkbox is "Seleccionar todo" in the header bar, then per-row checkboxes in the grid
    // Click the first row checkbox (second checkbox overall)
    await user.click(checkboxes[1])
    expect(screen.getByText(/1 seleccionado/)).toBeInTheDocument()
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
    expect(screen.getByText('Exportar')).toBeInTheDocument()
  })

  it('calls onActionClick with action id and selected keys', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<BulkActionsTable columns={columns} rows={rows} rowKey="id" actions={actions} onActionClick={onAction} />)
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[1])
    await user.click(screen.getByText('Eliminar'))
    expect(onAction).toHaveBeenCalledWith('delete', expect.arrayContaining(['1']))
  })

  it('select all checkbox selects all rows', async () => {
    const user = userEvent.setup()
    render(<BulkActionsTable columns={columns} rows={rows} rowKey="id" actions={actions} />)
    // The first checkbox in the header bar is "select all"
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    expect(screen.getByText(/3 seleccionados/)).toBeInTheDocument()
  })
})
