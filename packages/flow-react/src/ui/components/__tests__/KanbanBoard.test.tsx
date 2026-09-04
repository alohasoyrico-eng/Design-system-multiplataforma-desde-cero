import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { KanbanBoard } from '../KanbanBoard'

const columns = [
  { id: 'todo', label: 'Por hacer', color: '#3b82f6' },
  { id: 'doing', label: 'En progreso', color: '#f59e0b' },
  { id: 'done', label: 'Hecho', color: '#10b981' },
]

const items = [
  { id: '1', columnId: 'todo', title: 'Tarea uno' },
  { id: '2', columnId: 'doing', title: 'Tarea dos' },
  { id: '3', columnId: 'done', title: 'Tarea tres' },
]

const renderCard = (item: { id: string; columnId: string; title: string }) => (
  <span>{item.title}</span>
)

describe('KanbanBoard', () => {
  it('renders column headers', () => {
    renderWithIntl(<KanbanBoard columns={columns} items={items} renderCard={renderCard} />)
    expect(screen.getByText('Por hacer')).toBeInTheDocument()
    expect(screen.getByText('En progreso')).toBeInTheDocument()
    expect(screen.getByText('Hecho')).toBeInTheDocument()
  })

  it('renders cards via renderCard', () => {
    renderWithIntl(<KanbanBoard columns={columns} items={items} renderCard={renderCard} />)
    expect(screen.getByText('Tarea uno')).toBeInTheDocument()
    expect(screen.getByText('Tarea dos')).toBeInTheDocument()
    expect(screen.getByText('Tarea tres')).toBeInTheDocument()
  })

  it('renders column sections with group role', () => {
    const { container } = renderWithIntl(<KanbanBoard columns={columns} items={items} renderCard={renderCard} />)
    const sections = container.querySelectorAll('section[role="group"]')
    expect(sections.length).toBe(3)
  })

  it('renders cards as buttons with roledescription', () => {
    renderWithIntl(<KanbanBoard columns={columns} items={items} renderCard={renderCard} />)
    const cards = screen.getAllByRole('button')
    expect(cards.length).toBeGreaterThanOrEqual(3)
    expect(cards[0]).toHaveAttribute('aria-roledescription', 'tarjeta de tablero')
  })

  it('renders empty column message when column has no items', () => {
    const emptyItems = [{ id: '1', columnId: 'todo', title: 'Tarea uno' }]
    renderWithIntl(<KanbanBoard columns={columns} items={emptyItems} renderCard={renderCard} />)
    // "En progreso" and "Hecho" columns are empty
    const emptyMessages = screen.getAllByText('Vacía')
    expect(emptyMessages.length).toBe(2)
  })

  it('renders badge with item count per column', () => {
    renderWithIntl(<KanbanBoard columns={columns} items={items} renderCard={renderCard} />)
    // Each column has 1 item, so badges show "1"
    const badges = screen.getAllByText('1')
    expect(badges.length).toBeGreaterThanOrEqual(3)
  })
})
