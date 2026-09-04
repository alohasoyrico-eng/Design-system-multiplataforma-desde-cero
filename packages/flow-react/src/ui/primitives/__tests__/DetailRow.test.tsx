import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DetailRow } from '../DetailRow'

describe('DetailRow', () => {
  it('renders label and value', () => {
    render(<DetailRow label="Monto" value="$100.00" />)
    expect(screen.getByText('Monto')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })

  it('sets data-mono on value when mono is true', () => {
    const { container } = render(<DetailRow label="ID" value="abc-123" mono />)
    const valueEl = container.querySelector('[data-mono]')
    expect(valueEl).toBeInTheDocument()
    expect(valueEl).toHaveTextContent('abc-123')
  })

  it('does not set data-mono by default', () => {
    const { container } = render(<DetailRow label="Nombre" value="Juan" />)
    expect(container.querySelector('[data-mono]')).not.toBeInTheDocument()
  })

  it('accepts ReactNode as label and value', () => {
    render(
      <DetailRow
        label={<strong>Etiqueta</strong>}
        value={<em>Valor</em>}
      />,
    )
    expect(screen.getByText('Etiqueta')).toBeInTheDocument()
    expect(screen.getByText('Valor')).toBeInTheDocument()
  })

  it('applies custom style', () => {
    const { container } = render(
      <DetailRow label="X" value="Y" style={{ marginTop: 8 }} />,
    )
    expect(container.firstChild).toHaveStyle({ marginTop: '8px' })
  })
})
