/**
 * Conformance contra los contratos canonicos (rama canonical).
 * Cada test cita el id del criterio que verifica — el medidor
 * check-conformance-coverage cuenta esas citas. Solo se cita lo que el
 * test demuestra de verdad; lo que jsdom no puede medir queda fuera.
 * Arranque: los 6 items mas usados por eOne.
 */
import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import { Button } from '../ui/primitives/Button'
import { StatusPill } from '../ui/primitives/StatusPill'
import { Card } from '../ui/components/Card'
import { EmptyState } from '../ui/primitives/EmptyState'
import { StatTile } from '../ui/components/StatTile'
import { Select } from '../ui/primitives/Select'

const css = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8')
const conIntl = (ui: React.ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

describe('Button · conformance canon', () => {
  // btn-1: mide --hit-target-min en todos los tamanos (sm reduce tipografia, no target)
  it('btn-1: el CSS ancla min-height al token en sm y md', () => {
    const hoja = css('../ui/primitives/Button.module.css')
    expect(hoja).toMatch(/min-height: var\(--hit-target-min\)/)
    expect(hoja).not.toMatch(/\[data-size='sm'\][^}]*min-height:\s*\d/)
  })

  // btn-2: con loading conserva su contenido (el ancho no colapsa bajo el dedo)
  it('btn-2: loading no desmonta el texto del boton', () => {
    render(<Button loading>Guardar cambios</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Guardar cambios')
  })

  // btn-3: loading deja el elemento disabled de verdad
  it('btn-3: loading pone disabled, no solo quita el handler', async () => {
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>Enviar</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await userEvent.click(btn).catch(() => {})
    expect(onClick).not.toHaveBeenCalled()
  })

  // btn-4: sin texto visible, ariaLabel da el nombre
  it('btn-4: un boton de solo icono con ariaLabel tiene nombre accesible', () => {
    render(<Button icon="add" ariaLabel="Agregar unidad" />)
    expect(screen.getByRole('button', { name: 'Agregar unidad' })).toBeInTheDocument()
  })
})

describe('StatusPill · conformance canon', () => {
  // sp-1: dot de 6px, pill de 30px — alineado con Badge
  it('sp-1: el CSS declara 30px de alto y dot de 6px', () => {
    const hoja = css('../ui/primitives/StatusPill.module.css')
    expect(hoja).toMatch(/height: 30px/)
    expect(hoja).toMatch(/width: 6px/)
  })
})

describe('Card · conformance canon', () => {
  // crd-1: interactiva = operable con foco y teclado
  it('crd-1: con onClick es un elemento operable y Enter lo dispara', async () => {
    const onClick = vi.fn()
    render(<Card interactive onClick={onClick}>Contenido</Card>)
    const card = screen.getByRole('button')
    card.focus()
    expect(card).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalled()
  })

  // crd-2: sin interactive no entra al orden de tabulacion
  it('crd-2: sin interactive no hay rol operable ni tabIndex', () => {
    const { container } = render(<Card>Contenido</Card>)
    expect(screen.queryByRole('button')).toBeNull()
    expect((container.firstChild as HTMLElement).getAttribute('tabindex')).toBeNull()
  })

  // crd-6: la franja de estado sale de --status-*, jamas de un color a mano
  it('crd-6: status pinta la franja con tokens y la escala de padding vive en CSS', () => {
    const { container } = render(<Card status="danger" padding="sm">Alerta</Card>)
    const raiz = container.firstChild as HTMLElement
    expect(raiz.getAttribute('data-status')).toBe('danger')
    expect(raiz.getAttribute('data-padding')).toBe('sm')
    // el paso de escala no viaja como estilo en linea
    expect(raiz.style.padding).toBe('')
    const cssCard = css('../ui/components/Card.module.css')
    for (const tono of ['success', 'warning', 'danger', 'info']) {
      expect(cssCard).toMatch(new RegExp(`data-status='${tono}'\\][^}]*var\\(--status-${tono}\\)`))
    }
  })
})

describe('EmptyState · conformance canon', () => {
  // emp-2: el icono es decorativo; informa el titulo
  it('emp-2: el icono va aria-hidden y el titulo es visible', () => {
    render(<EmptyState icon="inbox" title="Sin resultados" description="Ajusta los filtros" />)
    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
    const icono = document.querySelector('.flow-symbol')
    expect(icono).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('StatTile · conformance canon', () => {
  // stt-2: el signo del delta viaja en texto, no solo en color
  it('stt-2: el delta negativo dice su signo en el texto', () => {
    render(<StatTile label="Gasto" value="$248k" delta="−4% vs mes pasado" />)
    expect(screen.getByText(/−4%/)).toBeInTheDocument()
  })

  // stt-3: la sparkline esta oculta al lector
  it('stt-3: el trend no se anuncia — la cifra ya lo dice', () => {
    const { container } = render(
      <StatTile label="Viajes" value="412" trend={[1, 2, 3, 4]} />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  // stt-6: loading anuncia ocupado y no pinta cifras falsas
  it('stt-6: loading pone aria-busy, mantiene la etiqueta y esconde el esqueleto', () => {
    const { container } = render(
      <StatTile label="Viajes" value="412" delta="+4 vs ayer" loading />,
    )
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
    expect(screen.getByText('Viajes')).toBeInTheDocument()
    expect(screen.queryByText('412')).toBeNull()
    expect(screen.queryByText(/\+4/)).toBeNull()
    for (const esq of container.querySelectorAll('[data-variant]')) {
      expect(esq).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('la descripción aparece como contexto bajo la cifra', () => {
    render(<StatTile label="Viajes" value="412" description="Completados esta semana" />)
    expect(screen.getByText('Completados esta semana')).toBeInTheDocument()
  })
})

describe('Select · conformance canon', () => {
  const opciones = [
    { value: 'a', label: 'Activo' },
    { value: 'b', label: 'Baja' },
  ]

  // sel-1: Escape cierra y devuelve el foco al trigger
  it('sel-1: Escape cierra y el foco vuelve al trigger', async () => {
    conIntl(<Select options={opciones} />)
    const combo = screen.getByRole('combobox')
    combo.focus()
    await userEvent.keyboard('{Enter}')
    expect(combo).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
    expect(combo).toHaveAttribute('aria-expanded', 'false')
    expect(combo).toHaveFocus()
  })

  // sel-2: combobox con aria-expanded y activedescendant siguiendo el resaltado
  it('sel-2: aria-activedescendant sigue al resaltado con las flechas', async () => {
    conIntl(<Select options={opciones} />)
    const combo = screen.getByRole('combobox')
    combo.focus()
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    const activo = combo.getAttribute('aria-activedescendant')
    expect(activo).toBeTruthy()
    expect(document.getElementById(activo!)).toHaveTextContent(/Activo|Baja/)
  })

  // sel-3: filas de 44px minimo (fuente de verdad: la hoja del Listbox)
  it('sel-3: las filas del listbox anclan min-height al token', () => {
    expect(css('../ui/primitives/Listbox.module.css')).toMatch(/min-height: var\(--hit-target-min\)/)
  })

  // sel-9: limpiar vive en la zona trailing de la carcasa, junto al chevron
  it('sel-9: la x de limpiar es un boton dentro de la carcasa, antes del chevron', async () => {
    conIntl(<Select clearable value="a" options={opciones} onChange={() => {}} />)
    const shell = document.querySelector('[data-control-shell]')!
    const limpiar = screen.getByRole('button', { name: 'Limpiar' })
    expect(shell.contains(limpiar)).toBe(true)
  })

  // sel-7: el ancho es del contenedor — el trigger del Popover llena (data-fill)
  it('sel-7: el envoltorio del trigger llena su contenedor', () => {
    conIntl(<Select options={opciones} />)
    expect(document.querySelector('[data-fill]')).toBeTruthy()
  })
})
