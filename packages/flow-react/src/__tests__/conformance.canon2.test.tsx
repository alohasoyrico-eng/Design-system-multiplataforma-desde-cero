/**
 * Conformance canon · tanda 2 — los siguientes diez por uso en eOne.
 * Igual que la tanda 1: cada test cita el criterio que demuestra.
 */
import { readFileSync } from 'node:fs'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import { Skeleton } from '../ui/primitives/Skeleton'
import { Input } from '../ui/primitives/Input'
import { SegmentedControl } from '../ui/components/SegmentedControl'
import { Table } from '../ui/components/Table'
import { Progress } from '../ui/primitives/Progress'
import { Dialog } from '../ui/components/Dialog'
import { Tabs } from '../ui/components/Tabs'
import { Badge } from '../ui/primitives/Badge'
import { Chip } from '../ui/primitives/Chip'
import { Avatar } from '../ui/primitives/Avatar'

const css = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8')
const src = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8')

describe('Skeleton · conformance canon', () => {
  // skl-2: diez skeletons no son diez mensajes de carga
  it('skl-2: el skeleton va oculto al lector', () => {
    const { container } = render(<Skeleton variant="card" />)
    expect((container.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true')
  })
  // skl-3: con reduced-motion el brillo para y queda superficie
  it('skl-3: la hoja detiene la animación en prefers-reduced-motion', () => {
    expect(css('../ui/primitives/Skeleton.module.css')).toMatch(/prefers-reduced-motion/)
  })
})

describe('Input · conformance canon', () => {
  // inp-1: el ojo es objetivo propio y anuncia estado
  it('inp-1: revealable expone un botón con nombre que alterna Mostrar/Ocultar', async () => {
    render(<IntlProvider locale="es"><Input revealable value="secreto" onChange={() => {}} /></IntlProvider>)
    const ojo = screen.getByRole('button', { name: 'Mostrar' })
    await userEvent.click(ojo)
    expect(screen.getByRole('button', { name: 'Ocultar' })).toBeInTheDocument()
  })
  // inp-4: el color no es el único portador del error
  it('inp-4: error marca aria-invalid en el input', () => {
    render(<IntlProvider locale="es"><Input error value="x" onChange={() => {}} /></IntlProvider>)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })
})

describe('SegmentedControl · conformance canon', () => {
  const items = [
    { value: 'd', label: 'Día' },
    { value: 's', label: 'Semana' },
    { value: 'm', label: 'Mes' },
  ]
  // sgm-1: tablist con teclado de Tabs
  it('sgm-1: es una tablist y las flechas recorren los segmentos', async () => {
    const onChange = vi.fn()
    render(<SegmentedControl items={items} value="d" onChange={onChange} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    const activo = screen.getByRole('tab', { selected: true })
    activo.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('s')
  })
  // sgm-2: cada segmento mide el target
  it('sgm-2: la hoja ancla la altura del segmento al token', () => {
    expect(css('../ui/components/SegmentedControl.module.css')).toMatch(/min-height: var\(--hit-target-min\)/)
  })
})

describe('Table · conformance canon', () => {
  const cols = [{ key: 'n', label: 'Nombre' }]
  const rows = [{ n: 'Ana' }, { n: 'Luis' }]
  // tb-1: zebra por token, jamás rgba a mano
  it('tb-1: el zebra del shell sale de --surface-sunken', () => {
    expect(src('../ui/primitives/DataGrid.tsx')).toMatch(/var\(--surface-sunken\)/)
  })
  // tb-2: fila clickeable = enfocable y operable por teclado
  it('tb-2: con onRowClick la fila tabula y Enter la dispara', async () => {
    const onRowClick = vi.fn()
    render(<Table columns={cols} rows={rows} onRowClick={onRowClick} />)
    const fila = screen.getByText('Ana').closest('tr')!
    fila.focus()
    expect(fila).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onRowClick).toHaveBeenCalledWith(rows[0])
  })
  // tb-3: el header ordenable anuncia aria-sort
  it('tb-3: ordenar pone aria-sort en el th', async () => {
    render(<Table columns={cols} rows={rows} />)
    await userEvent.click(screen.getByRole('button', { name: 'Nombre' }))
    expect(screen.getByText('Nombre').closest('th')).toHaveAttribute('aria-sort', 'ascending')
  })
  // tb-5: la tabla se nombra con <caption> oculto
  it('tb-5: caption existe en el DOM y nombra la tabla', () => {
    render(<Table columns={cols} rows={rows} caption="Personas del equipo" />)
    expect(screen.getByRole('table', { name: 'Personas del equipo' })).toBeInTheDocument()
  })
})

describe('Progress · conformance canon', () => {
  // prg-1: progressbar con sus tres arias
  it('prg-1: expone valuenow, valuemin y valuemax coherentes', () => {
    render(<Progress value={40} max={80} />)
    const barra = screen.getByRole('progressbar')
    expect(barra).toHaveAttribute('aria-valuenow', '40')
    expect(barra).toHaveAttribute('aria-valuemin', '0')
    expect(barra).toHaveAttribute('aria-valuemax', '80')
  })
  // prg-2: el valor se recorta al rango
  it('prg-2: por encima de max anuncia max, no se sale del carril', () => {
    render(<Progress value={150} max={100} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })
})

describe('Dialog · conformance canon', () => {
  // dl-1: role=dialog + aria-modal + labelledby al título
  it('dl-1: es un dialog modal etiquetado por su título', () => {
    render(<Dialog open title="Eliminar unidad" onClose={() => {}}>seguro?</Dialog>)
    const dlg = screen.getByRole('dialog')
    expect(dlg).toHaveAttribute('aria-modal', 'true')
    const labelId = dlg.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)).toHaveTextContent('Eliminar unidad')
  })
})

describe('Tabs · conformance canon', () => {
  const items = [
    { value: 'a', label: 'Resumen' },
    { value: 'b', label: 'Detalle' },
  ]
  // tab-1: tablist con aria-selected y flechas
  it('tab-1: roles de tablist y las flechas recorren', async () => {
    const onChange = vi.fn()
    render(<Tabs items={items} value="a" onChange={onChange} />)
    const activo = screen.getByRole('tab', { selected: true })
    expect(activo).toHaveTextContent('Resumen')
    activo.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('b')
  })
  // tab-2: cada pestaña mide el target
  it('tab-2: la hoja ancla la altura de la pestaña al token', () => {
    expect(css('../ui/components/Tabs.module.css')).toMatch(/min-height: var\(--hit-target-min\)/)
  })
})

describe('Badge · conformance canon', () => {
  // bdg-2: el pulso de live respeta reduced-motion sin desaparecer
  it('bdg-2: la hoja detiene el pulso en prefers-reduced-motion', () => {
    expect(css('../ui/primitives/Badge.module.css')).toMatch(/prefers-reduced-motion/)
  })
  // bdg-4: danger jamás usa el rojo de marca
  it('bdg-4: el tono danger sale de --status-danger', () => {
    const fuentes = css('../ui/primitives/Badge.module.css') + src('../ui/primitives/Badge.tsx')
    expect(fuentes).toMatch(/--status-danger/)
    expect(fuentes).not.toMatch(/--brand|--flow-red/)
  })
})

describe('Chip · conformance canon', () => {
  // chp-2: la × tiene etiqueta propia y no propaga
  it('chp-2: quitar no selecciona de paso', async () => {
    const onClick = vi.fn(); const onRemove = vi.fn()
    render(<Chip label="Zona: Norte" onClick={onClick} onRemove={onRemove} />)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Zona: Norte' }))
    expect(onRemove).toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
  })
  // chp-4: con onClick es un botón con aria-pressed
  it('chp-4: seleccionable refleja selected en aria-pressed', () => {
    render(<Chip label="Filtro" onClick={() => {}} selected />)
    expect(screen.getByRole('button', { name: 'Filtro' })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Avatar · conformance canon', () => {
  // avt-1: color determinista por nombre
  it('avt-1: el mismo nombre produce el mismo color', () => {
    const a = render(<Avatar name="Ana Sosa" />)
    const b = render(<Avatar name="Ana Sosa" />)
    const color = (r: ReturnType<typeof render>) =>
      (r.container.firstChild as HTMLElement).getAttribute('style')
    expect(color(a)).toBe(color(b))
  })
  // avt-2: la foto rota cae a iniciales
  it('avt-2: si la imagen falla quedan las iniciales', () => {
    const { container } = render(<Avatar name="Ana Sosa" src="http://x/rota.jpg" />)
    const img = container.querySelector('img')!
    fireEvent.error(img)
    expect(screen.getByText('AS')).toBeInTheDocument()
  })
  // avt-3: la presencia no es solo color
  it('avt-3: el punto de estado lleva texto accesible', () => {
    render(<Avatar name="Ana Sosa" status="online" />)
    expect(screen.getByText(/en línea|online|conectad/i)).toBeInTheDocument()
  })
  // avt-6: las iniciales viven sobre tokens de identidad
  it('avt-6: los colores salen de --avatar-1..6', () => {
    expect(src('../ui/primitives/Avatar.tsx')).toMatch(/--avatar-[1-6]/)
  })
})
