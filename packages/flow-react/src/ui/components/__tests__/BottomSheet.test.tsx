import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BottomSheet } from '../BottomSheet'

describe('BottomSheet', () => {
  it('renders nothing when closed', () => {
    render(<BottomSheet open={false} title="Sheet" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog when open', () => {
    render(<BottomSheet open title="Sheet" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<BottomSheet open title="Detalles del pago" />)
    expect(screen.getByText('Detalles del pago')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <BottomSheet open>
        <p>Sheet content</p>
      </BottomSheet>,
    )
    expect(screen.getByText('Sheet content')).toBeInTheDocument()
  })

  it('renders handle close button', () => {
    render(<BottomSheet open title="Sheet" />)
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
  })

  it('calls onClose when handle is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<BottomSheet open onClose={onClose} title="Sheet" />)
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<BottomSheet open onClose={onClose} title="Sheet" />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })
})

describe('BottomSheet · fullscreen (absorbe FlowFullscreenSheet)', () => {
  it('en fullscreen hay flecha atrás que cae en onClose si no hay onBack', async () => {
    const onClose = vi.fn()
    render(
      <BottomSheet open onClose={onClose} title="Detalle" fullscreen>
          contenido
        </BottomSheet>
      
    )
    await userEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('onBack tiene prioridad y las headerActions se renderizan', async () => {
    const onBack = vi.fn()
    const onClose = vi.fn()
    render(
      <BottomSheet
          open
          onClose={onClose}
          onBack={onBack}
          fullscreen
          title="Detalle"
          headerActions={<button>Guardar</button>}
        >
          contenido
        </BottomSheet>
      
    )
    await userEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(onBack).toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })

  it('sin fullscreen conserva el asa y no hay cabecera de navegación', () => {
    render(
      <BottomSheet open title="Detalle">
          contenido
        </BottomSheet>
      
    )
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Volver' })).toBeNull()
  })
})
