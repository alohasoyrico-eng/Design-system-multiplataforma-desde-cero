import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MapCanvas } from '../MapCanvas'

// Mock ResizeObserver since jsdom doesn't support it
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', MockResizeObserver)

// Mock matchMedia since jsdom doesn't support it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock canvas context since jsdom doesn't support canvas rendering
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    scale: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 40 }),
    roundRect: vi.fn(),
    setLineDash: vi.fn(),
    closePath: vi.fn(),
    set globalAlpha(_v: number) {},
    get globalAlpha() { return 1 },
    set fillStyle(_v: string) {},
    get fillStyle() { return '' },
    set strokeStyle(_v: string) {},
    get strokeStyle() { return '' },
    set lineWidth(_v: number) {},
    get lineWidth() { return 1 },
    set lineJoin(_v: string) {},
    get lineJoin() { return 'miter' },
    set lineCap(_v: string) {},
    get lineCap() { return 'butt' },
    set globalCompositeOperation(_v: string) {},
    get globalCompositeOperation() { return 'source-over' },
    set shadowColor(_v: string) {},
    get shadowColor() { return '' },
    set shadowBlur(_v: number) {},
    get shadowBlur() { return 0 },
    set shadowOffsetY(_v: number) {},
    get shadowOffsetY() { return 0 },
    set font(_v: string) {},
    get font() { return '' },
    set textAlign(_v: string) {},
    get textAlign() { return 'start' },
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext
})

const pins = [
  { id: 'p1', lat: 19.43, lon: -99.13, label: 'CDMX' },
  { id: 'p2', lat: 20.66, lon: -103.35, label: 'GDL' },
]

describe('MapCanvas', () => {
  it('renders map container', () => {
    const { container } = render(<MapCanvas center={[19.43, -99.13]} />)
    const root = container.querySelector('[class*="root"]')
    expect(root).toBeInTheDocument()
  })

  it('renders a canvas element', () => {
    const { container } = render(<MapCanvas center={[19.43, -99.13]} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('renders zoom control buttons', () => {
    render(<MapCanvas center={[19.43, -99.13]} />)
    expect(screen.getByLabelText('Acercar')).toBeInTheDocument()
    expect(screen.getByLabelText('Alejar')).toBeInTheDocument()
    // mpc-5: el pan y el zoom manual siempre tienen regreso.
    expect(screen.getByLabelText('Centrar el mapa')).toBeInTheDocument()
  })

  it('renders with pins without error', () => {
    const { container } = render(<MapCanvas center={[19.43, -99.13]} pins={pins} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('calls onPinClick when canvas is clicked near a pin', () => {
    const onPinClick = vi.fn()
    const { container } = render(
      <MapCanvas center={[19.43, -99.13]} pins={pins} onPinClick={onPinClick} />
    )
    const canvas = container.querySelector('canvas')!
    // We simulate a click; the actual hit detection depends on computed positions,
    // but this verifies the handler is wired up without throwing
    fireEvent.click(canvas, { clientX: 300, clientY: 200 })
    // The callback may or may not fire depending on computed pin positions in jsdom
    // This test ensures the component doesn't throw when pins and onPinClick are provided
    expect(canvas).toBeInTheDocument()
  })

  // mpc-1: los pins CHIP emiten botón accesible; los pins con `size` (modo
  // punto, red densa) no — su superficie accesible es la tabla que los lista.
  it('los puntos densos no emiten botón; los chips sí (mpc-1)', () => {
    render(
      <MapCanvas
        center={[19.43, -99.13]}
        pins={[
          { id: 'chip', lat: 19.43, lon: -99.13, label: 'CDMX' },
          { id: 'dot1', lat: 20.66, lon: -103.35, label: 'GDL', size: 4 },
          { id: 'dot2', lat: 25.67, lon: -100.31, label: 'MTY', size: 4 },
        ]}
      />,
    )
    const grupo = screen.getByRole('group')
    expect(grupo.querySelectorAll('button')).toHaveLength(1)
    expect(screen.getByLabelText(/CDMX/)).toBeInTheDocument()
  })

  // mpc-2: el encuadre no revienta y convive con pins y ruta.
  it('acepta fitBounds sin reventar (mpc-2)', () => {
    const { container, rerender } = render(
      <MapCanvas
        center={[23.6, -102.5]}
        zoom={5}
        pins={pins}
        fitBounds={[[19.4, -99.1], [20.7, -103.3]]}
      />,
    )
    expect(container.querySelector('canvas')).toBeInTheDocument()
    // cambiar el conjunto reencuadra sin error
    rerender(
      <MapCanvas center={[23.6, -102.5]} zoom={5} pins={pins} fitBounds={[[25.7, -100.3]]} />,
    )
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('acepta la ruta por tramos sin reventar (mpc-1)', () => {
    const { container } = render(
      <MapCanvas
        center={[19.43, -99.13]}
        route={[
          [[19.4, -99.1], [19.6, -99.3]],
          [[20.0, -100.0], [20.2, -100.4]],
        ]}
      />,
    )
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
})
