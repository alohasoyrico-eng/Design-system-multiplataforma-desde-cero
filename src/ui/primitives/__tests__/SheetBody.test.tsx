import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SheetBody } from '../SheetBody'

describe('SheetBody', () => {
  it('renders children', () => {
    render(<SheetBody><p>Sheet content</p></SheetBody>)
    expect(screen.getByText('Sheet content')).toBeInTheDocument()
  })

  it('sets data-center when center is true', () => {
    const { container } = render(<SheetBody center><p>Centered</p></SheetBody>)
    expect(container.firstChild).toHaveAttribute('data-center')
  })

  it('does not set data-center by default', () => {
    const { container } = render(<SheetBody><p>Default</p></SheetBody>)
    expect(container.firstChild).not.toHaveAttribute('data-center')
  })
})
