import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Tabs } from '../Tabs'

const tabs = [
  { value: 'one', label: 'Uno' },
  { value: 'two', label: 'Dos' },
  { value: 'three', label: 'Tres' },
]

describe('Tabs', () => {
  it('renders a tablist role', () => {
    render(<Tabs items={tabs} value="one" />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders all tab items', () => {
    render(<Tabs items={tabs} value="one" />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('marks active tab with aria-selected', () => {
    render(<Tabs items={tabs} value="two" />)
    const tabEls = screen.getAllByRole('tab')
    expect(tabEls[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabEls[0]).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange with tab value on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={tabs} value="one" onChange={onChange} />)
    await user.click(screen.getByText('Tres'))
    expect(onChange).toHaveBeenCalledWith('three')
  })

  it('renders count when provided', () => {
    const withCount = [{ value: 'a', label: 'All', count: 42 }]
    render(<Tabs items={withCount} value="a" />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
