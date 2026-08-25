import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { TopBar } from '../TopBar'

describe('TopBar', () => {
  it('renders logo', () => {
    renderWithIntl(<TopBar logo={<span>FlowLogo</span>} />)
    expect(screen.getByText('FlowLogo')).toBeInTheDocument()
  })

  it('renders nav items in standard variant', () => {
    const navItems = [
      { id: 'dash', label: 'Dashboard', active: true },
      { id: 'fleet', label: 'Flota' },
    ]
    renderWithIntl(<TopBar navItems={navItems} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Flota')).toBeInTheDocument()
  })

  it('marks active nav item with aria-current', () => {
    const navItems = [
      { id: 'dash', label: 'Dashboard', active: true },
      { id: 'fleet', label: 'Flota' },
    ]
    renderWithIntl(<TopBar navItems={navItems} />)
    expect(screen.getByText('Dashboard')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Flota')).not.toHaveAttribute('aria-current')
  })

  it('renders notification badge count in admin variant', () => {
    renderWithIntl(<TopBar variant="admin" notificationCount={3} onNotifications={() => {}} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders 9+ for notification count over 9', () => {
    renderWithIntl(<TopBar variant="admin" notificationCount={15} onNotifications={() => {}} />)
    expect(screen.getByText('9+')).toBeInTheDocument()
  })

  it('renders nothing for fullscreen variant', () => {
    const { container } = renderWithIntl(<TopBar variant="fullscreen" />)
    expect(container.innerHTML).toBe('')
  })

  it('renders avatar when provided', () => {
    renderWithIntl(<TopBar avatar={<span>AV</span>} />)
    expect(screen.getByText('AV')).toBeInTheDocument()
  })

  it('renders breadcrumb in minimal variant', () => {
    const breadcrumb = [
      { label: 'Inicio', href: '/' },
      { label: 'Reportes' },
    ]
    renderWithIntl(<TopBar variant="minimal" breadcrumb={breadcrumb} />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Reportes')).toBeInTheDocument()
  })
})
