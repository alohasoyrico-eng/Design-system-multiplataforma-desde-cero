import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('renders page numbers', () => {
    render(<Pagination page={1} pages={5} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('marks current page with aria-current', () => {
    render(<Pagination page={3} pages={5} />)
    const current = screen.getByText('3')
    expect(current).toHaveAttribute('aria-current', 'page')
  })

  it('calls onChange when a page is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={1} pages={5} onChange={onChange} />)
    await user.click(screen.getByText('2'))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('disables previous button on first page', () => {
    render(<Pagination page={1} pages={5} />)
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination page={5} pages={5} />)
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
  })

  it('calls onChange with previous page on prev click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={3} pages={5} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Anterior' }))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('calls onChange with next page on next click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={3} pages={5} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('renders ellipsis for many pages (inerte, fuera del orden de tabulacion)', () => {
    const { container } = render(<Pagination page={5} pages={10} />)
    expect(container.querySelectorAll('[data-ellipsis]').length).toBeGreaterThan(0)
  })

  // pag-7: la ventana no encoge en los bordes — siempre 7 casillas si hay más de 7 páginas.
  it('la ventana mantiene 7 casillas cerca del borde (pag-7)', () => {
    render(<Pagination page={1} pages={582} />)
    for (const n of ['1', '2', '3', '4', '5', '582']) {
      expect(screen.getByText(n)).toBeInTheDocument()
    }
  })

  // pag-7: primera/última saltan a los extremos cuando la lista se trunca.
  it('primera y última página existen y saltan (pag-7)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={40} pages={582} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Primera página' }))
    expect(onChange).toHaveBeenCalledWith(1)
    await user.click(screen.getByRole('button', { name: 'Última página' }))
    expect(onChange).toHaveBeenCalledWith(582)
  })

  // pag-7: con pocas páginas los saltos no aportan y no se dibujan.
  it('sin truncado no hay primera/última (pag-7)', () => {
    render(<Pagination page={2} pages={5} />)
    expect(screen.queryByRole('button', { name: 'Primera página' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Última página' })).not.toBeInTheDocument()
  })
})
