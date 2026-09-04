import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SegmentedControl } from '../SegmentedControl'

const items = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
]

describe('SegmentedControl', () => {
  it('renders all segment items', () => {
    render(<SegmentedControl items={items} value="day" />)
    expect(screen.getByText('Día')).toBeInTheDocument()
    expect(screen.getByText('Semana')).toBeInTheDocument()
    expect(screen.getByText('Mes')).toBeInTheDocument()
  })

  it('marks selected item with aria-selected', () => {
    render(<SegmentedControl items={items} value="week" />)
    expect(screen.getByRole('tab', { name: 'Semana' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Día' })).toHaveAttribute('aria-selected', 'false')
  })

  it('sets data-active on selected item', () => {
    render(<SegmentedControl items={items} value="week" />)
    expect(screen.getByRole('tab', { name: 'Semana' })).toHaveAttribute('data-active')
    expect(screen.getByRole('tab', { name: 'Día' })).not.toHaveAttribute('data-active')
  })

  it('calls onChange when segment clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SegmentedControl items={items} value="day" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Mes' }))
    expect(onChange).toHaveBeenCalledWith('month')
  })

  it('renders with role tablist', () => {
    render(<SegmentedControl items={items} value="day" />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('sets tabIndex 0 on selected and -1 on others', () => {
    render(<SegmentedControl items={items} value="day" />)
    expect(screen.getByRole('tab', { name: 'Día' })).toHaveAttribute('tabIndex', '0')
    expect(screen.getByRole('tab', { name: 'Semana' })).toHaveAttribute('tabIndex', '-1')
  })
})
