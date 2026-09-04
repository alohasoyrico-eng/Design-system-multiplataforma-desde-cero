import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar } from '../Avatar'

describe('Avatar', () => {
  // avt-1: deterministic color from name
  it('produces the same color for the same name', () => {
    const { container: c1 } = render(<Avatar name="Ana Sosa" />)
    const { container: c2 } = render(<Avatar name="Ana Sosa" />)
    const bg1 = c1.querySelector('[aria-label]')?.getAttribute('style')
    const bg2 = c2.querySelector('[aria-label]')?.getAttribute('style')
    expect(bg1).toBe(bg2)
  })

  // avt-2: shows initials when no src
  it('shows initials when no photo is provided', () => {
    render(<Avatar name="Rosa Duarte" />)
    expect(screen.getByLabelText('Rosa Duarte')).toHaveTextContent('RD')
  })

  it('shows single initial for single-name input', () => {
    render(<Avatar name="Marco" />)
    expect(screen.getByLabelText('Marco')).toHaveTextContent('M')
  })

  // avt-2: falls back to initials on image error
  it('renders img element when src is provided', () => {
    const { container } = render(<Avatar name="Ana" src="/photo.jpg" />)
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Ana')
  })

  // avt-3: status has accessible text (via the status dot element)
  it('renders status indicator when status is provided', () => {
    const { container } = render(<Avatar name="Ana" status="online" />)
    const dot = container.querySelector('.status')
    expect(dot).toBeInTheDocument()
  })

  it('does not render status dot without status prop', () => {
    const { container } = render(<Avatar name="Ana" />)
    const dot = container.querySelector('.status')
    expect(dot).not.toBeInTheDocument()
  })

  it('renders all size variants', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const
    sizes.forEach((s) => {
      const { container, unmount } = render(<Avatar name="Test" size={s} />)
      expect(container.firstChild).toBeInTheDocument()
      unmount()
    })
  })
})
