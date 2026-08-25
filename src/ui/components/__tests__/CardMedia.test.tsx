import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CardMedia } from '../CardMedia'

describe('CardMedia', () => {
  it('renders title and description', () => {
    render(<CardMedia title="Product" description="A great product" />)
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('A great product')).toBeInTheDocument()
  })

  it('renders title as h3', () => {
    render(<CardMedia title="Heading" />)
    expect(screen.getByRole('heading', { level: 3, name: 'Heading' })).toBeInTheDocument()
  })

  it('renders image as background-image div', () => {
    const { container } = render(<CardMedia image="https://example.com/photo.jpg" title="Photo" />)
    const imgDiv = container.querySelector('[class*="image"]')
    expect(imgDiv).toHaveStyle({ backgroundImage: 'url(https://example.com/photo.jpg)' })
  })

  it('renders as button when interactive', () => {
    render(<CardMedia interactive title="Click me" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders as div when not interactive', () => {
    const { container } = render(<CardMedia title="Static" />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('calls onClick when interactive card is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<CardMedia interactive onClick={onClick} title="Clickable" />)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('sets data-interactive attribute', () => {
    const { container } = render(<CardMedia interactive title="Interactive" />)
    expect(container.firstChild).toHaveAttribute('data-interactive', 'true')
  })

  it('renders children in body', () => {
    render(<CardMedia><p>Custom content</p></CardMedia>)
    expect(screen.getByText('Custom content')).toBeInTheDocument()
  })

  it('renders custom media slot', () => {
    render(<CardMedia media={<video data-testid="vid" />} title="Video card" />)
    expect(screen.getByTestId('vid')).toBeInTheDocument()
  })
})
