import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusView } from '../StatusView'

describe('StatusView', () => {
  it('renders title and description', () => {
    render(<StatusView title="Operación exitosa" description="Tu pago fue procesado" />)
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument()
    expect(screen.getByText('Tu pago fue procesado')).toBeInTheDocument()
  })

  it('renders status icon for success', () => {
    const { container } = render(<StatusView status="success" title="OK" />)
    const icon = container.querySelector('.statusIcon')
    expect(icon).toHaveTextContent('check_circle')
  })

  it('renders status icon for error', () => {
    const { container } = render(<StatusView status="error" title="Falló" />)
    const icon = container.querySelector('.statusIcon')
    expect(icon).toHaveTextContent('error')
  })

  it('sets data-status on icon wrap', () => {
    const { container } = render(<StatusView status="pending" title="Espera" />)
    const wrap = container.querySelector('.iconWrap')
    expect(wrap).toHaveAttribute('data-status', 'pending')
  })

  it('renders primary action slot', () => {
    render(<StatusView title="Done" primaryAction={<button>Reintentar</button>} />)
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
  })

  it('renders secondary action slot', () => {
    render(<StatusView title="Done" secondaryAction={<button>Cancelar</button>} />)
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('defaults to loading status', () => {
    const { container } = render(<StatusView title="Cargando" />)
    const icon = container.querySelector('.statusIcon')
    expect(icon).toHaveTextContent('sync')
  })

  it('renders description with role status', () => {
    render(<StatusView description="Procesando..." />)
    expect(screen.getByRole('status')).toHaveTextContent('Procesando...')
  })
})
