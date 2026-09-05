/**
 * Conformance con el canon — tanda 17: los cinco shells salen del limbo.
 * control-shell, listbox, overlay-shell, popover y toggle-control existían como
 * contratos pero no estaban registrados en architecture.json: sus criterios
 * nunca se midieron. Esta tanda los cita todos (los automatizados) tras
 * registrarlos, y con ellos aterrizan portal (pp-1), colisión (pp-2) y
 * dismissOnBackdrop (ov).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { ControlShell } from '../ui/primitives/ControlShell'
import { Listbox } from '../ui/primitives/Listbox'
import { OverlayShell } from '../ui/primitives/OverlayShell'
import { Popover } from '../ui/primitives/Popover'
import { ToggleControl } from '../ui/primitives/ToggleControl'
import { ToastHost, useToast, type ToastOptions } from '../ui/primitives/Toast'

const hoja = (rel: string) => readFileSync(join(__dirname, rel), 'utf8')

afterEach(() => {
  vi.restoreAllMocks()
})

// ── control-shell ──────────────────────────────────────────────────────────
describe('conformance canon · control-shell', () => {
  it('cs-1: el foco no cambia el grosor del borde — nada se mueve', () => {
    const css = hoja('../ui/primitives/ControlShell.module.css')
    // el borde nace con --border-width y el bloque de foco solo toca color y anillo
    expect(css).toMatch(/\.root\s*\{[^}]*border:\s*var\(--border-width\)/)
    const foco = css.match(/\.root:focus-within\s*\{([^}]*)\}/)![1]
    expect(foco).not.toMatch(/border-width|padding/)
    const invalido = css.match(/\.root\[data-invalid\]\s*\{([^}]*)\}/)![1]
    expect(invalido).not.toMatch(/border-width|padding/)
  })

  it('cs-2: el anillo aparece con foco dentro de la carcasa', () => {
    expect(hoja('../ui/primitives/ControlShell.module.css')).toMatch(
      /\.root:focus-within\s*\{[^}]*box-shadow:\s*var\(--focus-ring\)/,
    )
  })

  it('cs-4: disabled baja opacidad, y el control nativo tambien queda disabled', () => {
    const css = hoja('../ui/primitives/ControlShell.module.css')
    expect(css).toMatch(/\.root\[data-disabled\]\s*\{[^}]*opacity/)
    const { container } = render(
      <ControlShell disabled><input disabled aria-label="Campo" /></ControlShell>,
    )
    expect(container.firstChild).toHaveAttribute('data-disabled')
    expect(screen.getByLabelText('Campo')).toBeDisabled()
  })

  it('cs-5/cs-7: ningun tamano baja de --hit-target-min', () => {
    const css = hoja('../ui/primitives/ControlShell.module.css')
    expect(css).toMatch(/\.root\[data-size='sm'\]\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
    expect(css).toMatch(/\.root\[data-size='md'\]\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
    expect(css).toMatch(/\.root\[data-size='lg'\]\s*\{[^}]*min-height:\s*var\(--height-control-lg\)/)
  })

  it('cs-8: los adornos de leading y trailing se centran por su cuenta', () => {
    expect(hoja('../ui/primitives/ControlShell.module.css')).toMatch(
      /\.slot\s*\{[^}]*align-items:\s*center/,
    )
  })
})

// ── listbox ────────────────────────────────────────────────────────────────
describe('conformance canon · listbox', () => {
  const items = [
    { value: 'a', label: 'Activo' },
    { value: 'b', label: 'Baja' },
    { value: 'z', label: 'Zombi' },
  ]

  it('lb-1: role=listbox, role=option y aria-selected', () => {
    render(<Listbox items={items} value="b" id="lb" />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    const opciones = screen.getAllByRole('option')
    expect(opciones).toHaveLength(3)
    expect(opciones[1]).toHaveAttribute('aria-selected', 'true')
    expect(opciones[0]).toHaveAttribute('aria-selected', 'false')
  })

  it('lb-2: aria-activedescendant sigue al resaltado sin mover el foco', () => {
    render(<Listbox items={items} id="lb" />)
    const lista = screen.getByRole('listbox')
    fireEvent.keyDown(lista, { key: 'ArrowDown' })
    expect(lista).toHaveAttribute('aria-activedescendant', 'lb-opt-0')
    fireEvent.keyDown(lista, { key: 'ArrowDown' })
    expect(lista).toHaveAttribute('aria-activedescendant', 'lb-opt-1')
    // el foco no viajo a la fila
    expect(document.activeElement).not.toBe(screen.getAllByRole('option')[1])
  })

  it('lb-3: flechas, Home/End y typeahead navegan sin salirse de rango', () => {
    render(<Listbox items={items} id="lb" />)
    const lista = screen.getByRole('listbox')
    fireEvent.keyDown(lista, { key: 'End' })
    expect(lista).toHaveAttribute('aria-activedescendant', 'lb-opt-2')
    fireEvent.keyDown(lista, { key: 'ArrowDown' }) // envuelve al principio
    expect(lista).toHaveAttribute('aria-activedescendant', 'lb-opt-0')
    fireEvent.keyDown(lista, { key: 'Home' })
    expect(lista).toHaveAttribute('aria-activedescendant', 'lb-opt-0')
    fireEvent.keyDown(lista, { key: 'z' }) // typeahead
    expect(lista).toHaveAttribute('aria-activedescendant', 'lb-opt-2')
  })

  it('lb-5: filas de --hit-target-min — la lista tambien se usa con el dedo', () => {
    expect(hoja('../ui/primitives/Listbox.module.css')).toMatch(
      /min-height:\s*var\(--hit-target-min\)/,
    )
  })
})

// ── overlay-shell ──────────────────────────────────────────────────────────
describe('conformance canon · overlay-shell', () => {
  it('ov-1: el foco entra al panel al abrir y vuelve al disparador al cerrar', () => {
    const disparador = document.createElement('button')
    document.body.appendChild(disparador)
    disparador.focus()
    const { rerender } = render(
      <OverlayShell open><button>Dentro</button></OverlayShell>,
    )
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Dentro' }))
    rerender(<OverlayShell open={false}><button>Dentro</button></OverlayShell>)
    expect(document.activeElement).toBe(disparador)
    document.body.removeChild(disparador)
  })

  it('ov-2: Tab no escapa del panel', async () => {
    render(
      <OverlayShell open>
        <button>Primero</button>
        <button>Ultimo</button>
      </OverlayShell>,
    )
    screen.getByRole('button', { name: 'Ultimo' }).focus()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Primero' }))
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Ultimo' }))
  })

  it('ov-3: el fondo no hace scroll y el dialogo es modal para el lector', () => {
    render(<OverlayShell open><button>Dentro</button></OverlayShell>)
    expect(document.body.style.overflow).toBe('hidden')
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('ov-4: Escape cierra la capa mas alta unicamente', async () => {
    const cerrarDialogo = vi.fn()
    render(
      <OverlayShell open onClose={cerrarDialogo}>
        <Popover trigger={<button>Abrir menu</button>}>
          <div>Panel</div>
        </Popover>
      </OverlayShell>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    expect(screen.getByText('Panel')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    // el popover cayo; el dialogo sigue en pie
    expect(screen.queryByText('Panel')).toBeNull()
    expect(cerrarDialogo).not.toHaveBeenCalled()
  })

  it('ov-5: una sola familia de keyframes (flowOv*) para todas las alineaciones', () => {
    const css = hoja('../ui/primitives/OverlayShell.module.css')
    const animaciones = [...css.matchAll(/animation:\s*(\w+)/g)].map((m) => m[1])
    expect(animaciones.length).toBeGreaterThanOrEqual(4)
    for (const a of animaciones) expect(a).toMatch(/^flowOv/)
    // y los keyframes viven en tokens, no aqui (mot-5)
    expect(css).not.toMatch(/@keyframes/)
  })

  it('ov-6: con reduced-motion las duraciones colapsan — aparece sin desplazamiento', () => {
    const motion = hoja('../tokens/motion.css')
    const bloque = motion.match(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/)![1]
    expect(bloque).toMatch(/--dur-base:\s*1ms/)
    expect(bloque).toMatch(/--dur-fast:\s*1ms/)
  })

  it('dismissOnBackdrop=false: el backdrop no cierra un dialogo que exige decision', () => {
    const onClose = vi.fn()
    render(
      <OverlayShell open onClose={onClose} dismissOnBackdrop={false}>
        <button>Decidir</button>
      </OverlayShell>,
    )
    fireEvent.click(document.querySelector('[class*="backdrop"]')!)
    expect(onClose).not.toHaveBeenCalled()
  })
})

// ── popover ────────────────────────────────────────────────────────────────
describe('conformance canon · popover', () => {
  it('pp-1: el panel vive en portal — un overflow del ancestro no lo recorta', () => {
    const { container } = render(
      <div style={{ overflow: 'hidden', width: 10, height: 10 }}>
        <Popover trigger={<button>T</button>} open><div>Contenido</div></Popover>
      </div>,
    )
    const panel = screen.getByText('Contenido').closest('[data-surface]')!
    expect(container.contains(panel)).toBe(false)
    expect(document.body.contains(panel)).toBe(true)
  })

  it('pp-2: voltea al lado opuesto solo si alli cabe mejor', () => {
    // ancla pegada al borde inferior de la ventana; el panel mide 200px de alto
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      { top: 700, bottom: 730, left: 100, right: 160, width: 60, height: 30, x: 100, y: 700, toJSON: () => ({}) } as DOMRect,
    )
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(200)
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(120)
    render(
      <Popover trigger={<button>T</button>} open placement="bottom-start"><div>P</div></Popover>,
    )
    // abajo quedan ~38px y arriba ~694: voltea a top
    expect(document.querySelector('[data-side="top"]')).toBeInTheDocument()
  })

  it('pp-2: si no cabe en ningun lado, no se desliza sobre el ancla — scroll interno', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      { top: 380, bottom: 400, left: 100, right: 160, width: 60, height: 20, x: 100, y: 380, toJSON: () => ({}) } as DOMRect,
    )
    // mas alto que cualquier mitad de la ventana
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(2000)
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(120)
    render(
      <Popover trigger={<button>T</button>} open placement="bottom-start"><div>P</div></Popover>,
    )
    const drop = document.querySelector('[data-surface]') as HTMLElement
    expect(drop.style.maxHeight).not.toBe('')
    expect(drop.style.overflowY).toBe('auto')
  })

  it('pp-3: Escape cierra y devuelve el foco al ancla', async () => {
    render(
      <Popover trigger={<button>Ancla</button>}><div>P</div></Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Ancla' }))
    expect(screen.getByText('P')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('P')).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Ancla' }))
  })

  it('pp-3: un panel no interactivo cierra sin mover el foco, porque nunca lo tuvo', () => {
    const fuera = document.createElement('button')
    document.body.appendChild(fuera)
    fuera.focus()
    render(
      <Popover trigger={<button>Ancla</button>} open interactive={false}><div>P</div></Popover>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.activeElement).toBe(fuera)
    document.body.removeChild(fuera)
  })

  it('pp-4: clic fuera cierra; clic dentro no', async () => {
    render(
      <Popover trigger={<button>Ancla</button>}><div>Dentro</div></Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Ancla' }))
    fireEvent.mouseDown(screen.getByText('Dentro'))
    expect(screen.getByText('Dentro')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('Dentro')).toBeNull()
  })

  it('pp-7: Popover es el unico dueno de la animacion de entrada del panel', () => {
    expect(hoja('../ui/primitives/Popover.module.css')).toMatch(/\.drop\s*\{[^}]*animation:\s*flowScaleIn/)
    // el consumidor con surface=none no declara la suya (R3)
    expect(hoja('../ui/components/Menu.module.css')).not.toMatch(/animation:/)
  })
})

// ── toast-host ─────────────────────────────────────────────────────────────
describe('conformance canon · toast-host', () => {
  function Disparador({ opciones, texto = 'Disparar' }: { opciones: ToastOptions; texto?: string }) {
    const { show } = useToast()
    return <button onClick={() => show(opciones)}>{texto}</button>
  }

  it('th-1: apila con tope FIFO', () => {
    render(
      <ToastHost max={2}>
        <Disparador opciones={{ message: 'Uno', duration: null }} texto="A" />
        <Disparador opciones={{ message: 'Dos', duration: null }} texto="B" />
        <Disparador opciones={{ message: 'Tres', duration: null }} texto="C" />
      </ToastHost>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'A' }))
    fireEvent.click(screen.getByRole('button', { name: 'B' }))
    expect(screen.getByText('Uno')).toBeInTheDocument()
    expect(screen.getByText('Dos')).toBeInTheDocument()
    // el tercero echa al más viejo
    fireEvent.click(screen.getByRole('button', { name: 'C' }))
    expect(screen.queryByText('Uno')).toBeNull()
    expect(screen.getByText('Dos')).toBeInTheDocument()
    expect(screen.getByText('Tres')).toBeInTheDocument()
  })

  it('th-1: el aviso con duration desaparece solo', async () => {
    render(
      <ToastHost>
        <Disparador opciones={{ message: 'Efimero', duration: 25 }} />
      </ToastHost>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Disparar' }))
    expect(screen.getByText('Efimero')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Efimero')).toBeNull())
  })

  it('th-2: la accion retira el aviso al ejecutarse', () => {
    const onAction = vi.fn()
    render(
      <ToastHost>
        <Disparador opciones={{ message: 'Borrado', actionLabel: 'Deshacer', onAction, duration: null }} />
      </ToastHost>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Disparar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
    expect(onAction).toHaveBeenCalled()
    expect(screen.queryByText('Borrado')).toBeNull()
  })

  it('th-3: useToast fuera del host truena con mensaje claro', () => {
    const silencio = vi.spyOn(console, 'error').mockImplementation(() => {})
    function Huerfano() {
      useToast()
      return null
    }
    expect(() => render(<Huerfano />)).toThrow(/ToastHost/)
    silencio.mockRestore()
  })
})

// ── toggle-control ─────────────────────────────────────────────────────────
describe('conformance canon · toggle-control', () => {
  it('tg-1: el target incluye el label y el label alterna el estado', async () => {
    expect(hoja('../ui/primitives/ToggleControl.module.css')).toMatch(/min-height:\s*var\(--hit-target-min\)/)
    const onChange = vi.fn()
    render(
      <ToggleControl label="Notificaciones" onChange={onChange}><span /></ToggleControl>,
    )
    await userEvent.click(screen.getByText('Notificaciones'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('tg-2: hay un control nativo real detras, con nombre', () => {
    render(<ToggleControl label="Avisos" checked onChange={() => {}}><span /></ToggleControl>)
    const nativo = screen.getByRole('checkbox', { name: 'Avisos' })
    expect(nativo.tagName).toBe('INPUT')
    expect(nativo).toBeChecked()
  })

  it('tg-4: indeterminate vive en la propiedad del DOM', () => {
    render(<ToggleControl indeterminate onChange={() => {}}><span /></ToggleControl>)
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true)
  })
})
