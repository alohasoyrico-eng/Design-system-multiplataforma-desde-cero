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
    const { container } = render(
      <Menu
        trigger={<button>Open</button>}
        items={[{ label: 'A' }, 'divider', { label: 'B' }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(container.querySelector('[role="separator"]')).toBeInTheDocument()
  })
})
