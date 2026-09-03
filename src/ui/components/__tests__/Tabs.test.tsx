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

  it('sets roving tabindex on tabs', () => {
    render(<Tabs items={tabs} value="two" />)
    const tabEls = screen.getAllByRole('tab')
    expect(tabEls[0]).toHaveAttribute('tabindex', '-1')
    expect(tabEls[1]).toHaveAttribute('tabindex', '0')
    expect(tabEls[2]).toHaveAttribute('tabindex', '-1')
  })

  it('navigates with ArrowRight', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={tabs} value="one" onChange={onChange} />)
    screen.getAllByRole('tab')[0].focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('two')
  })

  it('navigates with ArrowLeft and wraps', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={tabs} value="one" onChange={onChange} />)
    screen.getAllByRole('tab')[0].focus()
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenCalledWith('three')
  })

  it('navigates with Home and End', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={tabs} value="two" onChange={onChange} />)
    screen.getAllByRole('tab')[1].focus()
    await user.keyboard('{Home}')
    expect(onChange).toHaveBeenCalledWith('one')
    onChange.mockClear()
    await user.keyboard('{End}')
    expect(onChange).toHaveBeenCalledWith('three')
  })
})

describe('Tabs variant="underline"', () => {
  it('sets data-variant="underline" on root', () => {
    render(<Tabs items={tabs} value="one" variant="underline" />)
    expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'underline')
  })

  it('marks active tab with aria-selected', () => {
    render(<Tabs items={tabs} value="two" variant="underline" />)
    const tabEls = screen.getAllByRole('tab')
    expect(tabEls[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onChange on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={tabs} value="one" variant="underline" onChange={onChange} />)
    await user.click(screen.getByText('Dos'))
    expect(onChange).toHaveBeenCalledWith('two')
  })

  it('renders icon when provided', () => {
    const withIcon = [{ value: 'a', label: 'Tab', icon: 'settings' }]
    const { container } = render(<Tabs items={withIcon} value="a" variant="underline" />)
    const icon = container.querySelector('.flow-symbol')
    expect(icon).toBeInTheDocument()
    expect(icon!.textContent).toBe('settings')
  })

  it('has keyboard navigation', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={tabs} value="one" variant="underline" onChange={onChange} />)
    screen.getAllByRole('tab')[0].focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('two')
  })
})
