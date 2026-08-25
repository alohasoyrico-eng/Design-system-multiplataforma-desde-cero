import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar } from '../Sidebar'

const items = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'reports', label: 'Reportes', icon: 'bar_chart' },
  { id: 'settings', label: 'Configuración', icon: 'settings' },
]

describe('Sidebar', () => {
  it('renders all nav items', () => {
    render(<Sidebar items={items} />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Reportes')).toBeInTheDocument()
    expect(screen.getByText('Configuración')).toBeInTheDocument()
  })

  it('marks active item with aria-current', () => {
    render(<Sidebar items={items} activeId="reports" />)
    const reportBtn = screen.getByText('Reportes').closest('button')!
    expect(reportBtn).toHaveAttribute('aria-current', 'page')
  })

  it('sets data-active on active item', () => {
    render(<Sidebar items={items} activeId="home" />)
    const homeBtn = screen.getByText('Inicio').closest('button')!
    expect(homeBtn).toHaveAttribute('data-active')
  })

  it('calls onNavigate when item clicked', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<Sidebar items={items} onNavigate={onNavigate} />)
    await user.click(screen.getByText('Reportes'))
    expect(onNavigate).toHaveBeenCalledWith('reports', undefined)
  })

  it('hides labels when collapsed', () => {
    render(<Sidebar items={items} collapsed />)
    expect(screen.queryByText('Inicio')).not.toBeInTheDocument()
  })

  it('sets aside width when collapsed', () => {
    const { container } = render(<Sidebar items={items} collapsed />)
    const aside = container.querySelector('aside')!
    expect(aside.style.width).toBe('60px')
  })

  it('renders nav with aria-label', () => {
    render(<Sidebar items={items} />)
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument()
  })

  it('renders expandable sections', async () => {
    const user = userEvent.setup()
    const sectionItems = [
      {
        id: 'admin',
        label: 'Administración',
        icon: 'admin_panel_settings',
        children: [
          { id: 'users', label: 'Usuarios' },
          { id: 'roles', label: 'Roles' },
        ],
      },
    ]
    const onToggleSection = vi.fn()
    render(
      <Sidebar
        items={sectionItems}
        expandedSections={new Set()}
        onToggleSection={onToggleSection}
      />,
    )
    await user.click(screen.getByText('Administración'))
    expect(onToggleSection).toHaveBeenCalledWith('admin')
  })
})
