import { TopBar } from '../ui/patterns/TopBar'
import { IconButton } from '../ui/primitives/IconButton'
import { Badge } from '../ui/primitives/Badge'
import { FlowLogo } from '../ui/primitives/FlowLogo'
import css from './TopBarDemoPage.module.css'

const logo = <FlowLogo />

const avatar = (
  <div className={css.demoAvatar}>MV</div>
)

const navItems = [
  { id: 'dash', label: 'Dashboard', active: true },
  { id: 'fleet', label: 'Flota' },
  { id: 'drivers', label: 'Conductores' },
  { id: 'reports', label: 'Reportes' },
]

const docsNav = [
  { id: 'found', label: 'Foundations' },
  { id: 'comp', label: 'Components', active: true },
  { id: 'patt', label: 'Patterns' },
  { id: 'tmpl', label: 'Templates' },
  { id: 'reg', label: 'Registry' },
]

const breadcrumb = [
  { label: 'Inicio', href: '#' },
  { label: 'Unidades', href: '#' },
  { label: 'KTR-882' },
]

const entities = [
  { id: 'mx', label: 'Edenred México' },
  { id: 'co', label: 'Edenred Colombia' },
  { id: 'br', label: 'Edenred Brasil' },
]

export function TopBarDemoPage() {
  return (
    <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ font: 'var(--type-headline-lg)', color: 'var(--text-primary)' }}>TopBar — 5 variantes</h1>

      <section>
        <h2 style={{ font: 'var(--type-title-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>1 · standard</h2>
        <TopBar logo={logo} navItems={navItems} avatar={avatar} onToggleSidebar={() => {}} />
      </section>

      <section>
        <h2 style={{ font: 'var(--type-title-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>2 · minimal</h2>
        <TopBar variant="minimal" breadcrumb={breadcrumb} avatar={avatar} />
      </section>

      <section>
        <h2 style={{ font: 'var(--type-title-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>3 · admin</h2>
        <TopBar variant="admin" notificationCount={3} onNotifications={() => {}} avatar={avatar} />
      </section>

      <section>
        <h2 style={{ font: 'var(--type-title-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>4 · multientity</h2>
        <TopBar variant="multientity" entities={entities} currentEntity="mx" avatar={avatar} />
      </section>

      <section>
        <h2 style={{ font: 'var(--type-title-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>5 · fullscreen</h2>
        <div className={css.placeholder}>return null — no renderiza nada</div>
      </section>

      <section>
        <h2 style={{ font: 'var(--type-title-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>Nuevo · standard + surface="inverse" + navSize="sm"</h2>
        <TopBar
          surface="inverse"
          navSize="sm"
          logo={logo}
          navItems={docsNav}
          onToggleSidebar={() => {}}
          trailing={
            <>
              <IconButton icon="search" ariaLabel="Buscar" />
              <Badge as="kbd" style={{ border: '1px solid var(--alpha-white-15)', background: 'transparent', fontFamily: 'var(--font-mono)', font: 'var(--type-label-sm)' }}>v2.4</Badge>
            </>
          }
        />
      </section>
    </div>
  )
}
