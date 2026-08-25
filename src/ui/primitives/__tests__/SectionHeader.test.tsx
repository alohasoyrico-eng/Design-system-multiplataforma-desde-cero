import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SectionHeader } from '../SectionHeader'

describe('SectionHeader', () => {
  it('renders children text', () => {
    render(<SectionHeader>Resumen</SectionHeader>)
    expect(screen.getByText('Resumen')).toBeInTheDocument()
  })

  it('renders trailing slot content', () => {
    render(
      <SectionHeader trailing={<button>Ver todo</button>}>
        Actividad
      </SectionHeader>,
    )
    expect(screen.getByText('Ver todo')).toBeInTheDocument()
  })

  it('does not render trailing when not provided', () => {
    const { container } = render(<SectionHeader>Titulo</SectionHeader>)
    // The trailing span should not exist
    const spans = container.querySelectorAll('span')
    // Only the title span should exist
    expect(spans).toHaveLength(1)
  })

  it('sets data-size attribute', () => {
    const { container } = render(<SectionHeader size="sm">Mini</SectionHeader>)
    expect(container.firstChild).toHaveAttribute('data-size', 'sm')
  })

  it('defaults size to md', () => {
    const { container } = render(<SectionHeader>Default</SectionHeader>)
    expect(container.firstChild).toHaveAttribute('data-size', 'md')
  })

  it('applies custom style', () => {
    const { container } = render(
      <SectionHeader style={{ marginBottom: 8 }}>Styled</SectionHeader>,
    )
    expect(container.firstChild).toHaveStyle({ marginBottom: '8px' })
  })
})
