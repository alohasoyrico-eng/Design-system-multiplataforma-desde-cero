import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SmallMultiples } from '../SmallMultiples'

const items = [
  { id: 'a', label: 'Norte', values: [10, 20, 30, 25] },
  { id: 'b', label: 'Sur', values: [5, 15, 50, 45] },
  { id: 'c', label: 'Este', values: [8, 12, 18, 22] },
]

describe('SmallMultiples', () => {
  it('renders item labels', () => {
    render(<SmallMultiples items={items} />)
    expect(screen.getByText('Norte')).toBeInTheDocument()
    expect(screen.getByText('Sur')).toBeInTheDocument()
    expect(screen.getByText('Este')).toBeInTheDocument()
  })

  it('renders sparkline SVGs for each item', () => {
    const { container } = render(<SmallMultiples items={items} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(3)
  })

  it('renders the last value for each item', () => {
    render(<SmallMultiples items={items} />)
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('22')).toBeInTheDocument()
  })

  it('applies format function to values', () => {
    const format = (v: number) => `$${v}`
    render(<SmallMultiples items={items} format={format} />)
    expect(screen.getByText('$25')).toBeInTheDocument()
    expect(screen.getByText('$45')).toBeInTheDocument()
  })

  it('highlights outlier items', () => {
    const isOutlier = (item: { id: string }) => item.id === 'b'
    const { container } = render(<SmallMultiples items={items} isOutlier={isOutlier} />)
    const outlierValues = container.querySelectorAll('[data-outlier]')
    expect(outlierValues.length).toBe(1)
  })

  it('renders outlier icon for outlier items', () => {
    const isOutlier = (item: { id: string }) => item.id === 'b'
    const { container } = render(<SmallMultiples items={items} isOutlier={isOutlier} />)
    const outlierIcons = container.querySelectorAll('[class*="outlierIcon"]')
    expect(outlierIcons.length).toBe(1)
  })

  it('calls onSelect when a card is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<SmallMultiples items={items} onSelect={onSelect} />)
    await user.click(screen.getByText('Norte'))
    expect(onSelect).toHaveBeenCalledWith(items[0])
  })

  it('renders empty state when items is empty', () => {
    render(<SmallMultiples items={[]} />)
    expect(screen.getByText('Sin datos para este periodo')).toBeInTheDocument()
  })
})
