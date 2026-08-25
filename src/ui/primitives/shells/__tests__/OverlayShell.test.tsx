import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { OverlayShell } from '../OverlayShell'

describe('OverlayShell', () => {
  it('renders nothing when closed', () => {
    render(<OverlayShell open={false}><div>Content</div></OverlayShell>)
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders children when open', () => {
    render(<OverlayShell open><div>Content</div></OverlayShell>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders a dialog role', () => {
    render(<OverlayShell open><div>Modal</div></OverlayShell>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('sets aria-modal', () => {
    render(<OverlayShell open><div>Modal</div></OverlayShell>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(<OverlayShell open onClose={onClose}><button>Inside</button></OverlayShell>)
    const backdrop = container.querySelector('.backdrop')!
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on Escape key', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<OverlayShell open onClose={onClose}><button>Focus me</button></OverlayShell>)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('locks body scroll when open', () => {
    const { unmount } = render(<OverlayShell open><div>X</div></OverlayShell>)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
  })
})
