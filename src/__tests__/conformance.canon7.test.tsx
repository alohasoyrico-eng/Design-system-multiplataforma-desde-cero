/**
 * Conformance con el canon — tanda 7.
 * Cada test cita el id del criterio automatizado del contrato canonico que
 * verifica (el medidor check-conformance-coverage cuenta por esa cita).
 * Items: chat-message, chat-thread, chat-composer, onboarding-carousel,
 * biometric, payment-card, filters-inline-edit, bulk-actions-pattern.
 * auth-otp queda fuera: la pantalla implementa passcode+biometria, no el
 * flujo OTP-desde-SMS que ao-2 exige — divergencia anotada, no maquillada.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import type { ReactNode } from 'react'
import { ChatMessage } from '../ui/primitives/ChatMessage'
import { ChatThread } from '../ui/components/ChatThread'
import { ChatComposer } from '../ui/components/ChatComposer'
import { OnboardingCarousel } from '../ui/components/OnboardingCarousel'
import { BiometricPrompt } from '../ui/components/BiometricPrompt'
import { PaymentCard } from '../ui/components/PaymentCard'
import { FilterableEditableTable } from '../ui/components/FilterableEditableTable'
import { BulkActionsTable } from '../ui/components/BulkActionsTable'

const uiDe = (rel: string) => readFileSync(join(__dirname, '..', 'ui', rel), 'utf8')
const conIntl = (ui: ReactNode) => render(<IntlProvider locale="es">{ui}</IntlProvider>)

// ── chat-message ───────────────────────────────────────────────────────────
describe('conformance canon · chat-message', () => {
  it('cmg-1: el rol se dice en el arbol accesible, no solo por lado y color', () => {
    conIntl(<ChatMessage role="user" text="Hola" />)
    expect(screen.getByLabelText('Tu mensaje')).toBeInTheDocument()
    conIntl(<ChatMessage role="agent" text="Buenas" />)
    expect(screen.getByLabelText('Respuesta del asistente')).toBeInTheDocument()
  })

  it('cmg-2: streaming se anuncia como en curso y los puntos paran con reduced-motion', () => {
    conIntl(<ChatMessage role="agent" streaming />)
    expect(screen.getByRole('status', { name: 'Escribiendo' })).toBeInTheDocument()
    expect(uiDe('primitives/ChatMessage.module.css')).toMatch(/prefers-reduced-motion:\s*reduce/)
  })

  it('cmg-3: el chip de herramienta dice que herramienta usa en texto', () => {
    conIntl(<ChatMessage role="agent" tool={{ label: 'Consultando unidades', status: 'running' }} />)
    expect(screen.getByText('Consultando unidades')).toBeInTheDocument()
  })

  it('cmg-5: el texto del usuario nunca se interpreta como marcado', () => {
    const { container } = conIntl(<ChatMessage role="user" text="<b>hola</b> & <script>x</script>" />)
    expect(container.querySelector('b, script')).toBeNull()
    expect(screen.getByText('<b>hola</b> & <script>x</script>')).toBeInTheDocument()
  })
})

// ── chat-thread ────────────────────────────────────────────────────────────
const mensajes = [
  { id: 'm1', role: 'user' as const, text: 'Cuantas unidades activas hay' },
  { id: 'm2', role: 'agent' as const, text: 'Hay 42 unidades activas.' },
]

describe('conformance canon · chat-thread', () => {
  it('cth-1: es una region aria-live polite: lo nuevo se anuncia sin robar el foco', () => {
    const { container } = conIntl(<ChatThread messages={mensajes} />)
    const region = container.firstElementChild!
    expect(region.getAttribute('aria-live')).toBe('polite')
    expect(document.activeElement).toBe(document.body)
  })

  it('cth-3: con la lista vacia muestra su estado vacio, no un hueco', () => {
    conIntl(<ChatThread messages={[]} />)
    expect(screen.getByText('Sin mensajes')).toBeInTheDocument()
  })

  it('cth-4: el orden de lectura es cronologico y el rol de cada mensaje se dice', () => {
    conIntl(<ChatThread messages={mensajes} />)
    const roles = screen.getAllByLabelText(/Tu mensaje|Respuesta del asistente/)
    expect(roles.map((r) => r.getAttribute('aria-label'))).toEqual(['Tu mensaje', 'Respuesta del asistente'])
    expect(roles[0].textContent).toContain('Cuantas unidades')
  })
})

// ── chat-composer ──────────────────────────────────────────────────────────
describe('conformance canon · chat-composer', () => {
  it('ccm-1: Enter envia y Shift+Enter salta de linea', () => {
    const onSend = vi.fn()
    conIntl(<ChatComposer value="listo" onSend={onSend} onChange={() => {}} />)
    const campo = screen.getByRole('textbox')
    fireEvent.keyDown(campo, { key: 'Enter', shiftKey: true })
    expect(onSend).not.toHaveBeenCalled()
    fireEvent.keyDown(campo, { key: 'Enter' })
    expect(onSend).toHaveBeenCalledWith('listo')
  })

  it('ccm-2: enviar mide --hit-target-min, lleva nombre y se deshabilita con el campo vacio', () => {
    conIntl(<ChatComposer value="" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDisabled()
    const hoja = uiDe('components/ChatComposer.module.css')
    expect(hoja).toMatch(/\.sendBtn\s*\{[^}]*width:\s*var\(--hit-target-min\)/)
  })

  it('ccm-3: las sugerencias son botones con nombre y desaparecen al escribir', () => {
    const { rerender } = conIntl(
      <ChatComposer value="" suggestions={['Estado de la flota']} onChange={() => {}} />,
    )
    expect(screen.getByRole('button', { name: 'Estado de la flota' })).toBeInTheDocument()
    rerender(
      <IntlProvider locale="es">
        <ChatComposer value="qu" suggestions={['Estado de la flota']} onChange={() => {}} />
      </IntlProvider>,
    )
    expect(screen.queryByRole('button', { name: 'Estado de la flota' })).not.toBeInTheDocument()
  })

  it('ccm-5: deshabilitado se dice, no solo se atenua', () => {
    conIntl(<ChatComposer value="x" disabled onChange={() => {}} />)
    const campo = screen.getByRole('textbox')
    expect(campo).toBeDisabled()
    expect(campo.getAttribute('aria-disabled')).toBe('true')
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDisabled()
  })
})

// ── onboarding-carousel ────────────────────────────────────────────────────
const diapositivas = [
  { title: 'Controla tu flota' },
  { title: 'Paga combustible' },
  { title: 'Todo en un lugar' },
]

describe('conformance canon · onboarding-carousel', () => {
  it('onb-1: se puede avanzar sin gesto: el CTA avanza y los puntos son operables', async () => {
    const user = userEvent.setup()
    const onIndexChange = vi.fn()
    conIntl(<OnboardingCarousel slides={diapositivas} index={0} onIndexChange={onIndexChange} />)
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(onIndexChange).toHaveBeenCalledWith(1)
    await user.click(screen.getByRole('button', { name: 'Ir a diapositiva 3' }))
    expect(onIndexChange).toHaveBeenCalledWith(2)
  })

  it('onb-2: los puntos dicen la posicion en texto', () => {
    const { container } = conIntl(<OnboardingCarousel slides={diapositivas} index={1} />)
    expect(container.textContent).toContain('Paso 2 de 3')
  })

  it('onb-3: omitir esta disponible en todas las diapositivas', () => {
    const onSkip = vi.fn()
    const { rerender } = conIntl(<OnboardingCarousel slides={diapositivas} index={0} onSkip={onSkip} />)
    expect(screen.getByRole('button', { name: 'Omitir' })).toBeInTheDocument()
    rerender(
      <IntlProvider locale="es">
        <OnboardingCarousel slides={diapositivas} index={2} onSkip={onSkip} />
      </IntlProvider>,
    )
    expect(screen.getByRole('button', { name: 'Omitir' })).toBeInTheDocument()
  })

  it('onb-4: el CTA cambia a doneLabel solo en la ultima', () => {
    const { rerender } = conIntl(<OnboardingCarousel slides={diapositivas} index={1} />)
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument()
    rerender(
      <IntlProvider locale="es">
        <OnboardingCarousel slides={diapositivas} index={2} doneLabel="Arrancar" />
      </IntlProvider>,
    )
    expect(screen.getByRole('button', { name: 'Arrancar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument()
  })

  it('onb-5: la ilustracion es decorativa y su color sale de tokens --illustration-*', () => {
    const { container } = conIntl(<OnboardingCarousel slides={diapositivas} index={0} />)
    const ilustracion = container.querySelector('[class*="illustration"]')!
    expect(ilustracion.getAttribute('aria-hidden')).toBe('true')
    const fuente = uiDe('components/OnboardingCarousel.tsx')
    expect(fuente).toMatch(/var\(--illustration-/)
    expect(fuente).not.toMatch(/#[0-9a-fA-F]{6}/)
  })
})

// ── biometric ──────────────────────────────────────────────────────────────
describe('conformance canon · biometric', () => {
  it('bio-1: siempre hay salida a passcode', () => {
    conIntl(<BiometricPrompt state="error" onFallback={() => {}} />)
    expect(screen.getByRole('button', { name: 'Usar passcode' })).toBeInTheDocument()
  })

  it('bio-2: cada cambio de estado se anuncia; error con role=alert', () => {
    const { rerender } = conIntl(<BiometricPrompt state="scanning" />)
    expect(screen.getByRole('status')).toHaveTextContent('Verificando...')
    rerender(
      <IntlProvider locale="es">
        <BiometricPrompt state="error" />
      </IntlProvider>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('No reconocido')
  })

  it('bio-4: con prefers-reduced-motion el escaneo no pulsa pero sigue indicando', () => {
    expect(uiDe('components/BiometricPrompt.module.css')).toMatch(/prefers-reduced-motion:\s*reduce/)
  })
})

// ── payment-card ───────────────────────────────────────────────────────────
describe('conformance canon · payment-card', () => {
  it('pc-1: proporcion 1.586 en cualquier ancho', () => {
    expect(uiDe('components/PaymentCard.module.css')).toMatch(/aspect-ratio:\s*1\.586/)
  })

  it('pc-2: nunca muestra el PAN completo ni el CVV', () => {
    const { container } = conIntl(<PaymentCard holder="Ana Ruiz" last4="4821" expires="12/27" />)
    // solo puntos y los ultimos 4; ningun bloque de 16 digitos ni CVV
    expect(container.textContent).toContain('4821')
    expect(container.textContent!.replace(/[^\d]/g, '')).toBe('48211227'.replace(/[^\d]/g, ''))
  })

  it('pc-3: frozen se anuncia por texto, no solo por el velo visual', () => {
    conIntl(<PaymentCard holder="Ana Ruiz" last4="4821" frozen />)
    expect(screen.getByLabelText(/congelada/)).toBeInTheDocument()
  })
})

// ── filters-inline-edit ────────────────────────────────────────────────────
const colsFie = [
  { key: 'placa', label: 'Placa', filterable: true, editable: true },
  { key: 'chofer', label: 'Chofer', filterable: true },
]
const filasFie = [
  { id: 'r1', placa: 'ABC-123', chofer: 'Luis' },
  { id: 'r2', placa: 'XYZ-987', chofer: 'Marta' },
]

describe('conformance canon · filters-inline-edit', () => {
  it('fie-1: cada filtro tiene nombre accesible con su columna', () => {
    conIntl(<FilterableEditableTable columns={colsFie} rows={filasFie} rowKey="id" />)
    expect(screen.getByRole('textbox', { name: 'Filtrar por Placa' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Filtrar por Chofer' })).toBeInTheDocument()
  })

  it('fie-2: el resultado del filtrado se anuncia con las filas restantes', () => {
    const { container } = conIntl(<FilterableEditableTable columns={colsFie} rows={filasFie} rowKey="id" />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Filtrar por Placa' }), { target: { value: 'ABC' } })
    const vivo = container.querySelector('[aria-live="polite"]')!
    expect(vivo.textContent).toBe('1 fila')
  })

  it('fie-3: Enter entra en edicion, Escape descarta y el foco vuelve a la celda', () => {
    const onUpdate = vi.fn()
    conIntl(<FilterableEditableTable columns={colsFie} rows={filasFie} rowKey="id" onUpdate={onUpdate} />)
    const celda = screen.getByRole('button', { name: /ABC-123/ })
    fireEvent.keyDown(celda, { key: 'Enter' })
    const editor = screen.getByDisplayValue('ABC-123')
    fireEvent.change(editor, { target: { value: 'CAMBIO' } })
    fireEvent.keyDown(editor, { key: 'Escape' })
    expect(onUpdate).not.toHaveBeenCalled()
    expect(document.activeElement?.getAttribute('data-cell')).toBe('r1|placa')
  })

  it('fie-5: dibuja carcasa propia en sus filtros — desviacion R3 declarada', () => {
    // los filtros componen Input (que si usa ControlShell); la infraccion
    // declarada del canon vive en la celda editable, que no compone carcasa.
    expect(uiDe('components/FilterableEditableTable.tsx')).not.toMatch(/from '\.\.\/primitives\/ControlShell'/)
  })
})

// ── bulk-actions-pattern ───────────────────────────────────────────────────
const colsBlk = [{ key: 'placa', label: 'Placa' }]
const filasBlk = [
  { id: 'r1', placa: 'ABC-123' },
  { id: 'r2', placa: 'XYZ-987' },
]

describe('conformance canon · bulk-actions-pattern', () => {
  it('blk-1: la barra dice cuantas filas hay seleccionadas y se anuncia al aparecer', async () => {
    const user = userEvent.setup()
    const { container } = conIntl(
      <BulkActionsTable columns={colsBlk} rows={filasBlk} rowKey="id" actions={[{ id: 'del', label: 'Eliminar' }]} />,
    )
    const casillas = screen.getAllByRole('checkbox')
    await user.click(casillas[1])
    const vivo = container.querySelector('[aria-live="polite"]')!
    expect(vivo.textContent).toContain('1 seleccionado')
  })

  it('blk-2: la casilla de cabecera refleja el estado parcial con indeterminate real', async () => {
    const user = userEvent.setup()
    conIntl(<BulkActionsTable columns={colsBlk} rows={filasBlk} rowKey="id" />)
    await user.click(screen.getAllByRole('checkbox')[1])
    const cabecera = screen.getAllByRole('checkbox')[0] as HTMLInputElement
    expect(cabecera.indeterminate).toBe(true)
    expect(cabecera.checked).toBe(false)
  })

  it('blk-5: dibuja carcasa propia — desviacion R3 declarada en el contrato', () => {
    expect(uiDe('components/BulkActionsTable.tsx')).not.toMatch(/from '\.\.\/primitives\/ControlShell'/)
  })
})
