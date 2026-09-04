import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { NipReveal } from '../NipReveal'

describe('NipReveal', () => {
  it('renders warning text', () => {
    render(<NipReveal digits="1234" warning="No compartas tu NIP" />)
    expect(screen.getByText('No compartas tu NIP')).toBeInTheDocument()
  })

  it('shows "Mostrar NIP" button initially', () => {
    render(<NipReveal digits="1234" />)
    expect(screen.getByRole('button', { name: 'Mostrar NIP' })).toBeInTheDocument()
  })

  it('does not show digits before clicking reveal', () => {
    render(<NipReveal digits="5678" />)
    expect(screen.queryByText('5')).not.toBeInTheDocument()
  })

  it('reveals digits after clicking button', async () => {
    const user = userEvent.setup()
    render(<NipReveal digits="1234" duration={60000} />)
    await user.click(screen.getByRole('button', { name: 'Mostrar NIP' }))
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('applies blur class to last digit when blurLast is true', async () => {
    const user = userEvent.setup()
    const { container } = render(<NipReveal digits="1234" blurLast duration={60000} />)
    await user.click(screen.getByRole('button', { name: 'Mostrar NIP' }))
    const blurred = container.querySelector('[class*="blur"]')
    expect(blurred).toBeInTheDocument()
    expect(blurred).toHaveTextContent('4')
  })
})
