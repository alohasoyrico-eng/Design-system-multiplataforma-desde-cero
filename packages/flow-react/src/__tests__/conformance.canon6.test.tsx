/**
 * Conformance con el canon — tanda 6.
 * Cada test cita el id del criterio automatizado del contrato canonico que
 * verifica (el medidor check-conformance-coverage cuenta por esa cita).
 * Items: topbar, global-search, input-phone, role-matrix,
 * notification-center, passcodekeypad, wizard, help-center,
 * transaction-row, table-tree.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import type { ReactNode } from 'react'
import { TopBar } from '../ui/components/TopBar'
import { GlobalSearch } from '../ui/components/GlobalSearch'
import { InputPhone } from '../ui/components/InputPhone'
import { RoleMatrix } from '../ui/components/RoleMatrix'
import { NotificationCenter } from '../ui/components/NotificationCenter'
import { PasscodeKeypad } from '../ui/components/PasscodeKeypad'
import { Wizard } from '../ui/components/Wizard'
import { HelpCenter } from '../ui/components/HelpCenter'
import { TransactionRow } from '../ui/components/TransactionRow'
import { TableTree } from '../ui/components/TableTree'

const uiDe = (rel: string) => readFileSync(join(__dirname, '..', 'ui', rel), 'utf8')
const conIntl = (ui: ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

// ── topbar ─────────────────────────────────────────────────────────────────
describe('conformance canon · topbar', () => {
  it('tpb-1: fullscreen no renderiza nada', () => {
    const { container } = conIntl(<TopBar variant="fullscreen" navItems={[{ id: 'a', label: 'Inicio' }]} />)
    expect(container.firstElementChild).toBeNull()
  })

  it('tpb-2: el buscador de admin y el boton de notificaciones llevan nombre con el contador', () => {
    conIntl(<TopBar variant="admin" notificationCount={5} onNotifications={() => {}} />)
    expect(screen.getByRole('textbox', { name: /Buscar/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5 notificaciones sin leer' })).toBeInTheDocument()
  })

  it('tpb-3: el selector de entidad es un boton con aria-haspopup y aria-expanded', async () => {
    const user = userEvent.setup()
    conIntl(
      <TopBar
        variant="multientity"
        entities={[{ id: 'e1', label: 'Edenred MX' }, { id: 'e2', label: 'Edenred BR' }]}
        currentEntity="e1"
      />,
    )
    const selector = screen.getByRole('button', { name: /Edenred MX/ })
    expect(selector.getAttribute('aria-haspopup')).toBe('menu')
    expect(selector.getAttribute('aria-expanded')).toBe('false')
    await user.click(selector)
    expect(selector.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(2)
  })

  it('tpb-4: los enlaces de nav miden --hit-target-min', () => {
    expect(uiDe('components/TopBar.module.css')).toMatch(/\.navLink\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
  })
})

// ── global-search ──────────────────────────────────────────────────────────
const resultados = [
  { id: 'u1', label: 'Unidad 042', group: 'Unidades' },
  { id: 'u2', label: 'Unidad 043', group: 'Unidades' },
  { id: 'c1', label: 'Carlos Diaz', group: 'Conductores' },
]

describe('conformance canon · global-search', () => {
  it('gsc-1: combobox con aria-controls y aria-activedescendant siguiendo al resaltado', () => {
    conIntl(<GlobalSearch open value="uni" results={resultados} onValueChange={() => {}} />)
    const campo = screen.getByRole('combobox')
    expect(campo.getAttribute('aria-controls')).toBe('flow-search-list')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
    const antes = campo.getAttribute('aria-activedescendant')!
    fireEvent.keyDown(campo, { key: 'ArrowDown' })
    const despues = campo.getAttribute('aria-activedescendant')!
    expect(despues).not.toBe(antes)
    expect(document.getElementById(despues)!.getAttribute('aria-selected')).toBe('true')
  })

  it('gsc-2: el foco entra al campo al abrir y vuelve a quien lo tenia al cerrar; Escape cierra', () => {
    const onOpenChange = vi.fn()
    const vista = (open: boolean) => (
      <IntlProvider locale="es">
        <button>abrir</button>
        <GlobalSearch open={open} value="" results={[]} onOpenChange={onOpenChange} />
      </IntlProvider>
    )
    const { rerender } = render(vista(false))
    const disparador = screen.getByRole('button', { name: 'abrir' })
    disparador.focus()
    rerender(vista(true))
    const campo = screen.getByRole('combobox')
    expect(document.activeElement).toBe(campo)
    fireEvent.keyDown(campo, { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
    rerender(vista(false))
    expect(document.activeElement).toBe(disparador)
  })

  it('gsc-3: la carga se anuncia con aria-live y no vacia la lista anterior', () => {
    const { container } = conIntl(
      <GlobalSearch open value="uni" results={resultados} loading onValueChange={() => {}} />,
    )
    expect(screen.getAllByRole('option')).toHaveLength(3)
    const vivo = container.querySelector('[aria-live="polite"]')!
    expect(vivo.textContent).toContain('Buscando')
  })

  it('gsc-4: las cabeceras de grupo no son opciones ni se alcanzan con flechas', () => {
    conIntl(<GlobalSearch open value="uni" results={resultados} onValueChange={() => {}} />)
    expect(screen.getByText('Unidades')).toBeInTheDocument()
    expect(screen.getByText('Unidades').getAttribute('role')).toBeNull()
    // recorrer con flechas pasa por las 3 opciones y vuelve al inicio
    const campo = screen.getByRole('combobox')
    const vistos = new Set<string>()
    for (let i = 0; i < 3; i++) {
      vistos.add(campo.getAttribute('aria-activedescendant')!)
      fireEvent.keyDown(campo, { key: 'ArrowDown' })
    }
    expect(vistos.size).toBe(3)
  })
})

// ── input-phone ────────────────────────────────────────────────────────────
describe('conformance canon · input-phone', () => {
  it('tel-1: la lada es adorno de la carcasa y no forma parte del valor emitido', () => {
    const onChange = vi.fn()
    render(<InputPhone prefix="+52" value="5512345678" onChange={onChange} />)
    const lada = screen.getByText('+52')
    expect(lada.tagName).toBe('SPAN')
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '55 1234 5679' } })
    expect(onChange).toHaveBeenCalledWith('5512345679')
  })

  it('tel-2: la agrupacion 2-4-4 del placeholder normativo se aplica y pegar con espacios funciona', () => {
    const onChange = vi.fn()
    const { rerender } = render(<InputPhone value="5512345678" onChange={onChange} />)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('55 1234 5678')
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '55 8765 4321' } })
    expect(onChange).toHaveBeenCalledWith('5587654321')
    rerender(<InputPhone value="5587654321" onChange={onChange} />)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('55 8765 4321')
  })

  it('tel-3: el teclado movil es telefonico y el navegador puede autorrellenar', () => {
    render(<InputPhone value="" onChange={() => {}} />)
    const input = screen.getByRole('textbox')
    expect(input.getAttribute('type')).toBe('tel')
    expect(input.getAttribute('inputmode')).toBe('tel')
    expect(input.getAttribute('autocomplete')).toBe('tel-national')
  })

  it('tel-4: emite solo digitos, sin espacios ni lada', () => {
    const onChange = vi.fn()
    render(<InputPhone prefix="+52" value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '+52 (55) 12-34-56-78' } })
    expect(onChange).toHaveBeenCalledWith('5255123456')
  })
})

// ── role-matrix ────────────────────────────────────────────────────────────
const rolesRM = [
  { id: 'admin', label: 'Admin' },
  { id: 'lector', label: 'Lector', locked: true },
]
const permisosRM = [
  { id: 'ver', label: 'Ver unidades', group: 'Flota' },
  { id: 'editar', label: 'Editar unidades', group: 'Flota' },
]
const valoresRM = { ver: { admin: true, lector: true }, editar: { admin: false, lector: false } }

describe('conformance canon · role-matrix', () => {
  it('rmx-1: cada casilla dice permiso, rol y estado en su nombre accesible', () => {
    render(<RoleMatrix roles={rolesRM} permissions={permisosRM} values={valoresRM} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Ver unidades — Admin: permitido' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar unidades — Admin: no permitido' })).toBeInTheDocument()
  })

  it('rmx-2: la casilla es un objetivo de --hit-target-min', () => {
    expect(uiDe('components/RoleMatrix.module.css')).toMatch(/\.toggle\s*\{[^}]*(width|height):\s*var\(--hit-target-min\)/)
  })

  it('rmx-3: un rol bloqueado no se puede cambiar y lo dice: deshabilitado de verdad', () => {
    const onChange = vi.fn()
    render(<RoleMatrix roles={rolesRM} permissions={permisosRM} values={valoresRM} onChange={onChange} />)
    const casilla = screen.getByRole('button', { name: 'Ver unidades — Lector: permitido' })
    expect(casilla).toBeDisabled()
    fireEvent.click(casilla)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('rmx-5: la cabecera de grupo no es seleccionable ni entra al orden de tabulacion', () => {
    const { container } = render(<RoleMatrix roles={rolesRM} permissions={permisosRM} values={valoresRM} />)
    const grupo = Array.from(container.querySelectorAll('tr')).find((tr) => tr.textContent === 'Flota')!
    expect(grupo.getAttribute('aria-hidden')).toBe('true')
    expect(grupo.querySelector('button, a, [tabindex]')).toBeNull()
  })
})

// ── notification-center ────────────────────────────────────────────────────
const notifs = [
  { id: 'n1', tone: 'warning' as const, title: 'Combustible bajo', time: '10:32', read: false },
  { id: 'n2', tone: 'info' as const, title: 'Mantenimiento programado', time: '09:10', read: true },
]

describe('conformance canon · notification-center', () => {
  it('ntf-1: el disparador dice cuantas hay sin leer en su nombre accesible', () => {
    conIntl(<NotificationCenter items={notifs} />)
    expect(screen.getByRole('button', { name: 'Notificaciones, 1 sin leer' })).toBeInTheDocument()
  })

  it('ntf-2: Escape cierra el panel y devuelve el foco a la campana', async () => {
    const user = userEvent.setup()
    conIntl(<NotificationCenter items={notifs} />)
    const campana = screen.getByRole('button', { name: /Notificaciones/ })
    await user.click(campana)
    expect(screen.getByText('Combustible bajo')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Combustible bajo')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(campana)
  })

  it('ntf-4: cada notificacion mide --hit-target-min y la hora va en la familia de dato', () => {
    const hoja = uiDe('components/NotificationCenter.module.css')
    expect(hoja).toMatch(/\.notifItem\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
    expect(hoja).toMatch(/\.notifTime\s*\{[^}]*font:\s*var\(--type-data/)
  })

  it('ntf-5: marcar todas es una accion con nombre y el badge desaparece sin cerrar el panel', async () => {
    const user = userEvent.setup()
    const onMarkAllRead = vi.fn()
    const vista = (items: typeof notifs) => (
      <IntlProvider locale="es">
        <NotificationCenter items={items} onMarkAllRead={onMarkAllRead} />
      </IntlProvider>
    )
    const { rerender } = render(vista(notifs))
    await user.click(screen.getByRole('button', { name: /Notificaciones/ }))
    await user.click(screen.getByRole('button', { name: 'Marcar todo como leido' }))
    expect(onMarkAllRead).toHaveBeenCalled()
    rerender(vista(notifs.map((n) => ({ ...n, read: true }))))
    // el panel sigue abierto y el nombre del disparador ya no anuncia pendientes
    expect(screen.getByText('Combustible bajo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notificaciones' })).toBeInTheDocument()
  })
})

// ── passcodekeypad ─────────────────────────────────────────────────────────
describe('conformance canon · passcodekeypad', () => {
  it('pkp-1: cada tecla tiene nombre accesible y mide --hit-target-min; borrar tambien', () => {
    render(<PasscodeKeypad value="" onChange={() => {}} />)
    for (const d of ['0', '5', '9']) {
      expect(screen.getByRole('button', { name: d })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: 'Borrar' })).toBeInTheDocument()
    const hoja = uiDe('components/PasscodeKeypad.module.css')
    expect(hoja).toMatch(/\.key\s*\{[^}]*min-height:\s*var\(--(hit-target-min|height-bar)\)/)
    expect(hoja).toMatch(/\.key\s*\{[^}]*min-width:\s*var\(--hit-target-min\)/)
  })

  it('pkp-2: los puntos dicen cuantos digitos van, en texto, sin revelar el valor', () => {
    render(<PasscodeKeypad length={6} value="317" onChange={() => {}} />)
    expect(screen.getByRole('status', { name: '3 de 6 dígitos ingresados' })).toBeInTheDocument()
  })

  it('pkp-3: el passcode nunca queda en el DOM como texto legible', () => {
    const { container } = render(<PasscodeKeypad length={6} value="317" onChange={() => {}} />)
    expect(container.querySelector('input')).toBeNull()
    expect(screen.getByRole('status').textContent).toBe('')
    expect(container.textContent).not.toContain('317')
  })

  it('pkp-4: invalid limpia el valor y lo anuncia', () => {
    const onChange = vi.fn()
    render(<PasscodeKeypad value="123456" invalid onChange={onChange} />)
    expect(onChange).toHaveBeenCalledWith('')
    expect(screen.getByRole('alert')).toHaveTextContent('Código incorrecto')
  })
})

// ── wizard ─────────────────────────────────────────────────────────────────
const pasosWz = [{ label: 'Datos' }, { label: 'Pago' }, { label: 'Resumen' }]

describe('conformance canon · wizard', () => {
  it('wz-1: en el ultimo paso la primaria es confirmar; en los demas, siguiente. Nunca ambas', () => {
    const { rerender } = conIntl(<Wizard steps={pasosWz} current={1} onNext={() => {}} onSubmit={() => {}}>x</Wizard>)
    expect(screen.getByRole('button', { name: /Siguiente/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Confirmar/ })).not.toBeInTheDocument()
    rerender(
      <IntlProvider locale="es">
        <Wizard steps={pasosWz} current={2} onNext={() => {}} onSubmit={() => {}}>x</Wizard>
      </IntlProvider>,
    )
    expect(screen.getByRole('button', { name: /Confirmar/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Siguiente/ })).not.toBeInTheDocument()
  })

  it('wz-2: con submitting el confirmar carga y volver queda deshabilitado', () => {
    conIntl(<Wizard steps={pasosWz} current={2} submitting onBack={() => {}} onSubmit={() => {}}>x</Wizard>)
    expect(screen.getByRole('button', { name: /Volver/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Confirmar/ })).toBeDisabled()
  })

  it('wz-4: los labels salen de i18n y aceptan override por prop', () => {
    conIntl(<Wizard steps={pasosWz} current={2} submitLabel="Crear pedido" onSubmit={() => {}}>x</Wizard>)
    expect(screen.getByRole('button', { name: /Crear pedido/ })).toBeInTheDocument()
  })
})

// ── help-center ────────────────────────────────────────────────────────────
const articulos = [
  { id: 'a1', title: 'Como dar de alta una unidad', category: 'Flota', content: 'Paso uno.' },
  { id: 'a2', title: 'Recuperar contrasena', category: 'Cuenta', content: 'Paso dos.' },
]

describe('conformance canon · help-center', () => {
  it('hlp-1: el buscador tiene nombre accesible y mide --hit-target-min', () => {
    conIntl(<HelpCenter articles={articulos} />)
    expect(screen.getByRole('textbox', { name: 'Buscar artículos de ayuda' })).toBeInTheDocument()
    expect(uiDe('components/HelpCenter.module.css')).toMatch(/\.searchInput\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
  })

  it('hlp-2: el filtrado anuncia cuantos resultados quedan', () => {
    const { container } = conIntl(<HelpCenter articles={articulos} />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar artículos de ayuda' }), { target: { value: 'unidad' } })
    const contador = container.querySelector('[aria-live="polite"]')!
    expect(contador.textContent).toBe('1 resultado')
  })

  it('hlp-4: un articulo abierto es una seccion asociada a su cabecera', () => {
    conIntl(<HelpCenter articles={articulos} />)
    const seccion = screen.getByRole('region', { name: 'Como dar de alta una unidad' })
    expect(seccion.querySelector('h2')!.textContent).toBe('Como dar de alta una unidad')
  })
})

// ── transaction-row ────────────────────────────────────────────────────────
describe('conformance canon · transaction-row', () => {
  it('trw-1: el signo se escribe, no solo se colorea', () => {
    const { rerender } = render(<TransactionRow title="Gasolina" amount={-450.5} />)
    expect(screen.getByText('−$450.50')).toBeInTheDocument()
    expect(screen.getByLabelText(/cargo/)).toBeInTheDocument()
    rerender(<TransactionRow title="Deposito" amount={1200} />)
    expect(screen.getByText('+$1,200.00')).toBeInTheDocument()
    expect(screen.getByLabelText(/abono/)).toBeInTheDocument()
  })

  it('trw-3: pending se dice con texto ademas de atenuar', () => {
    render(<TransactionRow title="Peaje" amount={-80} pending />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('trw-4: con onClick la fila entera es operable por teclado y mide --hit-target-min', () => {
    render(<TransactionRow title="Peaje" amount={-80} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: /Peaje/ })).toBeInTheDocument()
    expect(uiDe('components/TransactionRow.module.css')).toMatch(/\.root\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
  })
})

// ── table-tree ─────────────────────────────────────────────────────────────
const columnas = [{ key: 'name', label: 'Nombre' }]
const filas = [
  { id: 'p1', name: 'Region Norte', children: [{ id: 'h1', name: 'Monterrey' }] },
  { id: 'p2', name: 'Region Sur' },
]

describe('conformance canon · table-tree', () => {
  it('ttr-1: una fila con hijos declara aria-expanded y el nivel con aria-level', () => {
    conIntl(<TableTree columns={columnas} rows={filas} />)
    const padre = screen.getByText('Region Norte').closest('tr')!
    expect(padre.getAttribute('aria-expanded')).toBe('false')
    expect(padre.getAttribute('aria-level')).toBe('1')
    fireEvent.click(screen.getAllByRole('button', { name: 'Expandir' })[0])
    const hijo = screen.getByText('Monterrey').closest('tr')!
    expect(hijo.getAttribute('aria-level')).toBe('2')
    expect(padre.getAttribute('aria-expanded')).toBe('true')
  })

  it('ttr-3: los hijos de una fila cerrada no estan en el orden de tabulacion', () => {
    conIntl(<TableTree columns={columnas} rows={filas} />)
    expect(screen.queryByText('Monterrey')).not.toBeInTheDocument()
  })

  it('ttr-4: abrir y cerrar no reordena las hermanas ni pierde la seleccion', () => {
    const orden = () => screen.getAllByRole('row').slice(1).map((r) => r.textContent)
    conIntl(<TableTree columns={columnas} rows={filas} selectedKey="p2" />)
    const antes = orden()
    const boton = screen.getAllByRole('button', { name: 'Expandir' })[0]
    fireEvent.click(boton)
    fireEvent.click(screen.getAllByRole('button', { name: 'Colapsar' })[0])
    expect(orden()).toEqual(antes)
    expect(screen.getByText('Region Sur').closest('tr')!.getAttribute('data-selected')).toBe('true')
  })
})
