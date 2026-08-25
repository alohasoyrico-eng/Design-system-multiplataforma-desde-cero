import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Breadcrumb } from '../Breadcrumb'

const items = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Detalle' },
]

describe('Breadcrumb', () => {
  it('renders all item labels', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Detalle')).toBeInTheDocument()
  })

  it('renders links with href for items that have href', () => {
    render(<Breadcrumb items={items} />)
    const inicio = screen.getByText('Inicio')
    expect(inicio.tagName).toBe('A')
    expect(inicio).toHaveAttribute('href', '/')

    const productos = screen.getByText('Productos')
    expect(productos.tagName).toBe('A')
    expect(productos).toHaveAttribute('href', '/productos')
  })

  it('renders last item without href as span', () => {
    render(<Breadcrumb items={items} />)
    const detalle = screen.getByText('Detalle')
    expect(detalle.tagName).toBe('SPAN')
  })

  it('marks last item as current with data-current', () => {
    render(<Breadcrumb items={items} />)
    const detalle = screen.getByText('Detalle')
    expect(detalle).toHaveAttribute('data-current', 'true')
  })

  it('renders nav with aria-label', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('renders separators between items', () => {
    const { container } = render(<Breadcrumb items={items} />)
    const separators = container.querySelectorAll('.flow-icon')
    expect(separators).toHaveLength(2)
  })

  it('renders empty when no items provided', () => {
    const { container } = render(<Breadcrumb />)
    expect(container.querySelector('ol')?.children).toHaveLength(0)
  })
})
