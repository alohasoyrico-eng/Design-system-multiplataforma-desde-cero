import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TabBar } from '../TabBar'

const items = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'wallet', label: 'Cartera', icon: 'account_balance_wallet' },
  { id: 'profile', label: 'Perfil', icon: 'person' },
]

describe('TabBar', () => {
  it('renders all tab items', () => {
    render(<TabBar items={items} activeId="home" />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Cartera')).toBeInTheDocument()
    expect(screen.getByText('Perfil')).toBeInTheDocument()
  })

  it('marks active item with aria-selected', () => {
    render(<TabBar items={items} activeId="wallet" />)
    const walletTab = screen.getByRole('tab', { name: 'Cartera' })
    expect(walletTab).toHaveAttribute('aria-selected', 'true')
  })

  it('sets data-active on active item', () => {
    render(<TabBar items={items} activeId="home" />)
    const homeTab = screen.getByRole('tab', { name: 'Inicio' })
    expect(homeTab).toHaveAttribute('data-active')
  })

  it('calls onChange when tab clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TabBar items={items} activeId="home" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Cartera' }))
    expect(onChange).toHaveBeenCalledWith('wallet')
  })

  it('renders with role tablist', () => {
    render(<TabBar items={items} activeId="home" />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders badge count', () => {
    const itemsWithBadge = [
      ...items,
      { id: 'notif', label: 'Alertas', icon: 'notifications', badge: 5 as number | true },
    ]
    render(<TabBar items={itemsWithBadge} activeId="home" />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders 9+ for badge count over 9', () => {
    const itemsWithBadge = [
      ...items,
      { id: 'notif', label: 'Alertas', icon: 'notifications', badge: 15 as number | true },
    ]
    render(<TabBar items={itemsWithBadge} activeId="home" />)
    expect(screen.getByText('9+')).toBeInTheDocument()
  })
})
