import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { DatePicker } from '../DatePicker'

describe('DatePicker', () => {
  it('renders placeholder when no value', () => {
    renderWithIntl(<DatePicker />)
    expect(screen.getByText('Seleccionar fecha')).toBeInTheDocument()
  })

  it('renders custom placeholder', () => {
    renderWithIntl(<DatePicker placeholder="Elige una fecha" />)
    expect(screen.getByText('Elige una fecha')).toBeInTheDocument()
  })

  it('renders formatted date when value is provided', () => {
    renderWithIntl(<DatePicker value="2024-03-15" />)
    expect(screen.getByText(/15/)).toBeInTheDocument()
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('sets data-empty on display when no value', () => {
    const { container } = renderWithIntl(<DatePicker />)
    const display = container.querySelector('[data-empty]')
    expect(display).toBeInTheDocument()
  })

  it('opens calendar on click and selects a day', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    renderWithIntl(<DatePicker onChange={onChange} />)
    await user.click(screen.getByText('Seleccionar fecha'))
    expect(screen.getByText('Hoy')).toBeInTheDocument()
    await user.click(screen.getByText('15'))
    expect(onChange).toHaveBeenCalledWith(expect.stringContaining('-15'))
  })

  it('clears value with Borrar button', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    renderWithIntl(<DatePicker value="2024-03-15" onChange={onChange} />)
    await user.click(screen.getByText(/15/))
    await user.click(screen.getByText('Borrar'))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
