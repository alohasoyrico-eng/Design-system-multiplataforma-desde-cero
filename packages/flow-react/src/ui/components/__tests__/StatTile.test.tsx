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
    const icon = container.querySelector('.flow-symbol')
    expect(icon).toHaveTextContent('directions_car')
  })

  it('renders without trend sparkline when not provided', () => {
    const { container } = render(<StatTile label="X" value="0" />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  // stt-8: sin tarjeta, para composiciones que ya tienen superficie propia.
  it('bare deja la cifra sin su tarjeta (stt-8)', () => {
    // La tarjeta se reconoce por la superficie que declara el Card.
    const conTarjeta = render(<StatTile label="Unidades" value="12" />)
    expect(conTarjeta.container.querySelector('[data-surface]')).toBeInTheDocument()
    conTarjeta.unmount()

    const desnudo = render(<StatTile label="Unidades" value="12" description="12 activas" bare />)
    expect(desnudo.container.querySelector('[data-surface]')).not.toBeInTheDocument()
    // la cifra, su rótulo y su nota siguen enteros
    expect(screen.getByText('Unidades')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('12 activas')).toBeInTheDocument()
  })
})
