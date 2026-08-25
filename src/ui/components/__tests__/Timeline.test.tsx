import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { Timeline } from '../Timeline'

const items = [
  { title: 'Pedido creado', status: 'done' as const, timestamp: '10:00' },
  { title: 'En tránsito', status: 'active' as const, timestamp: '11:30' },
  { title: 'Entregado', status: 'pending' as const },
]

describe('Timeline', () => {
  it('renders item titles', () => {
    renderWithIntl(<Timeline items={items} />)
    expect(screen.getByText('Pedido creado')).toBeInTheDocument()
    expect(screen.getByText('En tránsito')).toBeInTheDocument()
    expect(screen.getByText('Entregado')).toBeInTheDocument()
  })

  it('renders timestamps', () => {
    renderWithIntl(<Timeline items={items} />)
    expect(screen.getByText('10:00')).toBeInTheDocument()
    expect(screen.getByText('11:30')).toBeInTheDocument()
  })

  it('sets mode data attribute', () => {
    const { container } = renderWithIntl(<Timeline items={items} mode="events" />)
    const ol = container.querySelector('ol')!
    expect(ol).toHaveAttribute('data-mode', 'events')
  })

  it('defaults to steps mode', () => {
    const { container } = renderWithIntl(<Timeline items={items} />)
    const ol = container.querySelector('ol')!
    expect(ol).toHaveAttribute('data-mode', 'steps')
  })

  it('renders status icons in steps mode', () => {
    const { container } = renderWithIntl(<Timeline items={items} mode="steps" />)
    const icons = container.querySelectorAll('.stepDotIcon')
    expect(icons[0]).toHaveTextContent('check')
    expect(icons[1]).toHaveTextContent('radio_button_checked')
    expect(icons[2]).toHaveTextContent('radio_button_unchecked')
  })

  it('renders status labels in events mode', () => {
    renderWithIntl(<Timeline items={items} mode="events" />)
    expect(screen.getByText('Completado')).toBeInTheDocument()
    expect(screen.getByText('En curso')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    const itemsWithDesc = [
      { title: 'Paso 1', description: 'Detalle importante', status: 'done' as const },
    ]
    renderWithIntl(<Timeline items={itemsWithDesc} />)
    expect(screen.getByText('Detalle importante')).toBeInTheDocument()
  })
})
