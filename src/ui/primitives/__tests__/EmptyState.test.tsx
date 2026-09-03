import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No hay datos" description="Intenta más tarde" />)
    expect(screen.getByText('No hay datos')).toBeInTheDocument()
    expect(screen.getByText('Intenta más tarde')).toBeInTheDocument()
  })

  it('renders icon with flow-symbol class', () => {
    const { container } = render(<EmptyState icon="inbox" />)
    const icon = container.querySelector('.flow-symbol')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveTextContent('inbox')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders action slot', () => {
    render(<EmptyState action={<button>Reintentar</button>} />)
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
  })

  it('omits icon when not provided', () => {
    const { container } = render(<EmptyState title="Vacío" />)
    expect(container.querySelector('.flow-symbol')).not.toBeInTheDocument()
  })

  it('omits title and description when not provided', () => {
    const { container } = render(<EmptyState />)
    expect(container.textContent).toBe('')
  })
})
