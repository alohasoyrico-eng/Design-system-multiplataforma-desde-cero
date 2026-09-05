import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Menu } from '../Menu'

describe('Menu', () => {
  it('renders trigger', () => {
    render(<Menu trigger={<button>Opciones</button>} />)
    expect(screen.getByRole('button', { name: 'Opciones' })).toBeInTheDocument()
  })

  it('does not show menu items initially', () => {
    render(<Menu trigger={<button>Opciones</button>} items={[{ label: 'Editar' }]} />)
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()
  })

  it('shows menu items after clicking trigger', async () => {
    const user = userEvent.setup()
    render(
      <Menu
        trigger={<button>Opciones</button>}
        items={[
          { label: 'Editar', icon: 'edit' },
          { label: 'Eliminar', danger: true },
        ]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Opciones' }))
    expect(screen.getByRole('menuitem', { name: /Editar/ })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Eliminar/ })).toBeInTheDocument()
  })

  it('calls item onClick and closes on click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Menu
        trigger={<button>Más</button>}
        items={[{ label: 'Acción', onClick }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Más' }))
    await user.click(screen.getByRole('menuitem', { name: 'Acción' }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()
  })

  it('renders divider between items', async () => {
    const user = userEvent.setup()
    render(
      <Menu
        trigger={<button>Open</button>}
        items={[{ label: 'A' }, 'divider', { label: 'B' }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    // el panel vive en portal: el separador se busca en el documento
    expect(document.querySelector('[role="separator"]')).toBeInTheDocument()
  })
})

describe('Menu · conformance mnu-1/mnu-2 y disparador', () => {
  const items = [
    { label: 'Editar' },
    'divider' as const,
    { label: 'Duplicar', disabled: true },
    { label: 'Borrar', danger: true },
  ]

  it('el disparador anuncia haspopup y expanded', async () => {
    render(<Menu trigger={<button>Acciones</button>} items={items} />)
    const trigger = screen.getByRole('button', { name: 'Acciones' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('el foco entra al primer item usable al abrir', async () => {
    render(<Menu trigger={<button>Acciones</button>} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Acciones' }))
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveFocus()
  })

  it('las flechas recorren saltando divisores y deshabilitados', async () => {
    render(<Menu trigger={<button>Acciones</button>} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Acciones' }))
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Borrar' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveFocus()
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('menuitem', { name: 'Borrar' })).toHaveFocus()
  })
})
