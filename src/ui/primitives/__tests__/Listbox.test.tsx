import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Listbox } from '../Listbox'

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
]

describe('Listbox', () => {
  it('renders a listbox role', () => {
    render(<Listbox items={items} />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('renders all options', () => {
    render(<Listbox items={items} />)
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('marks selected option with aria-selected', () => {
    render(<Listbox items={items} value="b" />)
    const options = screen.getAllByRole('option')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange when an option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Listbox items={items} onChange={onChange} />)
    await user.click(screen.getByText('Beta'))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: 'b', label: 'Beta' }))
  })

  it('renders custom content via renderItem', () => {
    render(
      <Listbox
        items={items}
        renderItem={(item) => <span data-testid="custom">{item.label}!</span>}
      />
    )
    expect(screen.getAllByTestId('custom')).toHaveLength(3)
  })
})
