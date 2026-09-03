import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { PaymentCard } from '../PaymentCard'

describe('PaymentCard', () => {
  it('renders holder name and last4 digits', () => {
    renderWithIntl(<PaymentCard holder="Juan Perez" last4="4321" />)
    expect(screen.getByText('Juan Perez')).toBeInTheDocument()
    expect(screen.getByText('4321')).toBeInTheDocument()
  })

  it('sets variant data attribute', () => {
    const { container } = renderWithIntl(<PaymentCard holder="Ana" last4="1111" variant="accent" />)
    expect(container.firstChild).toHaveAttribute('data-variant', 'accent')
  })

  it('defaults to ink variant', () => {
    const { container } = renderWithIntl(<PaymentCard holder="Ana" last4="1111" />)
    expect(container.firstChild).toHaveAttribute('data-variant', 'ink')
  })

  it('shows frozen overlay when frozen', () => {
    renderWithIntl(<PaymentCard holder="Ana" last4="1111" frozen />)
    expect(screen.getByText('Congelada')).toBeInTheDocument()
  })

  it('sets data-frozen attribute when frozen', () => {
    const { container } = renderWithIntl(<PaymentCard holder="Ana" last4="1111" frozen />)
    expect(container.firstChild).toHaveAttribute('data-frozen')
  })

  it('does not show frozen overlay when not frozen', () => {
    renderWithIntl(<PaymentCard holder="Ana" last4="1111" />)
    expect(screen.queryByText('Congelada')).not.toBeInTheDocument()
  })

  it('renders label when provided', () => {
    renderWithIntl(<PaymentCard holder="Ana" last4="1111" label="Corporativa" />)
    expect(screen.getByText('Corporativa')).toBeInTheDocument()
  })

  it('renders as button when onClick provided', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderWithIntl(<PaymentCard holder="Ana" last4="1111" onClick={onClick} />)
    const card = screen.getByRole('button')
    await user.click(card)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('has descriptive aria-label', () => {
    const { container } = renderWithIntl(<PaymentCard holder="Ana" last4="9999" frozen />)
    expect(container.firstChild).toHaveAttribute(
      'aria-label',
      'Tarjeta Ana terminación 9999, congelada',
    )
  })
})
