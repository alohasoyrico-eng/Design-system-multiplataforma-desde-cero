import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { Calendar } from '../Calendar'

describe('Calendar', () => {
  it('renders month label and day headers', () => {
    renderWithIntl(<Calendar />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(28)
  })

  it('highlights today', () => {
    const { container } = renderWithIntl(<Calendar />)
    const today = container.querySelector('[data-today]')
    expect(today).toBeInTheDocument()
  })

  it('highlights selected dates', () => {
    const { container } = renderWithIntl(<Calendar selected={['2026-08-15']} />)
    const selected = container.querySelector('[data-selected]')
    expect(selected).toBeInTheDocument()
    expect(selected?.textContent).toBe('15')
  })

  it('calls onSelect when a day is clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    renderWithIntl(<Calendar onSelect={onSelect} />)
    await user.click(screen.getByText('15'))
    expect(onSelect).toHaveBeenCalledWith(expect.stringContaining('-15'))
  })

  it('renders hint when provided', () => {
    renderWithIntl(<Calendar hint="10 ago – …" />)
    expect(screen.getByText('10 ago – …')).toBeInTheDocument()
  })

  it('renders footer buttons when callbacks provided', () => {
    renderWithIntl(<Calendar onClear={() => {}} onToday={() => {}} />)
    expect(screen.getByText('Borrar')).toBeInTheDocument()
    expect(screen.getByText('Hoy')).toBeInTheDocument()
  })

  it('calls onClear when Borrar clicked', async () => {
    const onClear = vi.fn()
    const user = userEvent.setup()
    renderWithIntl(<Calendar onClear={onClear} />)
    await user.click(screen.getByText('Borrar'))
    expect(onClear).toHaveBeenCalled()
  })

  it('navigates months', async () => {
    const user = userEvent.setup()
    renderWithIntl(<Calendar />)
    const nextBtn = screen.getByLabelText('Mes siguiente')
    await user.click(nextBtn)
    const prevBtn = screen.getByLabelText('Mes anterior')
    await user.click(prevBtn)
    await user.click(prevBtn)
  })

  it('highlights range between rangeStart and rangeEnd', () => {
    const { container } = renderWithIntl(
      <Calendar selected={['2026-08-10', '2026-08-20']} rangeStart="2026-08-10" rangeEnd="2026-08-20" />
    )
    const inRange = container.querySelectorAll('[data-in-range]')
    expect(inRange.length).toBeGreaterThan(0)
  })
})
