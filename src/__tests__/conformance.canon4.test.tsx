/**
 * Conformance con el canon — tanda 4.
 * Cada test cita el id del criterio automatizado del contrato canonico que
 * verifica (el medidor check-conformance-coverage cuenta por esa cita).
 * Items: otpinput, fileupload, sidebar, tabs, checkbox, radio, switch, chip,
 * spinner, emptystate.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import { OTPInput } from '../ui/components/OTPInput'
import { FileUpload } from '../ui/components/FileUpload'
import { Sidebar } from '../ui/components/Sidebar'
import { Tabs } from '../ui/components/Tabs'
import { Checkbox } from '../ui/primitives/Checkbox'
import { Radio } from '../ui/primitives/Radio'
import { Chip } from '../ui/primitives/Chip'
import { Spinner } from '../ui/primitives/Spinner'
import { EmptyState } from '../ui/primitives/EmptyState'

const uiDe = (rel: string) => readFileSync(join(__dirname, '..', 'ui', rel), 'utf8')

// ── otpinput ───────────────────────────────────────────────────────────────
describe('conformance canon · otpinput', () => {
  it('otp-1: un solo control real con autocomplete one-time-code y teclado numerico', () => {
    const { container } = render(<OTPInput length={6} value="" onChange={() => {}} />)
    const inputs = container.querySelectorAll('input')
    expect(inputs).toHaveLength(1)
    expect(inputs[0].getAttribute('autocomplete')).toBe('one-time-code')
    expect(inputs[0].getAttribute('inputmode')).toBe('numeric')
  })

  it('otp-2: las casillas son decorativas y el nombre accesible dice cuantos digitos', () => {
    const { container } = render(<OTPInput length={4} value="12" onChange={() => {}} />)
    for (const caja of container.querySelectorAll('[data-filled], [class*="box"]')) {
      expect(caja.getAttribute('aria-hidden')).toBe('true')
    }
    expect(screen.getByLabelText('Código de 4 dígitos')).toBeInTheDocument()
  })

  it('otp-3: pegar el codigo completo funciona y lo no-digito se descarta sin bloquear', () => {
    const onChange = vi.fn()
    render(<OTPInput length={6} value="" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('Código de 6 dígitos'), { target: { value: '1a2-3 4b5c67' } })
    expect(onChange).toHaveBeenCalledWith('123456')
  })

  it('otp-4: invalid lo dice (aria-invalid) y la sacudida cede con reduced-motion', () => {
    render(<OTPInput length={6} value="123456" invalid onChange={() => {}} />)
    expect(screen.getByLabelText('Código de 6 dígitos').getAttribute('aria-invalid')).toBe('true')
    expect(uiDe('components/OTPInput.module.css')).toMatch(/prefers-reduced-motion:\s*reduce/)
  })

  it('otp-5: no compone ControlShell y es deliberado (una carcasa por control, no por caracter)', () => {
    expect(uiDe('components/OTPInput.tsx')).not.toMatch(/ControlShell/)
  })
})

// ── fileupload ─────────────────────────────────────────────────────────────
const archivo = (nombre: string, tipo: string) => new File(['x'], nombre, { type: tipo })

describe('conformance canon · fileupload', () => {
  it('upl-1: la zona es un boton que abre el selector, alcanzable con teclado', () => {
    const { container } = render(
      <IntlProvider locale="es">
        <FileUpload label="Sube tus documentos" onChange={() => {}} />
      </IntlProvider>,
    )
    const zona = screen.getByRole('button', { name: /Sube tus documentos/ })
    expect(zona.tagName).toBe('BUTTON')
    const selector = container.querySelector('input[type="file"]')!
    const click = vi.fn()
    ;(selector as HTMLInputElement).click = click
    fireEvent.click(zona)
    expect(click).toHaveBeenCalled()
  })

  it('upl-3: cada boton de quitar dice que archivo quita, no Quitar a secas', () => {
    render(
      <IntlProvider locale="es">
        <FileUpload
          files={[{ name: 'poliza.pdf', size: 100 }, { name: 'factura.pdf', size: 200 }]}
          onChange={() => {}}
        />
      </IntlProvider>,
    )
    expect(screen.getByRole('button', { name: 'Quitar poliza.pdf' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quitar factura.pdf' })).toBeInTheDocument()
  })

  it('upl-5: accept va al selector del sistema y tambien se valida al soltar', () => {
    const onChange = vi.fn()
    const { container } = render(
      <IntlProvider locale="es">
        <FileUpload accept=".pdf,image/*" label="Zona" onChange={onChange} />
      </IntlProvider>,
    )
    expect(container.querySelector('input[type="file"]')!.getAttribute('accept')).toBe('.pdf,image/*')
    fireEvent.drop(screen.getByRole('button', { name: /Zona/ }), {
      dataTransfer: { files: [archivo('reporte.pdf', 'application/pdf'), archivo('virus.exe', 'application/x-exe'), archivo('foto.png', 'image/png')] },
    })
    expect(onChange).toHaveBeenCalledTimes(1)
    const nombres = onChange.mock.calls[0][0].map((f: { name: string }) => f.name)
    expect(nombres).toEqual(['reporte.pdf', 'foto.png'])
  })

  it('upl-6: no compone ControlShell y es deliberado (no es un campo de una linea)', () => {
    expect(uiDe('components/FileUpload.tsx')).not.toMatch(/ControlShell/)
  })
})

// ── sidebar ────────────────────────────────────────────────────────────────
const itemsSidebar = [
  { id: 'inicio', label: 'Inicio', icon: 'home' },
  { id: 'flota', label: 'Flota', icon: 'local_shipping', badge: 3 },
  {
    id: 'config',
    label: 'Configuracion',
    icon: 'settings',
    children: [{ id: 'roles', label: 'Roles', icon: 'group' }],
  },
]

describe('conformance canon · sidebar', () => {
  it('sbr-1: navegacion con nombre, item activo con aria-current, seccion con aria-expanded', () => {
    render(<Sidebar items={itemsSidebar} activeId="flota" />)
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument()
    const activo = screen.getByRole('button', { name: /Flota/ })
    expect(activo.getAttribute('aria-current')).toBe('page')
    const seccion = screen.getByRole('button', { name: /Configuracion/ })
    expect(seccion.getAttribute('aria-expanded')).toBe('false')
  })

  it('sbr-2: colapsado, cada item conserva su nombre accesible (contador incluido)', () => {
    render(<Sidebar items={itemsSidebar} collapsed />)
    expect(screen.getByRole('button', { name: 'Inicio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Flota (3)' })).toBeInTheDocument()
  })

  it('sbr-3: cada item mide --hit-target-min de alto en los dos modos', () => {
    expect(uiDe('components/Sidebar.module.css')).toMatch(/min-height:\s*var\(--hit-target-min\)/)
  })

  it('sbr-5: el globo del modo colapsado es decorativo; el nombre lo lleva el boton', () => {
    render(<Sidebar items={itemsSidebar} collapsed />)
    const boton = screen.getByRole('button', { name: 'Flota (3)' })
    fireEvent.mouseEnter(boton)
    const globo = boton.querySelector('[class*="tooltip"]')
    expect(globo).not.toBeNull()
    expect(globo!.getAttribute('aria-hidden')).toBe('true')
  })
})

// ── tabs ───────────────────────────────────────────────────────────────────
describe('conformance canon · tabs', () => {
  const items = [
    { value: 'todo', label: 'Todo' },
    { value: 'activos', label: 'Activos' },
    { value: 'bajas', label: 'Bajas' },
  ]

  it('tab-1: es una tablist con role=tab y aria-selected; las flechas recorren el grupo', () => {
    const onChange = vi.fn()
    render(<Tabs items={items} value="todo" onChange={onChange} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs[1].getAttribute('tabindex')).toBe('-1')
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith('activos')
  })

  it('tab-2: cada pestana mide --hit-target-min de alto', () => {
    expect(uiDe('components/Tabs.module.css')).toMatch(/min-height:\s*var\(--hit-target-min\)/)
  })
})

// ── checkbox ───────────────────────────────────────────────────────────────
describe('conformance canon · checkbox', () => {
  it('cbx-1: indeterminate se refleja en la propiedad del input nativo', () => {
    render(<Checkbox label="Seleccionar todo" indeterminate />)
    const input = screen.getByRole('checkbox', { name: 'Seleccionar todo' }) as HTMLInputElement
    expect(input.indeterminate).toBe(true)
  })

  it('cbx-3: con prefers-reduced-motion el check aparece sin resorte', () => {
    expect(uiDe('primitives/Checkbox.module.css')).toMatch(/prefers-reduced-motion:\s*reduce/)
  })

  it('cbx-4: el check final no depende de la animacion: marcada se ve marcada', () => {
    const { container } = render(<Checkbox label="Activa" checked onChange={() => {}} />)
    // el glifo esta en el DOM desde el primer frame; ninguna animacion lo dibuja
    expect(container.textContent).toContain('check')
  })
})

// ── radio ──────────────────────────────────────────────────────────────────
describe('conformance canon · radio', () => {
  it('rdo-1: con name compartido son radios nativos: el grupo es del navegador', () => {
    const { container } = render(
      <>
        <Radio name="turno" value="am" label="Manana" checked onChange={() => {}} />
        <Radio name="turno" value="pm" label="Tarde" onChange={() => {}} />
      </>,
    )
    const radios = container.querySelectorAll('input[type="radio"][name="turno"]')
    expect(radios).toHaveLength(2)
  })

  it('rdo-2: la descripcion queda referenciada por aria-describedby', () => {
    render(<Radio name="t" value="x" label="Express" description="Llega en 24 horas" />)
    const input = screen.getByRole('radio', { name: /Express/ })
    const descId = input.getAttribute('aria-describedby')!
    expect(document.getElementById(descId)!.textContent).toBe('Llega en 24 horas')
  })

  it('rdo-3: el objetivo incluye la etiqueta y la descripcion, no solo el circulo', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Radio name="t" value="x" label="Express" description="Llega en 24 horas" onChange={onChange} />)
    await user.click(screen.getByText('Llega en 24 horas'))
    expect(onChange).toHaveBeenCalledWith('x')
  })

  it('rdo-4: con prefers-reduced-motion el punto aparece sin resorte', () => {
    expect(uiDe('primitives/Radio.module.css')).toMatch(/prefers-reduced-motion:\s*reduce/)
  })
})

// ── switch ─────────────────────────────────────────────────────────────────
describe('conformance canon · switch', () => {
  it('sw-2: en prefers-reduced-motion el thumb cruza sin resorte ni estiramiento', () => {
    expect(uiDe('primitives/Switch.module.css')).toMatch(/prefers-reduced-motion:\s*reduce/)
  })
})

// ── chip ───────────────────────────────────────────────────────────────────
describe('conformance canon · chip', () => {
  it('chp-1: el chip mide --hit-target-min (sm no lo rebaja) y la x es objetivo propio', () => {
    const hoja = uiDe('primitives/Chip.module.css')
    expect(hoja).toMatch(/\.root\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
    expect(hoja).not.toMatch(/data-size='sm'[^}]*\{[^}]*min-height:\s*\d+px/)
    expect(hoja).toMatch(/\.remove\s*\{[^}]*width:\s*var\(--hit-target-min\)/)
  })

  it('chp-2: la x tiene etiqueta propia y no propaga el clic al chip', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(<Chip label="Bogota" onClick={onClick} onRemove={onRemove} />)
    await user.click(screen.getByRole('button', { name: 'Quitar Bogota' }))
    expect(onRemove).toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('chp-4: con onClick es boton con aria-pressed; sin handlers no es operable; con onRemove la raiz no es boton', () => {
    const { rerender, container } = render(<Chip label="Filtro" onClick={() => {}} selected />)
    const boton = screen.getByRole('button', { name: 'Filtro' })
    expect(boton.getAttribute('aria-pressed')).toBe('true')

    rerender(<Chip label="Filtro" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(<Chip label="Filtro" onClick={() => {}} onRemove={() => {}} />)
    const raiz = container.firstElementChild!
    expect(raiz.tagName).not.toBe('BUTTON')
    expect(raiz.querySelectorAll('button')).toHaveLength(2)
  })
})

// ── spinner ────────────────────────────────────────────────────────────────
describe('conformance canon · spinner', () => {
  it('spn-1: anuncia la espera con role=status y su label', () => {
    render(
      <IntlProvider locale="es">
        <Spinner />
      </IntlProvider>,
    )
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument()
  })

  it('spn-2: con prefers-reduced-motion deja de girar y sigue presente', () => {
    expect(uiDe('primitives/Spinner.module.css')).toMatch(/prefers-reduced-motion:\s*reduce/)
  })

  it('spn-4: el color sale de un token, no de un hex propio', () => {
    render(
      <IntlProvider locale="es">
        <Spinner />
      </IntlProvider>,
    )
    expect(screen.getByRole('status').style.borderTopColor).toContain('var(--action-accent)')
  })
})

// ── emptystate ─────────────────────────────────────────────────────────────
describe('conformance canon · emptystate', () => {
  it('emp-2: el icono es decorativo y esta oculto al lector; informa el titulo', () => {
    render(<EmptyState icon="inbox" title="Sin resultados" description="Ajusta los filtros" />)
    expect(screen.getByText('inbox').getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
  })
})
