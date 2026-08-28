import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { GlobalSearch } from '../GlobalSearch'

describe('GlobalSearch', () => {
  it('renders search input with combobox role', () => {
    renderWithIntl(<GlobalSearch open />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('displays value in input', () => {
    renderWithIntl(<GlobalSearch open value="test" />)
    expect(screen.getByRole('combobox')).toHaveValue('test')
  })

  it('calls onValueChange on typing', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderWithIntl(<GlobalSearch open value="" onValueChange={onValueChange} />)
    await user.type(screen.getByRole('combobox'), 'a')
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('renders results as options', () => {
    const results = [
      { id: '1', label: 'Unidad A', group: 'Unidades' },
      { id: '2', label: 'Conductor B', group: 'Conductores' },
    ]
    renderWithIntl(<GlobalSearch open value="x" results={results} />)
    expect(screen.getByText('Unidad A')).toBeInTheDocument()
    expect(screen.getByText('Conductor B')).toBeInTheDocument()
  })

  it('shows empty state when no results and value entered', () => {
    renderWithIntl(<GlobalSearch open value="xyz" results={[]} />)
    expect(screen.getByText(/Sin resultados/)).toBeInTheDocument()
  })

  it('renders nothing when mode is palette and closed', () => {
    const { container } = renderWithIntl(<GlobalSearch open={false} mode="palette" />)
    expect(container.querySelector('[role="combobox"]')).not.toBeInTheDocument()
  })

  it('renders shortcut badge inside search bar', () => {
    renderWithIntl(<GlobalSearch open />)
    const kbd = document.querySelector('kbd')
    expect(kbd).toBeInTheDocument()
  })

  it('renders suggestion chips when provided and no query', () => {
    renderWithIntl(<GlobalSearch open suggestions={['density', 'focus ring']} value="" />)
    expect(screen.getByText('density')).toBeInTheDocument()
    expect(screen.getByText('focus ring')).toBeInTheDocument()
  })

  it('hides suggestion chips when query is entered', () => {
    renderWithIntl(<GlobalSearch open suggestions={['density']} value="test" />)
    expect(screen.queryByText('density')).not.toBeInTheDocument()
  })

  it('clicking suggestion chip calls onValueChange', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderWithIntl(<GlobalSearch open suggestions={['density']} value="" onValueChange={onValueChange} />)
    await user.click(screen.getByText('density'))
    expect(onValueChange).toHaveBeenCalledWith('density')
  })
})
