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

describe('DatePicker — mode range', () => {
  it('dos clicks arman el rango ordenado y cierran', async () => {
    const onChange = vi.fn()
    renderWithIntl(<DatePicker mode="range" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /Seleccionar rango/ }))
    const day20 = screen.getByRole('button', { name: '20' })
    const day5 = screen.getByRole('button', { name: '5' })
    await userEvent.click(day20)
    await userEvent.click(day5)
    expect(onChange).toHaveBeenCalledTimes(1)
    const value = onChange.mock.calls[0][0] as string
    const [a, b] = value.split('|')
    expect(a < b).toBe(true)
    expect(a.endsWith('-05')).toBe(true)
    expect(b.endsWith('-20')).toBe(true)
  })

  it('muestra el rango formateado', () => {
    renderWithIntl(<DatePicker mode="range" value="2026-09-01|2026-09-15" />)
    expect(screen.getByText(/1 sept\s*–\s*15 sept 2026/)).toBeInTheDocument()
  })
})

describe('DatePicker — presets, min/max, disabled', () => {
  it('un preset asigna su valor y cierra', async () => {
    const onChange = vi.fn()
    renderWithIntl(
      <DatePicker
        mode="range"
        onChange={onChange}
        presets={[{ label: 'Últimos 30 días', value: '2026-08-02|2026-09-01' }]}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Seleccionar rango/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Últimos 30 días' }))
    expect(onChange).toHaveBeenCalledWith('2026-08-02|2026-09-01')
  })

  it('los días fuera de min/max quedan deshabilitados', async () => {
    renderWithIntl(<DatePicker value="2026-09-10" min="2026-09-05" max="2026-09-25" />)
    await userEvent.click(screen.getByRole('button', { name: /10 sept 2026/ }))
    expect(screen.getByRole('button', { name: '2' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '10' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '28' })).toBeDisabled()
  })

  it('disabled no abre el calendario', async () => {
    renderWithIntl(<DatePicker disabled />)
    await userEvent.click(screen.getByText(/Seleccionar fecha/))
    expect(screen.queryByRole('button', { name: 'Hoy' })).toBeNull()
  })

  it('id aterriza en el control focusable', () => {
    renderWithIntl(<DatePicker id="desde" />)
    expect(screen.getByRole('button', { name: /Seleccionar fecha/ })).toHaveAttribute('id', 'desde')
  })
})
