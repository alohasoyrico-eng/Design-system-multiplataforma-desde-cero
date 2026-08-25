import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GanttChart } from '../GanttChart'

const tasks = [
  { id: '1', name: 'Diseño', start: '2024-01-01', end: '2024-01-15', progress: 0.8 },
  { id: '2', name: 'Desarrollo', start: '2024-01-10', end: '2024-02-01' },
]

describe('GanttChart', () => {
  it('renders task labels', () => {
    render(<GanttChart tasks={tasks} />)
    expect(screen.getByText('Diseño')).toBeInTheDocument()
    expect(screen.getByText('Desarrollo')).toBeInTheDocument()
  })

  it('renders bar elements for each task', () => {
    const { container } = render(<GanttChart tasks={tasks} />)
    const bars = container.querySelectorAll('[class*="bar"]')
    expect(bars.length).toBeGreaterThanOrEqual(2)
  })

  it('renders progress bar when progress is defined', () => {
    const { container } = render(<GanttChart tasks={tasks} />)
    const progressBars = container.querySelectorAll('[class*="progress"]')
    expect(progressBars.length).toBe(1)
  })

  it('renders empty state when no tasks', () => {
    render(<GanttChart tasks={[]} />)
    expect(screen.getByText('Sin datos para este periodo')).toBeInTheDocument()
  })
})
