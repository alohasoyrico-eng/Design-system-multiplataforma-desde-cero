import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { QuickAction } from '../QuickAction'

describe('QuickAction', () => {
  it('renders icon and label', () => {
    const { container } = render(<QuickAction icon="send" label="Enviar" />)
    expect(screen.getByText('Enviar')).toBeInTheDocument()
    const icon = container.querySelector('.flow-symbol')
    expect(icon).toHaveTextContent('send')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<QuickAction icon="send" label="Enviar" onClick={onClick} />)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('disables button when disabled', () => {
    render(<QuickAction icon="send" label="Enviar" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('sets data-active when active', () => {
    render(<QuickAction icon="send" label="Enviar" active />)
    expect(screen.getByRole('button')).toHaveAttribute('data-active')
  })

  it('does not set data-active when not active', () => {
    render(<QuickAction icon="send" label="Enviar" />)
    expect(screen.getByRole('button')).not.toHaveAttribute('data-active')
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<QuickAction icon="send" label="Enviar" disabled onClick={onClick} />)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
