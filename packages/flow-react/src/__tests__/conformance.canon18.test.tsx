/**
 * Conformance con el canon — tanda 18: las piezas del banco documental
 * ganan criterios con dientes (av-2, bd-2, cc-3, df-2, dc-2, gc-2, ic2-2,
 * nr-1/nr-3, ph-2, pc-2, pm-2, prc-2). El id tg-1 de transaction-group se
 * renombro a trg-1 en el canon: tg-* es la familia de toggle-control.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import type { ReactNode } from 'react'
import { AnatomyView } from '../ui/patterns/AnatomyView'
import { BalanceDisplay } from '../ui/patterns/BalanceDisplay'
import { CardCarousel } from '../ui/components/CardCarousel'
import { DocFooter } from '../ui/patterns/DocFooter'
import { DownloadCard } from '../ui/patterns/DownloadCard'
import { InstallCard } from '../ui/patterns/InstallCard'
import { NipReveal } from '../ui/patterns/NipReveal'
import { PageHeader } from '../ui/patterns/PageHeader'
import { PlaygroundCanvas } from '../ui/patterns/PlaygroundCanvas'
import { ProfileMenu } from '../ui/patterns/ProfileMenu'
import { SidebarProvider } from '../ui/patterns/sidebar-context'

const hoja = (rel: string) => readFileSync(join(__dirname, rel), 'utf8')
const conIntl = (ui: ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

describe('conformance canon · banco documental', () => {
  it('av-2: cada parte numerada existe con su label — sin numeros huerfanos', () => {
    conIntl(
      <AnatomyView parts={[{ label: 'Carcasa' }, { label: 'Campo' }, { label: 'Adorno' }]}>
        <div>specimen</div>
      </AnatomyView>,
    )
    for (const [n, etiqueta] of [['1', 'Carcasa'], ['2', 'Campo'], ['3', 'Adorno']]) {
      expect(screen.getByText(n)).toBeInTheDocument()
      expect(screen.getByText(etiqueta)).toBeInTheDocument()
    }
  })

  it('bd-2: el toggle de visibilidad alterna su nombre (Mostrar/Ocultar saldo)', () => {
    const onToggleHidden = vi.fn()
    const { rerender } = conIntl(
      <BalanceDisplay label="Saldo" value="$48,250.00" hidden onToggleHidden={onToggleHidden} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar saldo' }))
    expect(onToggleHidden).toHaveBeenCalled()
    rerender(
      <IntlProvider locale="es">
        <BalanceDisplay label="Saldo" value="$48,250.00" hidden={false} onToggleHidden={onToggleHidden} />
      </IntlProvider>,
    )
    expect(screen.getByRole('button', { name: 'Ocultar saldo' })).toBeInTheDocument()
  })

  it('cc-3: los dots viven en tablist y cada uno tiene nombre propio', () => {
    conIntl(
      <CardCarousel>
        {[<span key="a">A</span>, <span key="b">B</span>]}
      </CardCarousel>,
    )
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tarjeta 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tarjeta 2' })).toBeInTheDocument()
  })

  it('df-2: los enlaces del pie son <a> reales con href', () => {
    conIntl(
      <DocFooter links={[{ label: 'Canon', href: '/canon' }, { label: 'Fichas', href: '/fichas' }]} />,
    )
    const enlace = screen.getByRole('link', { name: 'Canon' })
    expect(enlace).toHaveAttribute('href', '/canon')
  })

  it('dc-2: la descarga es un enlace real con href', () => {
    conIntl(<DownloadCard filename="flow.tokens.json" href="/dl/tokens.json" />)
    const enlaces = screen.getAllByRole('link')
    expect(enlaces.some((a) => a.getAttribute('href') === '/dl/tokens.json')).toBe(true)
  })

  it('gc-2: el tono de GuidanceCard sale de --status-*, no de un hex', () => {
    const css = hoja('../ui/patterns/GuidanceCard.module.css')
    expect(css).toMatch(/var\(--status-success\)/)
    expect(css).toMatch(/var\(--status-danger\)/)
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
  })

  it('ic2-2: el comando viaja por CodeBlock copyable con boton de copiar nombrado', () => {
    conIntl(<InstallCard platform="React" command="npm i @alohasoyrico-eng/flow-react" />)
    expect(screen.getByRole('button', { name: 'Copiar código' })).toBeInTheDocument()
  })

  it('nr-3: el NIP no vive en el DOM hasta revelarse', () => {
    const { container } = conIntl(<NipReveal digits="4921" />)
    expect(container.textContent).not.toContain('4921')
    expect(screen.getByRole('button', { name: 'Mostrar NIP' })).toBeInTheDocument()
  })

  it('nr-1: se oculta solo despues del timeout', async () => {
    const { container } = conIntl(<NipReveal digits="4921" duration={40} blurLast={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar NIP' }))
    expect(container.textContent).toContain('4921')
    await waitFor(() => expect(container.textContent).not.toContain('4921'))
  })

  it('ph-2: el titulo es un h1 real y el boton de menu tiene nombre', () => {
    conIntl(
      <SidebarProvider value={() => {}}>
        <PageHeader title="Unidades" />
      </SidebarProvider>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Unidades' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abrir navegación' })).toBeInTheDocument()
  })

  it('pc-2: el snippet refleja la variante activa', () => {
    conIntl(
      <PlaygroundCanvas
        variants={[{ value: 'primary', label: 'Primary' }, { value: 'ghost', label: 'Ghost' }]}
        snippet={({ variant }) => `<Button variant="${variant}" />`}
      >
        {({ variant }) => <button data-variant={variant}>demo</button>}
      </PlaygroundCanvas>,
    )
    expect(screen.getByText(/variant="primary"/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Ghost'))
    expect(screen.getByText(/variant="ghost"/)).toBeInTheDocument()
  })

  it('pm-2: cada item es un boton real con icono decorativo oculto', () => {
    conIntl(
      <ProfileMenu
        name="Marta Vidal"
        avatarName="Marta Vidal"
        role="Fleet admin"
        items={[{ icon: 'settings', label: 'Ajustes' }, { icon: 'logout', label: 'Salir' }]}
      />,
    )
    const item = screen.getByRole('button', { name: 'Ajustes' })
    expect(item).toBeInTheDocument()
    for (const icono of item.querySelectorAll('.flow-symbol')) {
      expect(icono).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('prc-2: los tonos de ProposalCard salen de --status-*', () => {
    const css = hoja('../ui/patterns/ProposalCard.module.css')
    expect(css).toMatch(/var\(--status-danger-text\)/)
    expect(css).toMatch(/var\(--status-success-text\)/)
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
  })
})
