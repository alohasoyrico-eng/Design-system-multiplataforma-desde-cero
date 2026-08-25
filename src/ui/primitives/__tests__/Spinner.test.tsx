import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { Spinner } from '../Spinner'

describe('Spinner', () => {
  it('renders with status role', () => {
    renderWithIntl(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has default aria-label of Cargando', () => {
    renderWithIntl(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Cargando')
  })

  it('accepts custom label as aria-label', () => {
    renderWithIntl(<Spinner label="Loading" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading')
  })

  it('applies custom size', () => {
    renderWithIntl(<Spinner size={40} />)
    const el = screen.getByRole('status')
    expect(el).toHaveStyle({ width: '40px', height: '40px' })
  })

  it('defaults to size 20', () => {
    renderWithIntl(<Spinner />)
    const el = screen.getByRole('status')
    expect(el).toHaveStyle({ width: '20px', height: '20px' })
  })

  it('applies custom style prop', () => {
    renderWithIntl(<Spinner style={{ opacity: 0.5 }} />)
    const el = screen.getByRole('status')
    expect(el).toHaveStyle({ opacity: '0.5' })
  })
})
