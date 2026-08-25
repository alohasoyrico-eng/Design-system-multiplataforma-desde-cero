import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { ChatThread } from '../ChatThread'
import type { ChatMsg } from '../ChatThread'

const messages: ChatMsg[] = [
  { id: '1', role: 'user', text: 'Hola' },
  { id: '2', role: 'agent', text: 'Bienvenido' },
]

describe('ChatThread', () => {
  it('renders all messages', () => {
    renderWithIntl(<ChatThread messages={messages} />)
    expect(screen.getByText('Hola')).toBeInTheDocument()
    expect(screen.getByText('Bienvenido')).toBeInTheDocument()
  })

  it('renders empty state when no messages', () => {
    renderWithIntl(<ChatThread messages={[]} emptyState={<p>Sin mensajes</p>} />)
    expect(screen.getByText('Sin mensajes')).toBeInTheDocument()
  })

  it('does not render empty state when messages exist', () => {
    renderWithIntl(<ChatThread messages={messages} emptyState={<p>Sin mensajes</p>} />)
    expect(screen.queryByText('Sin mensajes')).not.toBeInTheDocument()
  })

  it('renders container with no message children when no messages and no empty state', () => {
    const { container } = renderWithIntl(<ChatThread messages={[]} />)
    const root = container.firstChild as HTMLElement
    expect(root).toBeInTheDocument()
    expect(root.children).toHaveLength(0)
  })

  it('sets aria-live on container', () => {
    const { container } = renderWithIntl(<ChatThread messages={messages} />)
    expect(container.firstChild).toHaveAttribute('aria-live', 'polite')
  })

  it('renders messages with correct roles', () => {
    renderWithIntl(<ChatThread messages={messages} />)
    expect(screen.getByLabelText('Tu mensaje')).toBeInTheDocument()
    expect(screen.getByLabelText('Respuesta del asistente')).toBeInTheDocument()
  })
})
