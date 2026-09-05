import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ControlShell } from '../ControlShell'

describe('ControlShell', () => {
  // cs-4: disabled sets data-disabled and visual indicators
  it('sets data-disabled when disabled', () => {
    const { container } = render(<ControlShell disabled>content</ControlShell>)
    expect(container.firstChild).toHaveAttribute('data-disabled')
  })

  it('does not set data-disabled when enabled', () => {
    const { container } = render(<ControlShell>content</ControlShell>)
    expect(container.firstChild).not.toHaveAttribute('data-disabled')
  })

  it('invalid es el nombre canonico y error queda como alias', () => {
    const { container, unmount } = render(<ControlShell invalid>content</ControlShell>)
    expect(container.firstChild).toHaveAttribute('data-invalid')
    unmount()
    const { container: c2 } = render(<ControlShell error>content</ControlShell>)
    expect(c2.firstChild).toHaveAttribute('data-invalid')
  })

  // cs-5/cs-7: all sizes render
  it('renders all size variants', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    sizes.forEach((s) => {
      const { container, unmount } = render(<ControlShell size={s}>content</ControlShell>)
      expect(container.firstChild).toHaveAttribute('data-size', s)
      unmount()
    })
  })

  // cs-8: leading and trailing slots render
  it('renders leading slot content', () => {
    const { container } = render(
      <ControlShell leading={<span data-testid="lead">icon</span>}>input</ControlShell>
    )
    expect(container.querySelector('[data-testid="lead"]')).toBeInTheDocument()
  })

  it('renders trailing slot content', () => {
    const { container } = render(
      <ControlShell trailing={<span data-testid="trail">icon</span>}>input</ControlShell>
    )
    expect(container.querySelector('[data-testid="trail"]')).toBeInTheDocument()
  })

  it('renders children in content area', () => {
    const { container } = render(<ControlShell>My content</ControlShell>)
    expect(container).toHaveTextContent('My content')
  })
})
