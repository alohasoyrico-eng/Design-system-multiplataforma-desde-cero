import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Popover } from '../Popover'

describe('Popover', () => {
  it('renders trigger content', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Menu content</div>
      </Popover>,
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('does not show children by default', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Hidden content</div>
      </Popover>,
    )
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('shows children when open is true', () => {
    render(
      <Popover trigger={<button>Open</button>} open>
        <div>Visible content</div>
      </Popover>,
    )
    expect(screen.getByText('Visible content')).toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Popover trigger={<button>Toggle</button>}>
        <div>Popup content</div>
      </Popover>,
    )
    await user.click(screen.getByText('Toggle'))
    expect(screen.getByText('Popup content')).toBeInTheDocument()
  })

  it('calls onOpenChange when trigger is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Popover trigger={<button>Click</button>} open={false} onOpenChange={onOpenChange}>
        <div>Content</div>
      </Popover>,
    )
    await user.click(screen.getByText('Click'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('sets data-align attribute on dropdown', () => {
    const { container } = render(
      <Popover trigger={<button>Trigger</button>} open align="right">
        <div>Aligned</div>
      </Popover>,
    )
    const drop = container.querySelector('[data-align="right"]')
    expect(drop).toBeInTheDocument()
  })
})
