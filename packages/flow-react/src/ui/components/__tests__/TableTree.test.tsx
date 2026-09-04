import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { TableTree } from '../TableTree'

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'value', label: 'Valor' },
]

const rows = [
  {
    id: '1',
    name: 'Región Norte',
    value: 100,
    children: [
      { id: '1-1', name: 'Monterrey', value: 60 },
      { id: '1-2', name: 'Saltillo', value: 40 },
    ],
  },
  { id: '2', name: 'Región Sur', value: 200 },
]

describe('TableTree', () => {
  it('renders column headers', () => {
    renderWithIntl(<TableTree columns={columns} rows={rows} />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Valor')).toBeInTheDocument()
  })

  it('renders top-level rows', () => {
    renderWithIntl(<TableTree columns={columns} rows={rows} />)
    expect(screen.getByText('Región Norte')).toBeInTheDocument()
    expect(screen.getByText('Región Sur')).toBeInTheDocument()
  })

  it('does not render children by default', () => {
    renderWithIntl(<TableTree columns={columns} rows={rows} />)
    expect(screen.queryByText('Monterrey')).not.toBeInTheDocument()
  })

  it('renders expand button for parent rows', () => {
    renderWithIntl(<TableTree columns={columns} rows={rows} />)
    expect(screen.getByRole('button', { name: 'Expandir' })).toBeInTheDocument()
  })

  it('expands children when toggle clicked', async () => {
    const user = userEvent.setup()
    renderWithIntl(<TableTree columns={columns} rows={rows} />)
    await user.click(screen.getByRole('button', { name: 'Expandir' }))
    expect(screen.getByText('Monterrey')).toBeInTheDocument()
    expect(screen.getByText('Saltillo')).toBeInTheDocument()
  })

  it('collapses children when toggle clicked again', async () => {
    const user = userEvent.setup()
    renderWithIntl(<TableTree columns={columns} rows={rows} />)
    await user.click(screen.getByRole('button', { name: 'Expandir' }))
    expect(screen.getByText('Monterrey')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Colapsar' }))
    expect(screen.queryByText('Monterrey')).not.toBeInTheDocument()
  })

  it('calls onRowClick when row clicked', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    renderWithIntl(<TableTree columns={columns} rows={rows} onRowClick={onRowClick} />)
    await user.click(screen.getByText('Región Sur'))
    expect(onRowClick).toHaveBeenCalledWith(rows[1])
  })

  it('uses treegrid role on table', () => {
    renderWithIntl(<TableTree columns={columns} rows={rows} />)
    expect(screen.getByRole('treegrid')).toBeInTheDocument()
  })
})
