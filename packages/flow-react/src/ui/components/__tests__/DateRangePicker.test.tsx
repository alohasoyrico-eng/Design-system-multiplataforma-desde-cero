import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { DateRangePicker } from '../DatePicker'

describe('DateRangePicker', () => {
  it('renders placeholder when no value', () => {
    renderWithIntl(<DateRangePicker />)
    expect(screen.getByText('Seleccionar rango')).toBeInTheDocument()
  })

  it('renders custom placeholder', () => {
    renderWithIntl(<DateRangePicker placeholder="Rango personalizado" />)
    expect(screen.getByText('Rango personalizado')).toBeInTheDocument()
  })

  it('formats range value', () => {
    renderWithIntl(<DateRangePicker value="2024-03-10|2024-03-20" />)
    expect(screen.getByText(/10/)).toBeInTheDocument()
    expect(screen.getByText(/20/)).toBeInTheDocument()
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('selects a range with two clicks', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    renderWithIntl(<DateRangePicker onChange={onChange} />)
    await user.click(screen.getByText('Seleccionar rango'))
    await user.click(screen.getByText('10'))
    expect(onChange).not.toHaveBeenCalled()
    await user.click(screen.getByText('20'))
    expect(onChange).toHaveBeenCalledTimes(1)
    const val = onChange.mock.calls[0][0] as string
    expect(val).toContain('|')
    expect(val.split('|')[0]).toContain('-10')
    expect(val.split('|')[1]).toContain('-20')
  })

  it('shows hint after first click', async () => {
    const user = userEvent.setup()
    renderWithIntl(<DateRangePicker />)
    await user.click(screen.getByText('Seleccionar rango'))
    await user.click(screen.getByText('10'))
    expect(screen.getByText(/– …/)).toBeInTheDocument()
  })

  it('clears value with Borrar', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    renderWithIntl(<DateRangePicker value="2024-03-10|2024-03-20" onChange={onChange} />)
    await user.click(screen.getByText(/10/))
    await user.click(screen.getByText('Borrar'))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
