import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { FilterableEditableTable } from '../FilterableEditableTable'

const columns = [
  { key: 'name', label: 'Nombre', filterable: true },
  { key: 'email', label: 'Email' },
]

const rows = [
  { id: '1', name: 'Ana', email: 'ana@test.com' },
  { id: '2', name: 'Bruno', email: 'bruno@test.com' },
]

describe('FilterableEditableTable', () => {
  it('renders the filter label', () => {
    renderWithIntl(<FilterableEditableTable columns={columns} rows={rows} rowKey="id" />)
    expect(screen.getByText('Filtrar:')).toBeInTheDocument()
  })

  it('renders filter inputs for filterable columns', () => {
    renderWithIntl(<FilterableEditableTable columns={columns} rows={rows} rowKey="id" />)
    expect(screen.getByLabelText('Filtrar por Nombre')).toBeInTheDocument()
  })

  it('renders cell content from rows', () => {
    renderWithIntl(<FilterableEditableTable columns={columns} rows={rows} rowKey="id" />)
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
  })

  it('shows empty state when no rows', () => {
    renderWithIntl(<FilterableEditableTable columns={columns} rows={[]} rowKey="id" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })
})
