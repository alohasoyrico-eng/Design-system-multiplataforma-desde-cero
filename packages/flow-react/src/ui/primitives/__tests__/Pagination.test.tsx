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
    const { container } = render(<Pagination page={16} pages={40} />)
    expect(container.querySelectorAll('[data-ellipsis]').length).toBeGreaterThan(0)
  })

  // pag-7/pag-8: la ventana no encoge en los bordes — 15 casillas y los dos
  // extremos enseñan 5 páginas; la elipsis nunca desemboca en un número suelto.
  it('la ventana mantiene 15 casillas y 5 páginas por extremo (pag-8)', () => {
    render(<Pagination page={1} pages={582} />)
    for (const n of ['1', '2', '9', '578', '579', '580', '581', '582']) {
      expect(screen.getByText(n)).toBeInTheDocument()
    }
  })

  it('en medio, ambos extremos conservan sus 5 páginas (pag-8)', () => {
    render(<Pagination page={300} pages={582} />)
    for (const n of ['1', '5', '299', '300', '301', '578', '582']) {
      expect(screen.getByText(n)).toBeInTheDocument()
    }
    expect(screen.queryByText('6')).not.toBeInTheDocument()
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
