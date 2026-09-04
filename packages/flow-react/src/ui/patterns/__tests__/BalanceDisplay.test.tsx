import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { BalanceDisplay } from '../BalanceDisplay'

describe('BalanceDisplay', () => {
  it('renders label and value', () => {
    renderWithIntl(<BalanceDisplay value="$1,200.00" />)
    expect(screen.getByText('Balance total')).toBeInTheDocument()
    expect(screen.getByText('$1,200.00')).toBeInTheDocument()
  })

  it('renders custom label', () => {
    renderWithIntl(<BalanceDisplay label="Saldo disponible" value="$500" />)
    expect(screen.getByText('Saldo disponible')).toBeInTheDocument()
  })

  it('masks value when hidden', () => {
    renderWithIntl(<BalanceDisplay value="$1,200.00" hidden onToggleHidden={() => {}} />)
    expect(screen.queryByText('$1,200.00')).not.toBeInTheDocument()
    expect(screen.getByText('••••••')).toBeInTheDocument()
  })

  it('shows toggle button when onToggleHidden is provided', () => {
    renderWithIntl(<BalanceDisplay value="$100" onToggleHidden={() => {}} />)
    expect(screen.getByRole('button', { name: 'Ocultar saldo' })).toBeInTheDocument()
  })

  it('toggle button shows "Mostrar saldo" when hidden', () => {
    renderWithIntl(<BalanceDisplay value="$100" hidden onToggleHidden={() => {}} />)
    expect(screen.getByRole('button', { name: 'Mostrar saldo' })).toBeInTheDocument()
  })

  it('does not show toggle button without onToggleHidden', () => {
    renderWithIntl(<BalanceDisplay value="$100" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onToggleHidden when toggle is clicked', async () => {
    const user = userEvent.setup()
    const onToggleHidden = vi.fn()
    renderWithIntl(<BalanceDisplay value="$100" onToggleHidden={onToggleHidden} />)
    await user.click(screen.getByRole('button', { name: 'Ocultar saldo' }))
    expect(onToggleHidden).toHaveBeenCalledOnce()
  })
})
