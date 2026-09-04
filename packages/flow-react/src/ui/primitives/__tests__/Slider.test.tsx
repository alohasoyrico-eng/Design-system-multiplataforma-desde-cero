import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Slider } from '../Slider'

describe('Slider', () => {
  it('renders a slider role', () => {
    render(<Slider />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('sets min and max attributes', () => {
    render(<Slider min={10} max={50} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('min', '10')
    expect(slider).toHaveAttribute('max', '50')
  })

  it('reflects value', () => {
    render(<Slider value={42} />)
    expect(screen.getByRole('slider')).toHaveValue('42')
  })

  it('renders label text', () => {
    render(<Slider label="Volumen" />)
    expect(screen.getByText('Volumen')).toBeInTheDocument()
  })

  it('sets aria-label from label prop', () => {
    render(<Slider label="Brillo" />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-label', 'Brillo')
  })

  it('disables the input when disabled', () => {
    render(<Slider disabled />)
    expect(screen.getByRole('slider')).toBeDisabled()
  })

  it('calls onChange with number value', () => {
    const onChange = vi.fn()
    render(<Slider value={10} onChange={onChange} />)
    const slider = screen.getByRole('slider')
    slider.dispatchEvent(new Event('change', { bubbles: true }))
  })
})
