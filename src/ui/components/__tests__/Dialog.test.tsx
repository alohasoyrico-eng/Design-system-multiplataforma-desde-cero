import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Dialog } from '../Dialog'

describe('Dialog', () => {
  it('renders nothing when closed', () => {
    render(<Dialog open={false} title="Confirm" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog when open', () => {
    render(<Dialog open title="Confirm" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders title and description', () => {
    render(<Dialog open title="¿Eliminar?" description="Esta acción es irreversible" />)
    expect(screen.getByText('¿Eliminar?')).toBeInTheDocument()
    expect(screen.getByText('Esta acción es irreversible')).toBeInTheDocument()
  })

  it('renders actions slot', () => {
    render(<Dialog open title="X" actions={<button>OK</button>} />)
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })

  it('sets danger tone on title', () => {
    const { container } = render(<Dialog open title="Peligro" tone="danger" />)
    expect(container.querySelector('.title')).toHaveAttribute('data-tone', 'danger')
  })

  it('calls onClose on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Dialog open onClose={onClose} title="Close me" actions={<button>OK</button>} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders children content', () => {
    render(<Dialog open title="Form"><p>Custom content</p></Dialog>)
    expect(screen.getByText('Custom content')).toBeInTheDocument()
  })
})

describe('Dialog — width', () => {
  it('aplica el ancho pedido al contenedor', () => {
    const { container } = render(<Dialog open title="Confirmar" width={560} />)
    const sized = container.querySelector('[style*="width"]') as HTMLElement
    expect(sized.style.width).toBe('560px')
  })
})
