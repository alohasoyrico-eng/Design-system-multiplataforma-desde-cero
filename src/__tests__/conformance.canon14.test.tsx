/**
 * Conformance con el canon — tanda 14 (patterns y templates, la final).
 * Items: auth-pattern, auth-t, dashboard-pattern, dashboards-6, widget-frame
 * (dsh-p4), settings-pattern, settings-t, wizard-pattern, search-pattern,
 * country-select-pattern, doc-hero, state-grid, agent-chat-template,
 * drivers-app-t, onboarding-fm, onboarding-driver, card-detail, config-roles,
 * internal-tools-t.
 * Fuera con nota: od-3 (la pantalla no tiene paso de subir documentos — el
 * criterio describe una feature que el template no contiene), it-6 (los
 * targets los garantizan los componentes del DS; el layout no mide propio).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { IntlProvider } from 'react-intl'
import type { ReactNode } from 'react'
import { AuthForm } from '../ui/patterns/AuthForm'
import { WidgetFrame } from '../ui/components/WidgetFrame'
import { SettingsRow } from '../ui/patterns/Settings'
import { Wizard } from '../ui/components/Wizard'
import { GlobalSearch } from '../ui/components/GlobalSearch'
import { Input } from '../ui/primitives/Input'
import { Switch } from '../ui/primitives/Switch'
import { FlowChart } from '../ui/primitives/FlowChart'
import { PhoneFrame } from '../pages/mobile/PhoneFrame'
import { AgentChatPage } from '../pages/AgentChatPage'
import { OnboardingPage } from '../pages/OnboardingPage'

const SRC = join(__dirname, '..')
const fuente = (rel: string) => readFileSync(join(SRC, rel), 'utf8')
const conIntl = (ui: ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

// ── auth-pattern + auth-t ──────────────────────────────────────────────────
describe('conformance canon · auth', () => {
  it('aut-p2: el error se anuncia al aparecer y el foco va al primer campo con problema', async () => {
    const user = userEvent.setup()
    conIntl(<AuthForm mode="login" onSubmit={() => {}} />)
    await user.click(screen.getByRole('button', { name: /Entrar|Iniciar/ }))
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    expect(document.activeElement?.id).toBe('auth-email')
  })

  it('aut-p3: la contrasena se revela con el ojo y el gestor puede autorrellenar', () => {
    const { container } = conIntl(<AuthForm mode="login" onSubmit={() => {}} />)
    const pass = container.querySelector('#auth-pass') as HTMLInputElement
    expect(pass.getAttribute('autocomplete')).toBe('current-password')
    expect(pass.type).toBe('password')
    expect(screen.getByRole('button', { name: 'Mostrar' })).toBeInTheDocument()
    const email = container.querySelector('#auth-email') as HTMLInputElement
    expect(email.getAttribute('autocomplete')).toBe('email')
    // la etiqueta del Field llega al control: htmlFor apunta a un id real
    expect(screen.getByLabelText(/Correo/)).toBe(email)
  })

  it('aut-p4: el boton queda deshabilitado mientras envia: dos clics no son dos intentos', () => {
    conIntl(<AuthForm mode="login" loading onSubmit={() => {}} />)
    expect(screen.getByRole('button', { name: /Entrar|Iniciar|Cargando/ })).toBeDisabled()
  })

  it('au-3: el formulario se envia con Enter desde cualquier campo (form nativo + type=submit)', () => {
    const { container } = conIntl(<AuthForm mode="login" onSubmit={() => {}} />)
    const form = container.querySelector('form')!
    expect(form).not.toBeNull()
    const boton = form.querySelector('button[type="submit"]')
    expect(boton).not.toBeNull()
  })
})

// ── dashboard-pattern + dashboards-6 + widget-frame ────────────────────────
describe('conformance canon · dashboards', () => {
  it('dsh-p4: al cargar, el hueco se rellena con Skeleton y el marco lleva aria-busy', () => {
    conIntl(
      <WidgetFrame title="Gasto mensual" loading>
        <p>dato real</p>
      </WidgetFrame>,
    )
    const marco = screen.getByRole('region', { name: 'Gasto mensual' })
    expect(marco.getAttribute('aria-busy')).toBe('true')
    expect(screen.queryByText('dato real')).not.toBeInTheDocument()
    expect(marco.querySelector('[data-variant="card"]')).not.toBeNull()
  })

  it('dsh-p5 y d6-3: la barra de herramientas del header envuelve en vez de desbordar', () => {
    expect(fuente('pages/DashboardPage.module.css')).toMatch(/flex-wrap:\s*wrap/)
  })

  it('d6-5: cada grafica declara que hace sin datos — el FlowChart de todas trae su estado vacio', () => {
    conIntl(<FlowChart ariaLabel="Sin datos" />)
    expect(screen.getByText('Sin datos para este periodo')).toBeInTheDocument()
  })
})

// ── settings-pattern + settings-t ──────────────────────────────────────────
describe('conformance canon · settings', () => {
  it('set-p5 y st-4: cada control queda asociado a su etiqueta por referencia', () => {
    conIntl(
      <>
        <SettingsRow label="Nombre de la organización" control={<Input value="Flota MX" onChange={() => {}} />} />
        <SettingsRow label="Notificaciones por correo" control={<Switch checked onChange={() => {}} />} />
      </>,
    )
    expect(screen.getByRole('textbox', { name: 'Nombre de la organización' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Notificaciones por correo' })).toBeInTheDocument()
  })
})

// ── wizard-pattern ─────────────────────────────────────────────────────────
describe('conformance canon · wizard-pattern', () => {
  const pasos = [{ label: 'Datos' }, { label: 'Pago' }, { label: 'Resumen' }]

  it('wiz-p3: el progreso se dice en texto ademas de dibujarse', () => {
    conIntl(<Wizard steps={pasos} current={1} onNext={() => {}}>x</Wizard>)
    expect(screen.getByText(/Paso 2 de 3/)).toBeInTheDocument()
  })

  it('wiz-p5: el boton de envio queda deshabilitado mientras envia', () => {
    conIntl(<Wizard steps={pasos} current={2} submitting onSubmit={() => {}}>x</Wizard>)
    expect(screen.getByRole('button', { name: /Confirmar/ })).toBeDisabled()
  })
})

// ── search-pattern ─────────────────────────────────────────────────────────
describe('conformance canon · search-pattern', () => {
  it('bsq-p4: al cerrar sin elegir, el foco vuelve exactamente donde estaba', () => {
    const vista = (open: boolean) => (
      <IntlProvider locale="es">
        <button>disparador</button>
        <GlobalSearch open={open} value="" results={[]} onOpenChange={() => {}} />
      </IntlProvider>
    )
    const { rerender } = render(vista(false))
    const disparador = screen.getByRole('button', { name: 'disparador' })
    disparador.focus()
    rerender(vista(true))
    expect(document.activeElement).toBe(screen.getByRole('combobox'))
    rerender(vista(false))
    expect(document.activeElement).toBe(disparador)
  })
})

// ── country-select-pattern ─────────────────────────────────────────────────
describe('conformance canon · country-select-pattern', () => {
  it('pai-p4: nunca con emoji de bandera — ninguna bandera emoji en toda la UI', () => {
    const EMOJI_BANDERA = /[\u{1F1E6}-\u{1F1FF}]/u
    const revisar = (dir: string) => {
      for (const n of readdirSync(dir)) {
        const p = join(dir, n)
        if (statSync(p).isDirectory()) { if (!n.includes('__tests__')) revisar(p) }
        else if (n.endsWith('.tsx')) expect(readFileSync(p, 'utf8')).not.toMatch(EMOJI_BANDERA)
      }
    }
    revisar(join(SRC, 'ui'))
  })

  it('pai-p5: no existe un componente SelectCountry — la receta compone Select + Flag', () => {
    expect(fuente('ui/lib.ts')).not.toMatch(/SelectCountry/)
  })
})

// ── doc-hero + state-grid ──────────────────────────────────────────────────
describe('conformance canon · doc-hero y state-grid', () => {
  it('dh-2: los pills de plataforma son StatusPill, no HTML crudo', () => {
    expect(fuente('ui/patterns/DocHero.tsx')).toMatch(/import \{ StatusPill \}/)
  })

  it('sg-1: cada celda usa Card outlined + Specimen, no HTML crudo', () => {
    const src = fuente('ui/patterns/StateGrid.tsx')
    expect(src).toMatch(/import \{ Card \}/)
    expect(src).toMatch(/import \{ Specimen \}/)
  })
})

// ── agent-chat-template ────────────────────────────────────────────────────
describe('conformance canon · agent-chat-template', () => {
  it('ac-3 y ac-4: mientras responde, el envio se deshabilita, se anuncia, y el chip dice la herramienta', async () => {
    const user = userEvent.setup()
    conIntl(<AgentChatPage />)
    const campo = screen.getByRole('textbox')
    await user.type(campo, 'estado de la flota')
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDisabled()
    await waitFor(() => expect(screen.getByText('Consultando datos de flota')).toBeInTheDocument(), { timeout: 3000 })
  })
})

// ── drivers-app-t ──────────────────────────────────────────────────────────
describe('conformance canon · drivers-app-t', () => {
  it('da-1: arranca en modo oscuro y se queda — el marco fija data-mode', () => {
    const { container } = render(<PhoneFrame dark>contenido</PhoneFrame>)
    expect(container.querySelector('[data-mode="dark"]')).not.toBeNull()
    expect(fuente('pages/mobile/DriversAppScreen.tsx')).toMatch(/<PhoneFrame dark>/)
  })
})

// ── onboarding-fm + onboarding-driver ──────────────────────────────────────
describe('conformance canon · onboarding', () => {
  it('of-3: el correo se valida con un mensaje por campo, no con una alerta global', async () => {
    const user = userEvent.setup()
    conIntl(<OnboardingPage />)
    // el paso 0 es un carrusel de bienvenida: se omite para llegar al formulario
    await user.click(screen.getByRole('button', { name: 'Omitir' }))
    await user.click(screen.getByRole('button', { name: /Continuar/ }))
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    // per-field, no alerta global: cada mensaje vive bajo su campo (Field)
    expect(screen.getAllByRole('alert').length).toBe(2)
  })

  it('od-1: la bienvenida se puede omitir desde cualquier diapositiva (carousel con onSkip)', () => {
    expect(fuente('pages/mobile/OnboardingDriverScreen.tsx')).toMatch(/onSkip=\{next\}/)
    // onb-3 garantiza que Omitir vive en todas las diapositivas del carousel
  })

  it('od-4: el teclado es el adecuado por campo: telefonico para el telefono', () => {
    expect(fuente('pages/mobile/OnboardingDriverScreen.tsx')).toMatch(/type="tel"/)
  })
})

// ── card-detail + config-roles ─────────────────────────────────────────────
describe('conformance canon · card-detail y config-roles', () => {
  it('cd-3: los ultimos cuatro digitos nunca se acompanan del numero completo', () => {
    const src = fuente('pages/mobile/CardDetailScreen.tsx')
    expect(src).toMatch(/last4=/)
    expect(src).not.toMatch(/\d{15,16}/)
  })

  it('cr-1: cada casilla de la matriz dice permiso, rol y estado (RoleMatrix, rmx-1)', () => {
    expect(fuente('pages/ConfigRolesPage.tsx')).toMatch(/import \{ RoleMatrix \}/)
  })

  it('cr-4: la invitacion pendiente se distingue con texto, no solo con color de badge', () => {
    expect(fuente('pages/ConfigRolesPage.tsx')).toMatch(/Invitación enviada/)
  })
})

// ── internal-tools-t ───────────────────────────────────────────────────────
describe('conformance canon · internal-tools-t', () => {
  const layout = () => fuente('layout/InternalToolsLayout.tsx')

  it('it-1: la nav filtra items segun el rol activo', () => {
    expect(layout()).toMatch(/NAV\.filter\(n => \(n\.roles as readonly string\[\]\)\.includes\(role\)\)/)
  })

  it('it-2: una pantalla sin acceso muestra EmptyState, no una pagina en blanco', () => {
    expect(layout()).toMatch(/EmptyState/)
  })

  it('it-3: el rol persiste en localStorage y se restaura al recargar', () => {
    const src = layout()
    expect(src).toMatch(/localStorage\.getItem\('flow-it-role'\)/)
    expect(src).toMatch(/localStorage\.setItem\('flow-it-role'/)
  })
})
