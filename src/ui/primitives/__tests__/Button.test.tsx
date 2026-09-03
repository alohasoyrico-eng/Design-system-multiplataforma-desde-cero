import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  // btn-3: loading disables the element
  it('is disabled when loading', () => {
    render(<Button loading>Guardar</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  // btn-3: two rapid clicks blocked
  it('does not fire onClick when loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>Guardar</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  // btn-6: initial render is complete (no dependency on animation frame)
  it('renders text content without animation dependency', () => {
    render(<Button>Enviar</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Enviar')
  })

  it('shows spinner icon when loading', () => {
    const { container } = render(<Button loading>Guardar</Button>)
    expect(container.querySelector('.spinner')).toBeInTheDocument()
  })

  it('hides primary icon when loading', () => {
    const { container } = render(<Button icon="add" loading>Crear</Button>)
    const icons = container.querySelectorAll('.icon')
    expect(icons.length).toBe(0)
  })

  it('renders with all variant data attributes', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'] as const
    variants.forEach((v) => {
      const { unmount } = render(<Button variant={v}>OK</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', v)
      unmount()
    })
  })

  it('renders with all size data attributes', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    sizes.forEach((s) => {
      const { unmount } = render(<Button size={s}>OK</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('data-size', s)
      unmount()
    })
  })

  it('forwards onClick handler', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies disabled attribute', () => {
    render(<Button disabled>Nope</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

describe('Button · variant link (D3)', () => {
  it('acepta variant link y lo declara en data-variant', () => {
    render(<Button variant="link">Ver todo</Button>)
    expect(screen.getByRole('button', { name: 'Ver todo' })).toHaveAttribute('data-variant', 'link')
  })
})
