import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { DataTable } from '../DataTable'

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'valor', label: 'Valor', align: 'right' as const },
]

const rows = [
  { id: 'a', nombre: 'Alfa', valor: 1 },
  { id: 'b', nombre: 'Beta', valor: 2 },
]

describe('DataTable', () => {
  it('renders rows and the search box by default', () => {
    renderWithIntl(<DataTable columns={columns} rows={rows} rowKey="id" caption="Cosas" />)
    expect(screen.getByText('Alfa')).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  // dtb-6: sin buscador cuando el dueño ya filtra aguas arriba.
  it('searchable=false oculta el buscador (dtb-6)', () => {
    renderWithIntl(
      <DataTable columns={columns} rows={rows} rowKey="id" caption="Cosas" searchable={false} />,
    )
    expect(screen.getByText('Alfa')).toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })
})
