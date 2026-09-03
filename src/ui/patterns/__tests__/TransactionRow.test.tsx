import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TransactionRow } from '../TransactionRow'

describe('TransactionRow', () => {
  it('renders title and subtitle', () => {
    render(<TransactionRow title="Gasolina Premium" subtitle="Estación Centro" />)
    expect(screen.getByText('Gasolina Premium')).toBeInTheDocument()
    expect(screen.getByText('Estación Centro')).toBeInTheDocument()
  })

  it('renders formatted positive amount', () => {
    const { container } = render(<TransactionRow title="Abono" amount={150} />)
    const amountEl = container.querySelector('.amount')!
    expect(amountEl.textContent).toContain('+')
    expect(amountEl.textContent).toContain('$')
  })

  it('renders formatted negative amount', () => {
    const { container } = render(<TransactionRow title="Cargo" amount={-250.5} />)
    expect(container.firstChild).toHaveAttribute('data-negative')
  })

  it('shows pending label when pending', () => {
    render(<TransactionRow title="En proceso" pending />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('sets data-pending attribute', () => {
    const { container } = render(<TransactionRow title="Test" pending />)
    expect(container.firstChild).toHaveAttribute('data-pending')
  })

  it('renders category icon', () => {
    const { container } = render(<TransactionRow title="Gas" category="fuel" />)
    const icon = container.querySelector('.flow-symbol')
    expect(icon).toHaveTextContent('local_gas_station')
  })

  it('renders as button when onClick provided', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<TransactionRow title="Clickable" onClick={onClick} />)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders as div when no onClick', () => {
    render(<TransactionRow title="Static" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
