import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SavedViews } from '../SavedViews'

const vistas = [
  { id: 'a', name: 'Flota norte' },
  { id: 'b', name: 'Solo eléctricos' },
]

const abre = async () => userEvent.click(screen.getByRole('button', { name: /Vistas/ }))

describe('SavedViews', () => {
  // sv-1: aplicar por nombre; borrar es control aparte y jamás aplica
  it('aplica por el nombre y borra con control aparte', async () => {
    const onApply = vi.fn(); const onDelete = vi.fn()
    render(<SavedViews views={vistas} onApply={onApply} onSave={() => {}} onDelete={onDelete} />)
    await abre()
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar vista: Flota norte' }))
    expect(onDelete).toHaveBeenCalledWith('a')
    expect(onApply).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Flota norte' }))
    expect(onApply).toHaveBeenCalledWith('a')
  })

  // sv-2: al cupo, guardar deshabilitado y el contador lo explica
  it('al cupo deshabilita guardar y lo explica', async () => {
    render(<SavedViews views={vistas} max={2} onApply={() => {}} onSave={() => {}} onDelete={() => {}} />)
    await abre()
    expect(screen.getByRole('button', { name: 'Guardar vista' })).toBeDisabled()
    expect(screen.getByText(/cupo lleno/)).toBeInTheDocument()
  })

  // sv-3: nombre no vacío; Enter guarda y limpia
  it('Enter guarda con nombre y limpia el campo', async () => {
    const onSave = vi.fn()
    render(<SavedViews views={vistas} onApply={() => {}} onSave={onSave} onDelete={() => {}} />)
    await abre()
    const campo = screen.getByRole('textbox', { name: 'Nombre de la vista' })
    await userEvent.type(campo, '  {Enter}')
    expect(onSave).not.toHaveBeenCalled()
    await userEvent.clear(campo)
    await userEvent.type(campo, 'Combustible alto{Enter}')
    expect(onSave).toHaveBeenCalledWith('Combustible alto')
    expect(campo).toHaveValue('')
  })

  // sv-4: la activa se marca
  it('marca la vista activa con aria-current', async () => {
    render(<SavedViews views={vistas} activeId="b" onApply={() => {}} onSave={() => {}} onDelete={() => {}} />)
    await abre()
    expect(screen.getByRole('button', { name: 'Solo eléctricos' })).toHaveAttribute('aria-current', 'true')
  })
})
