import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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
