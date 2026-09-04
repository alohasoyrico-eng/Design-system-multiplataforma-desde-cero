/**
 * Conformance con el canon — tanda 11 (las cuatro decisiones del 4-sep).
 * - Toast gana duration con pausa en hover/foco (tst-2)
 * - Gantt gana dependsOn con conectores y ciclo declarado (gnt-2)
 * - AuthOTPScreen gana el paso SMS con one-time-code (ao-2) y el passcode
 *   sigue sin quedar legible (ao-4)
 * - La escala de iconos quedo recortada a 16/20/24 (+display) — eso lo
 *   vigila scripts/check-icons.mjs, no un test.
 */
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { IntlProvider } from 'react-intl'
import { Toast } from '../ui/primitives/Toast'
import { GanttChart } from '../ui/components/GanttChart'
import { AuthOTPScreen } from '../pages/mobile/AuthOTPScreen'

afterEach(() => vi.useRealTimers())

// ── toast: duration con pausa ──────────────────────────────────────────────
describe('conformance canon · toast (duration)', () => {
  it('tst-2: con accion, el toast no desaparece por tiempo mientras el puntero esta encima o el foco esta dentro', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(
      <Toast message="Fila eliminada" actionLabel="Deshacer" onAction={() => {}} duration={4000} onDismiss={onDismiss} />,
    )
    const toast = screen.getByRole('status')

    // el puntero entra: el temporizador se congela
    fireEvent.mouseEnter(toast)
    act(() => { vi.advanceTimersByTime(10000) })
    expect(onDismiss).not.toHaveBeenCalled()

    // el puntero sale y el foco entra al boton de accion: sigue congelado
    fireEvent.mouseLeave(toast)
    fireEvent.focus(screen.getByRole('button', { name: 'Deshacer' }))
    act(() => { vi.advanceTimersByTime(10000) })
    expect(onDismiss).not.toHaveBeenCalled()

    // el foco sale del toast: el temporizador corre y descarta
    fireEvent.blur(screen.getByRole('button', { name: 'Deshacer' }), { relatedTarget: document.body })
    act(() => { vi.advanceTimersByTime(4000) })
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('tst-2: sin duration no hay auto-descarte', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<Toast message="Persistente" onDismiss={onDismiss} />)
    act(() => { vi.advanceTimersByTime(60000) })
    expect(onDismiss).not.toHaveBeenCalled()
  })
})

// ── gantt: dependencias ────────────────────────────────────────────────────
describe('conformance canon · chart-gantt (dependsOn)', () => {
  it('gnt-2: una dependencia circular no cuelga el render ni dibuja flechas infinitas: se detecta y se declara', () => {
    render(
      <GanttChart tasks={[
        { id: 'a', name: 'Cimientos', start: '2026-09-01', end: '2026-09-03', dependsOn: ['b'] },
        { id: 'b', name: 'Muros', start: '2026-09-03', end: '2026-09-06', dependsOn: ['a'] },
      ]} />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(/Dependencia circular detectada: (Cimientos → Muros → Cimientos|Muros → Cimientos → Muros)/)
    expect(document.querySelectorAll('polyline')).toHaveLength(0)
  })

  it('gnt-2: una dependencia valida dibuja su conector', () => {
    const { container } = render(
      <GanttChart tasks={[
        { id: 'a', name: 'Cimientos', start: '2026-09-01', end: '2026-09-03' },
        { id: 'b', name: 'Muros', start: '2026-09-03', end: '2026-09-06', dependsOn: ['a'] },
      ]} />,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    const conector = container.querySelector('polyline')!
    expect(conector).not.toBeNull()
    expect(conector.getAttribute('points')).not.toMatch(/NaN/)
  })
})

// ── auth-otp: paso SMS ─────────────────────────────────────────────────────
describe('conformance canon · auth-otp', () => {
  it('ao-2: el codigo se autorrellena desde el SMS: un solo input con autocomplete one-time-code', async () => {
    const user = userEvent.setup()
    render(<IntlProvider locale="es"><AuthOTPScreen /></IntlProvider>)
    await user.click(screen.getByRole('button', { name: 'Usar passcode' }))
    await user.click(screen.getByRole('button', { name: 'Recibir código por SMS' }))
    const inputs = document.querySelectorAll('input')
    expect(inputs).toHaveLength(1)
    expect(inputs[0].getAttribute('autocomplete')).toBe('one-time-code')
    expect(inputs[0].getAttribute('inputmode')).toBe('numeric')
  })

  it('ao-4: el passcode no queda legible en el DOM en ningun momento', async () => {
    const user = userEvent.setup()
    render(<IntlProvider locale="es"><AuthOTPScreen /></IntlProvider>)
    await user.click(screen.getByRole('button', { name: 'Usar passcode' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '7' }))
    // ni input con el valor, ni el valor como texto contiguo fuera del teclado
    expect(document.querySelector('input')).toBeNull()
    expect(document.body.textContent).not.toContain('317')
  })
})
