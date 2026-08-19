import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { AppLayout } from './layout/AppLayout'
import { InternalToolsLayout } from './layout/InternalToolsLayout'
import { DashboardPage, CombustibleView, MantenimientoView, ElectroView, PeajeView, FinanzasView } from './pages/DashboardPage'
import { UnitsPage } from './pages/UnitsPage'
import { DriversPage } from './pages/DriversPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { WizardPage } from './pages/WizardPage'
import { AuthPage } from './pages/AuthPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { ITResumenPage } from './pages/internal-tools/ITResumenPage'
import { ITTicketsPage } from './pages/internal-tools/ITTicketsPage'
import { ITCuentasPage } from './pages/internal-tools/ITCuentasPage'
import { ITPricingPage } from './pages/internal-tools/ITPricingPage'
import { ITCasosPage } from './pages/internal-tools/ITCasosPage'
import { ITBackofficePage } from './pages/internal-tools/ITBackofficePage'
import { ITGrowthPage } from './pages/internal-tools/ITGrowthPage'
import { AgentChatPage } from './pages/AgentChatPage'
import { MailingsPage } from './pages/MailingsPage'
import { ConfigRolesPage } from './pages/ConfigRolesPage'
import { PrimitivesShowcasePage } from './pages/PrimitivesShowcasePage'
import { WalletPage } from './pages/WalletPage'

const rootRoute = createRootRoute({ component: Outlet })

const appLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
})

const dashboardRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/',
  component: DashboardPage,
})

const combustibleRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/combustible',
  component: CombustibleView,
})

const mantenimientoRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/mantenimiento',
  component: MantenimientoView,
})

const electroRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/electro',
  component: ElectroView,
})

const peajeRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/peaje',
  component: PeajeView,
})

const finanzasRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/finanzas',
  component: FinanzasView,
})

const unitsRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/unidades',
  component: UnitsPage,
})

const driversRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/conductores',
  component: DriversPage,
})

const reportsRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/reportes',
  component: ReportsPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/ajustes',
  component: SettingsPage,
})

const wizardRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/unidades/nueva',
  component: WizardPage,
})

const agentChatRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/asistente',
  component: AgentChatPage,
})

const mailingsRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/mailings',
  component: MailingsPage,
})

const configRolesRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/configuracion',
  component: ConfigRolesPage,
})

const showcaseRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/showcase',
  component: PrimitivesShowcasePage,
})

const walletRoute = createRoute({
  getParentRoute: () => appLayout,
  path: '/wallet',
  component: WalletPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: AuthPage,
})

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
})

// ── Internal Tools ──

const itLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/internal-tools',
  component: InternalToolsLayout,
})

const itResumenRoute = createRoute({
  getParentRoute: () => itLayout,
  path: '/',
  component: ITResumenPage,
})

const itTicketsRoute = createRoute({
  getParentRoute: () => itLayout,
  path: '/tickets',
  component: ITTicketsPage,
})

const itCuentasRoute = createRoute({
  getParentRoute: () => itLayout,
  path: '/cuentas',
  component: ITCuentasPage,
})

const itPricingRoute = createRoute({
  getParentRoute: () => itLayout,
  path: '/pricing',
  component: ITPricingPage,
})

const itCasosRoute = createRoute({
  getParentRoute: () => itLayout,
  path: '/casos',
  component: ITCasosPage,
})

const itBackofficeRoute = createRoute({
  getParentRoute: () => itLayout,
  path: '/backoffice',
  component: ITBackofficePage,
})

const itGrowthRoute = createRoute({
  getParentRoute: () => itLayout,
  path: '/growth',
  component: ITGrowthPage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  onboardingRoute,
  appLayout.addChildren([
    dashboardRoute,
    combustibleRoute,
    mantenimientoRoute,
    electroRoute,
    peajeRoute,
    finanzasRoute,
    unitsRoute,
    driversRoute,
    reportsRoute,
    settingsRoute,
    wizardRoute,
    agentChatRoute,
    mailingsRoute,
    configRolesRoute,
    showcaseRoute,
    walletRoute,
  ]),
  itLayout.addChildren([
    itResumenRoute,
    itTicketsRoute,
    itCuentasRoute,
    itPricingRoute,
    itCasosRoute,
    itBackofficeRoute,
    itGrowthRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
