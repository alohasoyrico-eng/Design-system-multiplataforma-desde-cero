import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ScaleLegend } from '../ScaleLegend'

describe('ScaleLegend', () => {
  it('renders end labels and the stepped scale (scl-1)', () => {
    render(<ScaleLegend minLabel="Más barato" maxLabel="Más caro" />)
    expect(screen.getByText('Más barato')).toBeInTheDocument()
    expect(screen.getByText('Más caro')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Escala de 5 tramos, de más barato a más caro',
    )
  })

  // scl-1: la geometría crece — cada paso es más alto que el anterior.
  it('los pasos crecen de menor a mayor (scl-1)', () => {
    render(<ScaleLegend minLabel="Menor" maxLabel="Mayor" />)
    const pasos = [...screen.getByRole('img').children] as HTMLElement[]
    const alturas = pasos.map((p) => parseInt(p.style.height, 10))
    expect(alturas).toHaveLength(5)
    for (let i = 1; i < alturas.length; i++) expect(alturas[i]).toBeGreaterThan(alturas[i - 1]!)
  })

  it('la casilla de ausencia va aparte y solo si se pide (scl-1)', () => {
    const { rerender } = render(<ScaleLegend minLabel="Menor" maxLabel="Mayor" />)
    expect(screen.queryByText('No publica')).not.toBeInTheDocument()
    rerender(<ScaleLegend minLabel="Menor" maxLabel="Mayor" emptyLabel="No publica" />)
    expect(screen.getByText('No publica')).toBeInTheDocument()
  })

  it('acepta colores propios', () => {
    render(<ScaleLegend minLabel="a" maxLabel="b" colors={['red', 'blue']} />)
    expect(screen.getByRole('img').children).toHaveLength(2)
  })
})
