import { render, screen, act } from '@testing-library/react'
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

  // sgc-1: reetiquetar (otro idioma, una cifra viva) mueve el ancho sin mover
  // la cuenta de casillas; la píldora tiene que volver a medir.
  it('la píldora re-mide cuando la casilla cambia de ancho (sgc-1)', () => {
    let ancho = 120
    const anchoSpy = vi
      .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
      .mockImplementation(() => ancho)
    const izquierdaSpy = vi
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(() => 0)
    let disparar = () => {}
    class ObservadorFalso {
      constructor(cb: () => void) {
        disparar = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', ObservadorFalso)

    const { container, rerender } = render(<SegmentedControl items={items} value="day" />)
    const pildora = () => container.querySelector<HTMLElement>('[class*="indicator"]')
    expect(pildora()).toHaveStyle({ width: '120px' })

    // Mismas tres casillas, etiquetas más cortas: el efecto de medida NO se
    // vuelve a lanzar (sus dependencias no cambian) — lo hace el observador.
    ancho = 80
    rerender(
      <SegmentedControl
        items={[
          { value: 'day', label: 'D' },
          { value: 'week', label: 'S' },
          { value: 'month', label: 'M' },
        ]}
        value="day"
      />,
    )
    act(() => disparar())
    expect(pildora()).toHaveStyle({ width: '80px' })

    anchoSpy.mockRestore()
    izquierdaSpy.mockRestore()
    vi.unstubAllGlobals()
  })
})
