import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { NotificationCenter } from '../NotificationCenter'

const items = [
  { id: '1', tone: 'warning' as const, title: 'Alerta de velocidad', desc: 'Unidad 42 excedió el límite', time: 'Hace 5 min', read: false },
  { id: '2', tone: 'success' as const, title: 'Viaje completado', time: 'Hace 1 hora', read: true },
]

describe('NotificationCenter', () => {
  it('renders notification trigger button', () => {
    renderWithIntl(<NotificationCenter items={items} />)
    expect(screen.getByLabelText(/Notificaciones/)).toBeInTheDocument()
  })

  it('shows items after opening popover', async () => {
    const user = userEvent.setup()
    renderWithIntl(<NotificationCenter items={items} />)
    await user.click(screen.getByLabelText(/Notificaciones/))
    expect(screen.getByText('Alerta de velocidad')).toBeInTheDocument()
    expect(screen.getByText('Viaje completado')).toBeInTheDocument()
  })

  it('calls onItemClick when clicking an item', async () => {
    const user = userEvent.setup()
    const onItemClick = vi.fn()
    renderWithIntl(<NotificationCenter items={items} onItemClick={onItemClick} />)
    await user.click(screen.getByLabelText(/Notificaciones/))
    await user.click(screen.getByText('Alerta de velocidad'))
    expect(onItemClick).toHaveBeenCalledWith(items[0])
  })

  it('shows mark all read button when unread items exist', async () => {
    const user = userEvent.setup()
    renderWithIntl(<NotificationCenter items={items} onMarkAllRead={() => {}} />)
    await user.click(screen.getByLabelText(/Notificaciones/))
    expect(screen.getByText('Marcar todo como leido')).toBeInTheDocument()
  })

  it('calls onMarkAllRead when clicking mark all read', async () => {
    const user = userEvent.setup()
    const onMarkAllRead = vi.fn()
    renderWithIntl(<NotificationCenter items={items} onMarkAllRead={onMarkAllRead} />)
    await user.click(screen.getByLabelText(/Notificaciones/))
    await user.click(screen.getByText('Marcar todo como leido'))
    expect(onMarkAllRead).toHaveBeenCalledOnce()
  })
})
