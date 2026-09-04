/**
 * Conformance con el canon — criterios que viven en el banco de plantillas
 * (la capa templates): auth-otp (ao-2/ao-4) y onboarding-driver (od-3).
 * Las piezas del DS llegan por el paquete; las pantallas, por ruta relativa.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { IntlProvider } from 'react-intl'
import { AuthOTPScreen } from '../pages/mobile/AuthOTPScreen'

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

// ── onboarding-driver (paso de documentos) ─────────────────────────────────
describe('conformance canon · onboarding-driver (documentos)', () => {
  it('od-3: subir se puede sin arrastrar — el paso docs compone FileUpload, cuya zona es boton (upl-1)', () => {
    const src = readFileSync(join(__dirname, '..', 'pages', 'mobile', 'OnboardingDriverScreen.tsx'), 'utf8')
    expect(src).toMatch(/step === 'docs'/)
    expect(src).toMatch(/<FileUpload/)
    expect(src).toMatch(/'smsCode', 'docs', 'card'/)
  })
})
