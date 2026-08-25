import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from '../Skeleton'

describe('Skeleton', () => {
  it('renders with default text variant', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('data-variant', 'text')
  })

  it('sets variant data attribute', () => {
    const { container } = render(<Skeleton variant="circle" />)
    expect(container.firstChild).toHaveAttribute('data-variant', 'circle')
  })

  it('renders all variant types', () => {
    const variants = ['text', 'title', 'card', 'circle'] as const
    variants.forEach((v) => {
      const { container, unmount } = render(<Skeleton variant={v} />)
      expect(container.firstChild).toHaveAttribute('data-variant', v)
      unmount()
    })
  })

  it('applies custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={40} />)
    expect(container.firstChild).toHaveStyle({ width: '200px', height: '40px' })
  })

  it('accepts string dimensions', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />)
    expect(container.firstChild).toHaveStyle({ width: '50%', height: '2rem' })
  })

  it('is aria-hidden', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
