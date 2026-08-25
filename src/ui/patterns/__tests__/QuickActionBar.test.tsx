import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QuickActionBar } from '../QuickActionBar'

describe('QuickActionBar', () => {
  it('renders children', () => {
    render(
      <QuickActionBar>
        <button>Enviar</button>
        <button>Cancelar</button>
      </QuickActionBar>
    )
    expect(screen.getByText('Enviar')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('renders root element with correct class', () => {
    const { container } = render(
      <QuickActionBar>
        <span>Action</span>
      </QuickActionBar>
    )
    const root = container.querySelector('[class*="root"]')
    expect(root).toBeInTheDocument()
  })

  it('applies custom style', () => {
    const { container } = render(
      <QuickActionBar style={{ gap: '8px' }}>
        <span>Test</span>
      </QuickActionBar>
    )
    const root = container.querySelector('[class*="root"]')
    expect(root).toHaveStyle({ gap: '8px' })
  })
})
