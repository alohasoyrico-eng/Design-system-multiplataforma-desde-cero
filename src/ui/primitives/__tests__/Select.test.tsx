import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { Select } from '../Select'

describe('Select', () => {
  const options = ['Uno', 'Dos', 'Tres']

  it('renders with placeholder when no value', () => {
    renderWithIntl(<Select options={options} />)
    expect(screen.getByText('Seleccionar…')).toBeInTheDocument()
  })

  it('renders the combobox role', () => {
    renderWithIntl(<Select options={options} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('displays selected value label', () => {
    renderWithIntl(<Select options={options} value="Dos" />)
    expect(screen.getByText('Dos')).toBeInTheDocument()
  })

  it('opens listbox on trigger click', async () => {
    const user = userEvent.setup()
    renderWithIntl(<Select options={options} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('calls onChange when an option is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithIntl(<Select options={options} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Tres'))
    expect(onChange).toHaveBeenCalledWith('Tres')
  })

  it('accepts SelectOption objects', () => {
    const opts = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ]
    renderWithIntl(<Select options={opts} value="a" />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })
})

describe('Select — id para Field', () => {
  it('coloca el id en el combobox focusable', () => {
    renderWithIntl(<Select id="pais" options={['MX', 'CO']} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'pais')
  })
})

describe('Select · insetLabel', () => {
  it('la label integrada nombra el control y viaja en el trigger', () => {
    renderWithIntl(<Select insetLabel="Estado" options={[{ value: 'a', label: 'Activo' }]} />)
    const combo = screen.getByRole('combobox', { name: 'Estado' })
    expect(combo).toBeInTheDocument()
    expect(screen.getByText('Estado:')).toBeInTheDocument()
  })
})
