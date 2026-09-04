import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { WidgetLibrary } from '../WidgetLibrary'

const widgets = [
  { id: 'w1', title: 'Consumo', visible: true },
  { id: 'w2', title: 'Rutas', visible: false },
  { id: 'w3', title: 'Mantenimiento', visible: true },
]

describe('WidgetLibrary', () => {
  // wl-1: subir/bajar con nombre; extremos deshabilitados
  it('reordena por botones con nombre y deshabilita los extremos', async () => {
    const onMove = vi.fn()
    render(<WidgetLibrary open onClose={() => {}} widgets={widgets} onToggle={() => {}} onMove={onMove} />)
    expect(screen.getByRole('button', { name: 'Subir: Consumo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Bajar: Mantenimiento' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Bajar: Consumo' }))
    expect(onMove).toHaveBeenCalledWith('w1', 1)
  })

  // wl-2: cada toggle nombra su widget
  it('mostrar/ocultar nombra su widget según su estado', async () => {
    const onToggle = vi.fn()
    render(<WidgetLibrary open onClose={() => {}} widgets={widgets} onToggle={onToggle} onMove={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar: Rutas' }))
    expect(onToggle).toHaveBeenCalledWith('w2')
    expect(screen.getByRole('button', { name: 'Ocultar: Consumo' })).toBeInTheDocument()
  })

  // wl-3: overlay del sistema (Escape cierra, heredado)
  it('Escape cierra: es un overlay del sistema', async () => {
    const onClose = vi.fn()
    render(<WidgetLibrary open onClose={onClose} widgets={widgets} onToggle={() => {}} onMove={() => {}} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
