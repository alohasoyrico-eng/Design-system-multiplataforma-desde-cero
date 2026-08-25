import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CardCarousel } from '../CardCarousel'

// Mock scrollTo since jsdom doesn't support it
Element.prototype.scrollTo = vi.fn()

const cards = [
  <div key="a">Card A</div>,
  <div key="b">Card B</div>,
  <div key="c">Card C</div>,
]

describe('CardCarousel', () => {
  it('renders all children cards', () => {
    render(<CardCarousel>{cards}</CardCarousel>)
    expect(screen.getByText('Card A')).toBeInTheDocument()
    expect(screen.getByText('Card B')).toBeInTheDocument()
    expect(screen.getByText('Card C')).toBeInTheDocument()
  })

  it('renders navigation dots', () => {
    render(<CardCarousel>{cards}</CardCarousel>)
    const dots = screen.getAllByRole('tab')
    expect(dots.length).toBe(3)
  })

  it('marks first dot as selected by default', () => {
    render(<CardCarousel>{cards}</CardCarousel>)
    const dots = screen.getAllByRole('tab')
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
    expect(dots[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('marks controlled activeIndex dot as selected', () => {
    render(<CardCarousel activeIndex={1}>{cards}</CardCarousel>)
    const dots = screen.getAllByRole('tab')
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onChange when a dot is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CardCarousel onChange={onChange}>{cards}</CardCarousel>)
    const dots = screen.getAllByRole('tab')
    await user.click(dots[2])
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('renders dot aria-labels with card numbers', () => {
    render(<CardCarousel>{cards}</CardCarousel>)
    expect(screen.getByLabelText('Tarjeta 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Tarjeta 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Tarjeta 3')).toBeInTheDocument()
  })

  it('does not render dots for a single child', () => {
    render(<CardCarousel>{[<div key="a">Only card</div>]}</CardCarousel>)
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })
})
