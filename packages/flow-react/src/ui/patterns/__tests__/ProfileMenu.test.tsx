import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ProfileMenu } from '../ProfileMenu'

const items = [
  { icon: 'settings', label: 'Configuración', onClick: vi.fn() },
  { icon: 'logout', label: 'Cerrar sesión', onClick: vi.fn() },
]

describe('ProfileMenu', () => {
  it('renders name and role', () => {
    render(<ProfileMenu name="Ana García" avatarName="Ana" role="Administrador" items={items} />)
    expect(screen.getByText('Ana García')).toBeInTheDocument()
    expect(screen.getByText('Administrador')).toBeInTheDocument()
  })

  it('renders menu item labels', () => {
    render(<ProfileMenu name="Ana" avatarName="Ana" role="Admin" items={items} />)
    expect(screen.getByText('Configuración')).toBeInTheDocument()
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
  })

  it('renders menu item icons', () => {
    const { container } = render(<ProfileMenu name="Ana" avatarName="Ana" role="Admin" items={items} />)
    const icons = container.querySelectorAll('[class*="itemIcon"]')
    expect(icons[0]).toHaveTextContent('settings')
    expect(icons[1]).toHaveTextContent('logout')
  })

  it('calls onClick when a menu item is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const menuItems = [{ icon: 'settings', label: 'Config', onClick }]
    render(<ProfileMenu name="Ana" avatarName="Ana" role="Admin" items={menuItems} />)
    await user.click(screen.getByText('Config'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders avatar with initials', () => {
    render(<ProfileMenu name="Ana" avatarName="Ana García" role="Admin" items={items} />)
    // Avatar renders initials with aria-label matching the avatarName
    expect(screen.getByLabelText('Ana García')).toBeInTheDocument()
  })

  it('renders badge when provided', () => {
    render(<ProfileMenu name="Ana" avatarName="Ana" role="Admin" badge={<span>PRO</span>} items={items} />)
    expect(screen.getByText('PRO')).toBeInTheDocument()
  })
})
