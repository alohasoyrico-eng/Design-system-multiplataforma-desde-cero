import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TransactionGroup } from '../TransactionGroup'

describe('TransactionGroup', () => {
  it('renders label', () => {
    render(<TransactionGroup label="Hoy"><p>Transactions</p></TransactionGroup>)
    expect(screen.getByText('Hoy')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <TransactionGroup label="Ayer">
        <p>Gasolina</p>
        <p>Peaje</p>
      </TransactionGroup>,
    )
    expect(screen.getByText('Gasolina')).toBeInTheDocument()
    expect(screen.getByText('Peaje')).toBeInTheDocument()
  })
})
