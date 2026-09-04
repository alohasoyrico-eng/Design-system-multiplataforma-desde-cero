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

  it('renders chevron separators in default variant', () => {
    const { container } = render(<Breadcrumb items={items} />)
    const icons = container.querySelectorAll('.flow-symbol')
    expect(icons).toHaveLength(2)
    expect(icons[0].textContent).toBe('chevron_right')
  })

  it('renders empty when no items provided', () => {
    const { container } = render(<Breadcrumb />)
    expect(container.querySelector('ol')?.children).toHaveLength(0)
  })
})

describe('Breadcrumb variant="subtle"', () => {
  it('renders slash separators instead of chevrons', () => {
    const { container } = render(<Breadcrumb items={items} variant="subtle" />)
    const separators = container.querySelectorAll('[aria-hidden="true"]')
    const slashes = Array.from(separators).filter(el =>
      el.textContent === '/' && !el.classList.contains('flow-symbol')
    )
    expect(slashes).toHaveLength(2)
  })

  it('renders home icon for first item', () => {
    const { container } = render(<Breadcrumb items={items} variant="subtle" />)
    const homeIcon = container.querySelector('.flow-symbol')
    expect(homeIcon).toBeInTheDocument()
    expect(homeIcon!.textContent).toBe('home')
  })

  it('sets aria-label on home icon link', () => {
    render(<Breadcrumb items={items} variant="subtle" />)
    const link = screen.getByLabelText('Inicio')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/')
  })

  it('accepts custom homeIcon', () => {
    const { container } = render(
      <Breadcrumb items={items} variant="subtle" homeIcon="cottage" />
    )
    const icon = container.querySelector('.flow-symbol')
    expect(icon!.textContent).toBe('cottage')
  })

  it('sets data-variant on the list', () => {
    const { container } = render(<Breadcrumb items={items} variant="subtle" />)
    const list = container.querySelector('ol')
    expect(list).toHaveAttribute('data-variant', 'subtle')
  })

  it('renders remaining items as text labels', () => {
    render(<Breadcrumb items={items} variant="subtle" />)
    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Detalle')).toBeInTheDocument()
  })
})
