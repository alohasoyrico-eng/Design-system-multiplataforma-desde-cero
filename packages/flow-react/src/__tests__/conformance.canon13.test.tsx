/**
 * Conformance con el canon — tanda 13 (cola de un criterio por pieza).
 * Items: input, avatar, progress, timeline, auto-grid, detail-row, flow-logo,
 * inline-code, page-frame, card-media, bottom-sheet (bsh-3), code-block,
 * filter-bar, limit-bar, nav-bar, quick-action, route-banner, section-bar,
 * sheet-body, balance-display, card-carousel, nav-card, profile-menu,
 * quick-action-bar.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import type { ReactNode } from 'react'
import { Input } from '../ui/primitives/Input'
import { Avatar } from '../ui/primitives/Avatar'
import { Progress } from '../ui/primitives/Progress'
import { Timeline } from '../ui/primitives/Timeline'
import { FlowLogo } from '../ui/primitives/FlowLogo'
import { LimitBar } from '../ui/primitives/LimitBar'
import { BottomSheet } from '../ui/components/BottomSheet'
import { CardMedia } from '../ui/components/CardMedia'
import { CardCarousel } from '../ui/components/CardCarousel'
import { BalanceDisplay } from '../ui/patterns/BalanceDisplay'
import { NavCard } from '../ui/patterns/NavCard'

const uiDe = (rel: string) => readFileSync(join(__dirname, '..', 'ui', rel), 'utf8')
const conIntl = (ui: ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

describe('conformance canon · cola de un criterio', () => {
  it('inp-2: el sufijo no es enfocable ni se lee como parte del valor', () => {
    conIntl(<Input value="120" trailing={<span>kg</span>} onChange={() => {}} />)
    const sufijo = screen.getByText('kg')
    expect(sufijo.closest('button, a, [tabindex]')).toBeNull()
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('120')
  })

  it('avt-5: el punto de busy no late (no hay animacion que apagar) y el estado se dice en texto', () => {
    conIntl(<Avatar name="Ana Ruiz" status="busy" />)
    expect(screen.getByText('ocupado')).toBeInTheDocument()
    expect(uiDe('primitives/Avatar.module.css')).not.toMatch(/animation/)
  })

  it('prg-3: el ancho final es atributo, no transicion: la barra ya esta en su porcentaje', () => {
    const { container } = render(<Progress value={60} max={100} />)
    const barra = container.querySelector('[class*="bar"]') as HTMLElement
    expect(barra.style.width).toBe('60%')
  })

  it('tml-1: el estado de cada evento se dice con texto, no solo con el color del punto', () => {
    conIntl(
      <Timeline mode="events" items={[
        { title: 'Orden creada', status: 'done' },
        { title: 'En revision', status: 'active' },
        { title: 'Entrega', status: 'pending' },
      ]} />,
    )
    expect(screen.getByText('Completado')).toBeInTheDocument()
    expect(screen.getByText('En curso')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('ag-1: si el minimo excede el viewport colapsa a 1 columna, nunca scroll del body', () => {
    expect(uiDe('primitives/AutoGrid.module.css')).toMatch(/minmax\(min\(var\(--ag-min[^)]*\),\s*100%\)/)
  })

  it('dr-1: el valor con mono usa --font-mono, no --font-body', () => {
    expect(uiDe('primitives/DetailRow.module.css')).toMatch(/data-mono[^}]*font-family:\s*var\(--font-mono\)/)
  })

  it('fl-1: tiene role=img y aria-label Flow', () => {
    render(<FlowLogo />)
    expect(screen.getByRole('img', { name: 'Flow' })).toBeInTheDocument()
  })

  it('ic-1: usa --font-mono y 0.9em del contexto', () => {
    const hoja = uiDe('primitives/InlineCode.module.css')
    expect(hoja).toMatch(/font-family:\s*var\(--font-mono\)/)
    expect(hoja).toMatch(/font-size:\s*0\.9em/)
  })

  it('pf-1: reduce padding en viewports menores a 576px', () => {
    expect(uiDe('primitives/PageFrame.module.css')).toMatch(/@media\s*\(max-width:\s*576px\)/)
  })

  it('cmd-1: la imagen es decorativa: fondo CSS, nada que repita el titulo al oido', () => {
    render(<CardMedia image="/foto.jpg" title="Unidad 42" description="En ruta" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Unidad 42')).toBeInTheDocument()
  })

  it('cmd-2: si la imagen no carga, la tarjeta conserva su alto (altura fija de la zona media)', () => {
    expect(uiDe('components/CardMedia.module.css')).toMatch(/\.image\s*\{[^}]*height:\s*\d+px/)
  })

  it('bsh-3: con fixed=false sigue atrapando el foco dentro del marco', () => {
    conIntl(
      <BottomSheet open fixed={false} onClose={() => {}}>
        <button>Uno</button>
        <button>Dos</button>
      </BottomSheet>,
    )
    const focusables = screen.getAllByRole('button')
    const ultimo = focusables[focusables.length - 1]
    ultimo.focus()
    fireEvent.keyDown(ultimo, { key: 'Tab' })
    // Tab desde el ultimo vuelve al primero: el marco no suelta el foco
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
    expect(document.activeElement).toBe(focusables[0])
  })

  it('cb-2: el overflow horizontal scrollea dentro del bloque, no la pagina', () => {
    expect(uiDe('components/CodeBlock.module.css')).toMatch(/overflow-x:\s*auto/)
  })

  it('fb-1: la barra de filtros envuelve en viewports estrechos sin overflow', () => {
    expect(uiDe('components/FilterBar.module.css')).toMatch(/flex-wrap:\s*wrap/)
  })

  it('lb-1: los valores se muestran con formato de moneda (localeString)', () => {
    render(<LimitBar label="Gasto mensual" current={45000} max={120000} />)
    expect(screen.getByText(/45,000/)).toBeInTheDocument()
    expect(screen.getByText(/120,000/)).toBeInTheDocument()
  })

  it('lb-2: con max=0 no divide por cero: barra vacia', () => {
    const { container } = render(<LimitBar label="Sin limite" current={100} max={0} />)
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/)
  })

  it('nb-1: el boton back tiene nombre accesible y objetivo de IconButton (44)', () => {
    expect(uiDe('components/NavBar.tsx')).toMatch(/ariaLabel=\{t\('nav.back', 'Volver'\)\}/)
  })

  it('qa-1: el circulo mide al menos --hit-target-min (48px)', () => {
    expect(uiDe('components/QuickAction.module.css')).toMatch(/\.circle\s*\{[^}]*width:\s*48px/)
  })

  it('rb-1: el boton de cierre existe con nombre y objetivo de IconButton (44)', () => {
    expect(uiDe('components/RouteBanner.tsx')).toMatch(/icon="close" ariaLabel=\{t\('common.close', 'Cerrar'\)\}/)
  })

  it('sb-1 (section-bar): sticky se pega bajo el TopBar en la capa --z-sticky de la escala', () => {
    const hoja = uiDe('primitives/SectionBar.module.css')
    expect(hoja).toMatch(/position:\s*sticky/)
    expect(hoja).toMatch(/top:\s*var\(--height-bar\)/)
    expect(hoja).toMatch(/z-index:\s*var\(--z-sticky\)/)
  })

  it('sb-1 (sheet-body): el scroll es interno, nunca desborda el overlay', () => {
    expect(uiDe('primitives/SheetBody.module.css')).toMatch(/overflow-y:\s*auto/)
  })

  it('bd-1: con hidden=true no revela el valor ni en el DOM ni en el aria-label', () => {
    const { container } = conIntl(
      <BalanceDisplay label="Saldo" value="$48,250.00" hidden onToggleHidden={() => {}} />,
    )
    expect(container.textContent).not.toContain('48,250')
    expect(container.innerHTML).not.toContain('48,250')
  })

  it('cc-2: los dots reflejan la posicion actual', () => {
    conIntl(
      <CardCarousel>
        {[<span key="a">A</span>, <span key="b">B</span>]}
      </CardCarousel>,
    )
    const dots = screen.getAllByRole('tab')
    expect(dots[0].getAttribute('aria-selected')).toBe('true')
    expect(dots[1].getAttribute('aria-selected')).toBe('false')
    fireEvent.click(dots[1])
    expect(dots[1].getAttribute('aria-selected')).toBe('true')
  })

  it('nc-1: el link es accesible como <a> con href', () => {
    render(<NavCard label="Siguiente" name="Tokens" href="/tokens" />)
    const link = screen.getByRole('link', { name: /Tokens/ })
    expect(link.getAttribute('href')).toBe('/tokens')
  })

  it('pm-1: cada item de accion mide --hit-target-min', () => {
    expect(uiDe('patterns/ProfileMenu.module.css')).toMatch(/\.item\s*\{[^}]*min-height:\s*var\(--hit-target-min\)/)
  })

  it('qab-1: con mas items que ancho, scrollea la barra, no la pagina', () => {
    expect(uiDe('components/QuickActionBar.module.css')).toMatch(/overflow-x:\s*auto/)
  })
})

// ── menu (mnu-5, resuelto 4-sep) ───────────────────────────────────────────
describe('conformance canon · menu (alineacion propia)', () => {
  it('mnu-5: la raiz no se deforma por el contexto: declara su alineacion propia', async () => {
    const { Menu } = await import('../ui/components/Menu')
    const { container } = render(
      <div style={{ display: 'flex', height: 400 }}>
        <Menu trigger={<button>Acciones</button>} items={[{ label: 'Duplicar', onClick: () => {} }]} />
      </div>,
    )
    const raiz = screen.getByRole('button', { name: 'Acciones' }).closest('[class*="root"]') as HTMLElement
    expect(raiz.style.alignSelf).toBe('center')
    expect(container).toBeTruthy()
  })
})
