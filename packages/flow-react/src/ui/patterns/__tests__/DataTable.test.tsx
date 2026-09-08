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

  // dtb-7: con pageSizeOptions el pie trae rango y selector de tamaño.
  it('la paginación completa enseña rango y selector (dtb-7)', () => {
    const muchos = Array.from({ length: 30 }, (_, i) => ({ id: String(i), nombre: `Fila ${i}`, valor: i }))
    renderWithIntl(
      <DataTable
        columns={columns}
        rows={muchos}
        rowKey="id"
        caption="Cosas"
        pageSize={10}
        pageSizeOptions={[10, 25]}
      />,
    )
    expect(screen.getByText('1–10 de 30')).toBeInTheDocument()
    expect(screen.getByText(/Por página/)).toBeInTheDocument()
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
