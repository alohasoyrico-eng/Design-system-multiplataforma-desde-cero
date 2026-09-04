import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Card } from '../Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('sets data-interactive when interactive', () => {
    const { container } = render(<Card interactive>Click me</Card>)
    expect(container.firstChild).toHaveAttribute('data-interactive', 'true')
  })

  it('does not set data-interactive by default', () => {
    const { container } = render(<Card>Static</Card>)
    expect(container.firstChild).not.toHaveAttribute('data-interactive')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card onClick={onClick}>Click me</Card>)
    await user.click(screen.getByText('Click me'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies custom padding via style', () => {
    const { container } = render(<Card padding={32}>Padded</Card>)
    expect(container.firstChild).toHaveStyle({ padding: '32px' })
  })

  it('applies custom style prop', () => {
    const { container } = render(<Card style={{ maxWidth: 400 }}>Styled</Card>)
    expect(container.firstChild).toHaveStyle({ maxWidth: '400px' })
  })
})
