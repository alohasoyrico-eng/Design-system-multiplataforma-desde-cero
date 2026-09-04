import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Drawer } from '../Drawer'

describe('Drawer', () => {
  it('renders nothing when closed', () => {
    render(<Drawer open={false} title="Settings" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog when open', () => {
    render(<Drawer open title="Settings" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<Drawer open title="Configuracion" />)
    expect(screen.getByText('Configuracion')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <Drawer open title="Drawer">
        <p>Drawer body</p>
      </Drawer>,
    )
    expect(screen.getByText('Drawer body')).toBeInTheDocument()
  })

  it('renders footer slot', () => {
    render(<Drawer open title="Drawer" footer={<button>Guardar</button>} />)
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<Drawer open title="Drawer" />)
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer open onClose={onClose} title="Drawer" />)
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer open onClose={onClose} title="Drawer" />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not render footer when not provided', () => {
    const { container } = render(<Drawer open title="Drawer" />)
    expect(container.querySelector('[class*="footer"]')).not.toBeInTheDocument()
  })
})

describe('Drawer — side', () => {
  it('side="left" alinea el shell al inicio', () => {
    const { container } = render(<Drawer open side="left" title="Filtros" />)
    expect(container.querySelector('[data-alignment="start"]')).not.toBeNull()
  })

  it('default entra por la derecha (end)', () => {
    const { container } = render(<Drawer open title="Filtros" />)
    expect(container.querySelector('[data-alignment="end"]')).not.toBeNull()
  })
})
