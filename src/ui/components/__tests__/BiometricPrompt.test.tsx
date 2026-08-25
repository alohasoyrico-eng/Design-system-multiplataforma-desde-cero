import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { BiometricPrompt } from '../BiometricPrompt'

describe('BiometricPrompt', () => {
  it('renders title and description', () => {
    renderWithIntl(<BiometricPrompt title="Confirmar pago" description="Usa tu rostro para autorizar" />)
    expect(screen.getByText('Confirmar pago')).toBeInTheDocument()
    expect(screen.getByText('Usa tu rostro para autorizar')).toBeInTheDocument()
  })

  it('renders biometric button with face method label', () => {
    renderWithIntl(<BiometricPrompt method="face" />)
    expect(screen.getByRole('button', { name: /Reconocimiento facial/ })).toBeInTheDocument()
  })

  it('renders biometric button with fingerprint method label', () => {
    renderWithIntl(<BiometricPrompt method="fingerprint" />)
    expect(screen.getByRole('button', { name: /Huella digital/ })).toBeInTheDocument()
  })

  it('calls onUse when biometric button is clicked', async () => {
    const user = userEvent.setup()
    const onUse = vi.fn()
    renderWithIntl(<BiometricPrompt onUse={onUse} />)
    await user.click(screen.getByRole('button', { name: /Reconocimiento facial/ }))
    expect(onUse).toHaveBeenCalledOnce()
  })

  it('disables biometric button during scanning', () => {
    renderWithIntl(<BiometricPrompt state="scanning" />)
    expect(screen.getByRole('button', { name: /Reconocimiento facial/ })).toBeDisabled()
  })

  it('disables biometric button on success', () => {
    renderWithIntl(<BiometricPrompt state="success" />)
    expect(screen.getByRole('button', { name: /Reconocimiento facial/ })).toBeDisabled()
  })

  it('shows state label for scanning', () => {
    renderWithIntl(<BiometricPrompt state="scanning" />)
    expect(screen.getByText('Verificando...')).toBeInTheDocument()
  })

  it('shows state label for success', () => {
    renderWithIntl(<BiometricPrompt state="success" />)
    expect(screen.getByText('Verificado')).toBeInTheDocument()
  })

  it('shows state label for error with alert role', () => {
    renderWithIntl(<BiometricPrompt state="error" />)
    expect(screen.getByRole('alert')).toHaveTextContent('No reconocido')
  })

  it('does not show state label in idle state', () => {
    renderWithIntl(<BiometricPrompt state="idle" />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('sets data-state on biometric button', () => {
    renderWithIntl(<BiometricPrompt state="error" />)
    const btn = screen.getByRole('button', { name: /Reconocimiento facial/ })
    expect(btn).toHaveAttribute('data-state', 'error')
  })

  it('renders fallback button', () => {
    renderWithIntl(<BiometricPrompt />)
    expect(screen.getByRole('button', { name: 'Usar passcode' })).toBeInTheDocument()
  })

  it('renders custom fallback label', () => {
    renderWithIntl(<BiometricPrompt fallbackLabel="Usar PIN" />)
    expect(screen.getByRole('button', { name: 'Usar PIN' })).toBeInTheDocument()
  })
})
