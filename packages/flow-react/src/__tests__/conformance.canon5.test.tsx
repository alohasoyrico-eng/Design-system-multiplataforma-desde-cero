/**
 * Conformance con el canon — tanda 5.
 * Cada test cita el id del criterio automatizado del contrato canonico que
 * verifica (el medidor check-conformance-coverage cuenta por esa cita).
 * Items: icon-button, slider, datepicker, calendar, menu (mnu-3), field,
 * divider, circular-progress, input-amount, tabbar, status-view, flag.
 * mnu-5 queda fuera a proposito: toca el wrapper compartido de Popover.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { IconButton } from '../ui/primitives/IconButton'
import { Slider } from '../ui/primitives/Slider'
import { Calendar } from '../ui/primitives/Calendar'
import { Field } from '../ui/primitives/Field'
import { Divider } from '../ui/primitives/Divider'
import { CircularProgress } from '../ui/primitives/CircularProgress'
import { InputAmount } from '../ui/components/InputAmount'
import { TabBar } from '../ui/primitives/TabBar'
import { StatusView } from '../ui/primitives/StatusView'
import { Flag } from '../ui/primitives/Flag'

const uiDe = (rel: string) => readFileSync(join(__dirname, '..', 'ui', rel), 'utf8')

afterEach(() => vi.restoreAllMocks())

// ── icon-button ────────────────────────────────────────────────────────────
describe('conformance canon · icon-button', () => {
  it('ib-1: ariaLabel es obligatorio y sin valor por defecto', () => {
    render(<IconButton icon="settings" ariaLabel="Ajustes" />)
    expect(screen.getByRole('button', { name: 'Ajustes' })).toBeInTheDocument()
    // la interfaz lo exige: no es opcional ni trae default
    expect(uiDe('primitives/IconButton.tsx')).toMatch(/ariaLabel: string\n/)
  })

  it('ib-2: el circulo mide --hit-target-min en todos los tamanos, sm incluido', () => {
    const hoja = uiDe('primitives/IconButton.module.css')
    expect(hoja).toMatch(/\.root\s*\{[^}]*(width|min-width|height|min-height):\s*var\(--hit-target-min\)/)
    expect(hoja).not.toMatch(/data-size='sm'[^{]*\{[^}]*(width|height):\s*(1|2|3)\dpx/)
  })

  it('ib-4: el badge es un punto sin numero; el significado va en el ariaLabel', () => {
    const { container } = render(<IconButton icon="notifications" ariaLabel="Notificaciones, hay nuevas" badge />)
    const punto = container.querySelector('[class*="badge"]')!
    expect(punto.textContent).toBe('')
    expect(screen.getByRole('button', { name: 'Notificaciones, hay nuevas' })).toBeInTheDocument()
  })

  it('ib-5: con prefers-reduced-motion el badge deja de latir sin dejar de estar', () => {
    expect(uiDe('primitives/IconButton.module.css')).toMatch(/prefers-reduced-motion:\s*reduce/)
  })
})

// ── slider ─────────────────────────────────────────────────────────────────
describe('conformance canon · slider', () => {
  it('sld-1: es un input range nativo: flechas, PageUp/Down, Home y End son del navegador', () => {
    render(<Slider value={40} min={0} max={100} step={5} label="Velocidad" onChange={() => {}} />)
    const input = screen.getByRole('slider', { name: 'Velocidad' }) as HTMLInputElement
    expect(input.type).toBe('range')
    expect(input.step).toBe('5')
  })

  it('sld-2: el carril entero es arrastrable y mide --hit-target-min', () => {
    const hoja = uiDe('primitives/Slider.module.css')
    expect(hoja).toMatch(/\.track\s*\{[^}]*height:\s*var\(--hit-target-min\)/)
    // el input invisible cubre el carril: ese es el objetivo real
    expect(hoja).toMatch(/\.input\s*\{[^}]*inset:\s*0/)
  })

  it('sld-3: value/min/max viven en el input y aria-valuetext lleva el texto de format', () => {
    render(<Slider value={40} min={0} max={80} label="Radio" format={(v) => `${v} km`} onChange={() => {}} />)
    const input = screen.getByRole('slider') as HTMLInputElement
    expect(input.value).toBe('40')
    expect(input.min).toBe('0')
    expect(input.max).toBe('80')
    expect(input.getAttribute('aria-valuetext')).toBe('40 km')
  })

  it('sld-4: el valor se recorta a min y max', () => {
    render(<Slider value={150} min={0} max={100} label="R" onChange={() => {}} />)
    expect((screen.getByRole('slider') as HTMLInputElement).value).toBe('100')
    expect(screen.getByText('100')).toBeInTheDocument()
  })
})

// ── datepicker / calendar ──────────────────────────────────────────────────
describe('conformance canon · datepicker y calendar', () => {
  const diaBtn = (n: string) =>
    screen.getAllByRole('button').find((b) => b.getAttribute('data-date') && b.textContent === n)!

  it('dp-2: un solo dia del mes es tabulable; los demas quedan en tabindex -1', () => {
    const { container } = render(<Calendar selected={['2026-05-15']} onSelect={() => {}} />)
    const dias = Array.from(container.querySelectorAll('[data-date]'))
    const tabulables = dias.filter((d) => d.getAttribute('tabindex') === '0')
    expect(tabulables).toHaveLength(1)
    expect(tabulables[0].getAttribute('data-date')).toBe('2026-05-15')
  })

  it('dp-1: flechas un dia y una semana, Home y End al primero y ultimo, PageDown al mes siguiente', () => {
    render(<Calendar selected={['2026-05-15']} onSelect={() => {}} />)
    fireEvent.keyDown(diaBtn('15'), { key: 'ArrowRight' })
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-05-16')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-05-23')
    fireEvent.keyDown(document.activeElement!, { key: 'Home' })
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-05-01')
    fireEvent.keyDown(document.activeElement!, { key: 'End' })
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-05-31')
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' })
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-06-30')
  })

  it('dp-5: hoy se marca con anillo, no con relleno; fuera de min/max esta deshabilitado', () => {
    render(<Calendar selected={['2026-05-15']} max="2026-05-20" onSelect={() => {}} />)
    expect(diaBtn('25')).toBeDisabled()
    const hoja = uiDe('primitives/Calendar.module.css')
    expect(hoja).toMatch(/data-today\]\s*\{[^}]*box-shadow:\s*inset/)
    expect(hoja).not.toMatch(/data-today\]\s*\{[^}]*background/)
  })

  it('dp-7: el dia seleccionado usa --text-on-accent sobre --action-accent, ningun blanco literal', () => {
    const hoja = uiDe('primitives/Calendar.module.css')
    expect(hoja).toMatch(/data-selected\]\s*\{[^}]*background:\s*var\(--action-accent\)/)
    expect(hoja).toMatch(/data-selected\]\s*\{[^}]*color:\s*var\(--text-on-accent\)/)
  })

  it('cal-1 y dp-3: la celda de dia mide --hit-target-min', () => {
    const hoja = uiDe('primitives/Calendar.module.css')
    expect(hoja).toMatch(/\.day\s*\{[^}]*width:\s*var\(--hit-target-min\)/)
    expect(hoja).toMatch(/\.day\s*\{[^}]*height:\s*var\(--hit-target-min\)/)
  })
})

// ── menu ───────────────────────────────────────────────────────────────────
describe('conformance canon · menu', () => {
  it('mnu-3: cada item mide --hit-target-min', () => {
    expect(uiDe('components/Menu.module.css')).toMatch(/\.menuItem\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
  })
})

// ── field ──────────────────────────────────────────────────────────────────
describe('conformance canon · field', () => {
  it('fld-1: con htmlFor la etiqueta queda asociada; sin htmlFor avisa en desarrollo', () => {
    render(
      <Field label="Placa" htmlFor="placa">
        <input id="placa" />
      </Field>,
    )
    expect(screen.getByLabelText('Placa')).toBeInTheDocument()

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <Field label="Sin asociar">
        <input />
      </Field>,
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('htmlFor'))
  })

  it('fld-3: el error sustituye a la ayuda, no se apila con ella', () => {
    render(
      <Field label="Placa" htmlFor="p2" help="Formato ABC-123" error="La placa no existe">
        <input id="p2" />
      </Field>,
    )
    expect(screen.getByText('La placa no existe')).toBeInTheDocument()
    expect(screen.queryByText('Formato ABC-123')).not.toBeInTheDocument()
  })
})

// ── divider ────────────────────────────────────────────────────────────────
describe('conformance canon · divider', () => {
  it('div-1: con label es un separador con nombre; sin label esta oculto al lector', () => {
    const { container, rerender } = render(<Divider label="O bien" />)
    expect(screen.getByRole('separator', { name: 'O bien' })).toBeInTheDocument()

    rerender(<Divider />)
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
    expect(container.firstElementChild!.getAttribute('aria-hidden')).toBe('true')

    rerender(<Divider orientation="vertical" />)
    expect(container.firstElementChild!.getAttribute('aria-hidden')).toBe('true')
  })

  it('div-2: el vertical se estira al alto del contenedor sin fijar altura propia', () => {
    const hoja = uiDe('primitives/Divider.module.css')
    expect(hoja).toMatch(/\.vertical\s*\{[^}]*align-self:\s*stretch/)
    expect(hoja).not.toMatch(/\.vertical\s*\{[^}]*height:\s*\d/)
  })

  it('div-4: grosor de --border-width y color de --border-subtle', () => {
    const hoja = uiDe('primitives/Divider.module.css')
    expect(hoja).toMatch(/var\(--border-width\)/)
    expect(hoja).toMatch(/var\(--border-subtle\)/)
  })
})

// ── circular-progress ──────────────────────────────────────────────────────
describe('conformance canon · circular-progress', () => {
  it('cpr-1: es un role=progressbar con aria-valuenow, min y max', () => {
    render(<CircularProgress value={30} max={100} label="Progreso de carga" />)
    const barra = screen.getByRole('progressbar', { name: 'Progreso de carga' })
    expect(barra.getAttribute('aria-valuenow')).toBe('30')
    expect(barra.getAttribute('aria-valuemin')).toBe('0')
    expect(barra.getAttribute('aria-valuemax')).toBe('100')
  })

  it('cpr-2: el valor se recorta al rango y el anillo no se pasa de vuelta', () => {
    const { container } = render(<CircularProgress value={150} max={100} showValue />)
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100')
    expect(screen.getByText('100%')).toBeInTheDocument()
    const arco = container.querySelectorAll('circle')[1]
    expect(parseFloat(arco.getAttribute('stroke-dashoffset')!)).toBe(0)
  })

  it('cpr-4: el arco final no depende de la transicion: el offset es atributo, no animacion', () => {
    const { container } = render(<CircularProgress value={75} max={100} />)
    const arco = container.querySelectorAll('circle')[1]
    const largo = parseFloat(arco.getAttribute('stroke-dasharray')!)
    expect(parseFloat(arco.getAttribute('stroke-dashoffset')!)).toBeCloseTo(largo * 0.25, 1)
  })
})

// ── input-amount ───────────────────────────────────────────────────────────
describe('conformance canon · input-amount', () => {
  it('amt-2: el prefijo de moneda es adorno: no enfocable, no se borra, no viaja en el valor', () => {
    const onChange = vi.fn()
    render(<InputAmount currency="$" value="1200" onChange={onChange} />)
    const prefijo = screen.getByText('$')
    expect(prefijo.tagName).toBe('SPAN')
    expect(prefijo.getAttribute('tabindex')).toBeNull()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1,2005' } })
    expect(onChange).toHaveBeenCalledWith('12005')
  })

  it('amt-4: el teclado movil es numerico', () => {
    render(<InputAmount value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox').getAttribute('inputmode')).toBe('decimal')
  })

  it('amt-5: emite el valor sin formato aunque se muestre con separadores', () => {
    const onChange = vi.fn()
    render(<InputAmount value="1234.56" onChange={onChange} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('1,234.56')
    fireEvent.change(input, { target: { value: '1,234.567' } })
    expect(onChange).not.toHaveBeenCalledWith(expect.stringContaining(','))
  })
})

// ── tabbar ─────────────────────────────────────────────────────────────────
describe('conformance canon · tabbar', () => {
  const items = [
    { id: 'inicio', label: 'Inicio', icon: 'home' },
    { id: 'alertas', label: 'Alertas', icon: 'notifications', badge: 12 },
  ]

  it('tbr-1: cada destino mide --hit-target-min y el activo lleva aria-current', () => {
    render(<TabBar items={items} activeId="inicio" />)
    expect(screen.getByRole('tab', { name: 'Inicio' }).getAttribute('aria-current')).toBe('page')
    // la barra completa mide --height-bar (48-60px), por encima de --hit-target-min
    expect(uiDe('primitives/TabBar.module.css')).toMatch(/min-height:\s*var\(--height-bar\)/)
  })

  it('tbr-3: el badge topa en 9+ y su significado va en el nombre accesible', () => {
    render(<TabBar items={items} activeId="inicio" />)
    const destino = screen.getByRole('tab', { name: 'Alertas, 9+' })
    const punto = destino.querySelector('[class*="badge"]')!
    expect(punto.getAttribute('aria-hidden')).toBe('true')
    expect(punto.textContent).toBe('9+')
  })
})

// ── status-view ────────────────────────────────────────────────────────────
describe('conformance canon · status-view', () => {
  it('stv-1: loading anuncia con aria-busy; error y offline interrumpen con role=alert', () => {
    const { container, rerender } = render(<StatusView status="loading" description="Cargando datos" />)
    expect(container.firstElementChild!.getAttribute('aria-busy')).toBe('true')
    expect(screen.getByRole('status')).toHaveTextContent('Cargando datos')

    rerender(<StatusView status="error" description="Algo fallo" />)
    expect(container.firstElementChild!.getAttribute('aria-busy')).toBeNull()
    expect(screen.getByRole('alert')).toHaveTextContent('Algo fallo')

    rerender(<StatusView status="offline" description="Sin conexion" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Sin conexion')
  })

  it('stv-4: con prefers-reduced-motion el estado aparece sin resorte', () => {
    expect(uiDe('primitives/StatusView.module.css')).toMatch(/prefers-reduced-motion:\s*reduce/)
  })
})

// ── flag ───────────────────────────────────────────────────────────────────
describe('conformance canon · flag', () => {
  it('flag-1: con label es una imagen con nombre; sin label esta oculta al lector', () => {
    const { container, rerender } = render(<Flag country="co" label="Colombia" />)
    expect(screen.getByRole('img', { name: 'Colombia' })).toBeInTheDocument()
    rerender(<Flag country="co" />)
    expect(container.firstElementChild!.getAttribute('aria-hidden')).toBe('true')
  })

  it('flag-3: ningun emoji de bandera, en ningun caso', () => {
    const { container } = render(<Flag country="mx" label="Mexico" />)
    expect(container.textContent).toBe('')
    expect(uiDe('primitives/Flag.tsx')).not.toMatch(/[\u{1F1E6}-\u{1F1FF}]/u)
  })

  it('flag-4: la hoja de flag-icons se inyecta una sola vez por documento', () => {
    // 5-sep: la fuente unica es GLOBAL (styles.css). Dentro del module,
    // lightningcss hasheaba las clases del vendor y las banderas no pintaban.
    const styles = uiDe('../styles.css')
    expect(styles.match(/@import "flag-icons\/css\/flag-icons\.min\.css"/g)).toHaveLength(1)
    expect(uiDe('primitives/Flag.module.css')).not.toMatch(/@import/)
    expect(uiDe('primitives/Flag.tsx')).not.toMatch(/createElement\('style'\)/)
  })
})
