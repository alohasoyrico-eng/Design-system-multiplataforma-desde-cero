import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatTile } from '../StatTile'

describe('StatTile', () => {
  it('renders label and value', () => {
    render(<StatTile label="UNIDADES" value="128" />)
    expect(screen.getByText('UNIDADES')).toBeInTheDocument()
    expect(screen.getByText('128')).toBeInTheDocument()
  })

  it('renders delta with trend icon', () => {
    const { container } = render(<StatTile label="Gasto" value="$248k" delta="+8%" />)
    expect(screen.getByText('+8%')).toBeInTheDocument()
    expect(container.querySelector('.delta')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    const { container } = render(<StatTile label="Viajes" value="412" icon="directions_car" />)
    const icon = container.querySelector('.flow-icon')
    expect(icon).toHaveTextContent('directions_car')
  })

  it('renders without trend sparkline when not provided', () => {
    const { container } = render(<StatTile label="X" value="0" />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })
})
