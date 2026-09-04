import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Divider } from '../Divider'

describe('Divider', () => {
  it('la linea decorativa esta oculta al lector (div-1)', () => {
    const { container } = render(<Divider />)
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('el vertical sin label tambien es decorativo', () => {
    const { container } = render(<Divider orientation="vertical" />)
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders label text when provided', () => {
    render(<Divider label="O" />)
    expect(screen.getByText('O')).toBeInTheDocument()
    expect(screen.getByRole('separator')).toHaveAttribute('aria-label', 'O')
  })

  it('renders as hr when horizontal without label', () => {
    const { container } = render(<Divider />)
    expect(container.querySelector('hr')).toBeInTheDocument()
  })

  it('applies custom style', () => {
    const { container } = render(<Divider style={{ marginTop: 16 }} />)
    expect(container.firstElementChild).toHaveStyle({ marginTop: '16px' })
  })
})
