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

  it('opens date input on click', async () => {
    const user = userEvent.setup()
    const { container } = renderWithIntl(<DatePicker />)
    await user.click(screen.getByText('Seleccionar fecha'))
    const dateInput = container.querySelector('input[type="date"]')
    expect(dateInput).toBeInTheDocument()
  })

  it('does not show date input by default', () => {
    const { container } = renderWithIntl(<DatePicker />)
    const dateInput = container.querySelector('input[type="date"]')
    expect(dateInput).not.toBeInTheDocument()
  })
})
