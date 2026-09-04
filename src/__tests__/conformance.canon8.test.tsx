/**
 * Conformance con el canon — tanda 8 (foundations en DOM montado).
 * a11y-4 y a11y-5 se miden aqui; los criterios estaticos de foundations
 * (ico-*, a11y-1, a11y-6, mot-3, mot-5) viven en scripts/check-icons.mjs y
 * scripts/check-a11y.mjs, que el medidor tambien cuenta.
 */
import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Dialog } from '../ui/components/Dialog'
import { Menu } from '../ui/components/Menu'

function Anfitrion() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir dialogo</button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Ajustes">
        <Menu
          trigger={<button>Mas acciones</button>}
          items={[
            { label: 'Duplicar', onClick: () => {} },
            { label: 'Eliminar', onClick: () => {} },
          ]}
        />
      </Dialog>
    </>
  )
}

describe('conformance canon · a11y (foundations, DOM montado)', () => {
  it('a11y-4: el foco entra a lo que se abre y vuelve al disparador al cerrarse', async () => {
    const user = userEvent.setup()
    render(<Anfitrion />)
    const disparador = screen.getByRole('button', { name: 'Abrir dialogo' })
    await user.click(disparador)
    const dialogo = screen.getByRole('dialog')
    expect(dialogo.contains(document.activeElement)).toBe(true)
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(disparador)
  })

  it('a11y-5: Escape cierra la capa mas alta y solo esa', async () => {
    const user = userEvent.setup()
    render(<Anfitrion />)
    await user.click(screen.getByRole('button', { name: 'Abrir dialogo' }))
    await user.click(screen.getByRole('button', { name: 'Mas acciones' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    // la capa alta (menu) cae; el dialogo debajo sigue en pie
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // un segundo Escape si cierra el dialogo
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
