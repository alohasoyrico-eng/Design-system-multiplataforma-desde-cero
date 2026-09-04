import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { ChatMessage } from '../ChatMessage'

describe('ChatMessage', () => {
  it('renders text content', () => {
    renderWithIntl(<ChatMessage text="Hola mundo" />)
    expect(screen.getByText('Hola mundo')).toBeInTheDocument()
  })

  it('sets data-role to agent by default', () => {
    const { container } = renderWithIntl(<ChatMessage text="Respuesta" />)
    expect(container.firstChild).toHaveAttribute('data-role', 'agent')
  })

  it('sets data-role to user', () => {
    const { container } = renderWithIntl(<ChatMessage role="user" text="Pregunta" />)
    expect(container.firstChild).toHaveAttribute('data-role', 'user')
  })

  it('renders aria-label for user message', () => {
    renderWithIntl(<ChatMessage role="user" text="Test" />)
    expect(screen.getByLabelText('Tu mensaje')).toBeInTheDocument()
  })

  it('renders aria-label for agent message', () => {
    renderWithIntl(<ChatMessage role="agent" text="Test" />)
    expect(screen.getByLabelText('Respuesta del asistente')).toBeInTheDocument()
  })

  it('renders children in rich content slot', () => {
    renderWithIntl(<ChatMessage><p>Rich content</p></ChatMessage>)
    expect(screen.getByText('Rich content')).toBeInTheDocument()
  })

  it('renders tool chip', () => {
    renderWithIntl(<ChatMessage tool={{ label: 'Buscando datos', icon: 'search', status: 'running' }} />)
    expect(screen.getByText('Buscando datos')).toBeInTheDocument()
  })

  it('shows streaming dots when streaming', () => {
    renderWithIntl(<ChatMessage text="Partial" streaming />)
    expect(screen.getByRole('status', { name: 'Escribiendo' })).toBeInTheDocument()
  })

  it('renders timestamp', () => {
    renderWithIntl(<ChatMessage text="Test" timestamp="14:30" />)
    expect(screen.getByText('14:30')).toBeInTheDocument()
  })
})
