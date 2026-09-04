import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { HelpCenter } from '../HelpCenter'

const articles = [
  { id: '1', title: 'Cómo crear un viaje', category: 'Viajes', content: 'Paso a paso.', keywords: ['viaje', 'crear'] },
  { id: '2', title: 'Configurar alertas', category: 'Alertas', content: 'Activa tus alertas.' },
  { id: '3', title: 'Cambiar contraseña', category: 'Viajes', content: 'Desde ajustes.' },
]

describe('HelpCenter', () => {
  it('renders search input', () => {
    renderWithIntl(<HelpCenter articles={articles} />)
    expect(screen.getByLabelText('Buscar artículos de ayuda')).toBeInTheDocument()
  })

  it('renders category toggles', () => {
    renderWithIntl(<HelpCenter articles={articles} />)
    const toggles = screen.getAllByRole('button', { expanded: false })
    const labels = toggles.map((b) => b.textContent?.replace('chevron_right', '').trim())
    expect(labels).toContain('Viajes')
    expect(labels).toContain('Alertas')
  })

  it('search filters articles', async () => {
    const user = userEvent.setup()
    renderWithIntl(<HelpCenter articles={articles} />)
    await user.type(screen.getByLabelText('Buscar artículos de ayuda'), 'alertas')
    expect(screen.getByText('Configurar alertas')).toBeInTheDocument()
    expect(screen.getByText('1 resultado')).toBeInTheDocument()
  })

  it('shows first article content by default', () => {
    renderWithIntl(<HelpCenter articles={articles} />)
    expect(screen.getByText('Paso a paso.')).toBeInTheDocument()
  })

  it('expands category to show articles on click', async () => {
    const user = userEvent.setup()
    renderWithIntl(<HelpCenter articles={articles} />)
    const viajesToggle = screen.getAllByRole('button', { expanded: false }).find(
      (b) => b.textContent?.includes('Viajes'),
    )!
    await user.click(viajesToggle)
    // After expanding, article buttons appear in sidebar (first article title also shows in content panel)
    expect(screen.getAllByText('Cómo crear un viaje').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Cambiar contraseña')).toBeInTheDocument()
  })
})
