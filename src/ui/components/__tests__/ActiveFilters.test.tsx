import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import { ActiveFilters } from '../ActiveFilters'

const wrap = (ui: React.ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

const dos = [
  { id: 'a', dimension: 'Estado', label: 'En taller' },
  { id: 'b', dimension: 'Zona', label: 'Norte' },
]

describe('ActiveFilters', () => {
  // af-1: el boton de quitar nombra dimension y valor
  it('cada chip se quita con nombre accesible que incluye dimension y valor', async () => {
    const onRemove = vi.fn()
    wrap(<ActiveFilters filters={dos} onRemove={onRemove} />)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Estado: En taller' }))
    expect(onRemove).toHaveBeenCalledWith('a')
  })

  // af-2: el periodo no ofrece quitar
  it('el chip de periodo no es removible', () => {
    wrap(<ActiveFilters filters={[]} period="Últimos 30 días" onRemove={() => {}} />)
    expect(screen.getByText('Últimos 30 días')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Quitar Últimos 30 días/ })).toBeNull()
  })

  // af-3: limpiar todo solo con 2 o mas filtros
  it('limpiar todo aparece con dos filtros y no con uno', async () => {
    const onClearAll = vi.fn()
    const { rerender } = wrap(
      <ActiveFilters filters={dos} onRemove={() => {}} onClearAll={onClearAll} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(onClearAll).toHaveBeenCalled()
    rerender(
      <IntlProvider locale="es">
        <ActiveFilters filters={dos.slice(0, 1)} onRemove={() => {}} onClearAll={onClearAll} />
      </IntlProvider>,
    )
    expect(screen.queryByRole('button', { name: 'Limpiar filtros' })).toBeNull()
  })

  // af-4: sin filtros ni periodo, nada en el arbol
  it('sin filtros ni periodo no renderiza nada', () => {
    const { container } = wrap(<ActiveFilters filters={[]} onRemove={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  // af-5: region con nombre y lista
  it('expone region con nombre accesible y lista de chips', () => {
    wrap(<ActiveFilters filters={dos} onRemove={() => {}} />)
    expect(screen.getByRole('region', { name: 'Filtros activos' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
