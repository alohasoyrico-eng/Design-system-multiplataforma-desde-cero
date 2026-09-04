import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FilterBar } from '../FilterBar'

describe('FilterBar', () => {
  it('renders children', () => {
    render(
      <FilterBar>
        <span>Filtro A</span>
        <span>Filtro B</span>
      </FilterBar>,
    )
    expect(screen.getByText('Filtro A')).toBeInTheDocument()
    expect(screen.getByText('Filtro B')).toBeInTheDocument()
  })

  it('applies style prop', () => {
    const { container } = render(
      <FilterBar style={{ gap: 12 }}>
        <span>Test</span>
      </FilterBar>,
    )
    expect(container.firstChild).toHaveStyle({ gap: '12px' })
  })
})
