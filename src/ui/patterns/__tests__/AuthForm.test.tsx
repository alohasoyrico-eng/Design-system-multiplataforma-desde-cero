import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { AuthForm } from '../AuthForm'

describe('AuthForm', () => {
  it('renders default title for login mode', () => {
    renderWithIntl(<AuthForm mode="login" onSubmit={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('renders default title for signup mode', () => {
    renderWithIntl(<AuthForm mode="signup" onSubmit={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument()
  })

  it('renders default title for recover mode', () => {
    renderWithIntl(<AuthForm mode="recover" onSubmit={vi.fn()} />)
    expect(screen.getByText('Recuperar contraseña')).toBeInTheDocument()
  })

  it('renders custom title when provided', () => {
    renderWithIntl(<AuthForm mode="login" onSubmit={vi.fn()} title="Bienvenido" />)
    expect(screen.getByText('Bienvenido')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    renderWithIntl(<AuthForm mode="login" onSubmit={vi.fn()} subtitle="Ingresa tus datos" />)
    expect(screen.getByText('Ingresa tus datos')).toBeInTheDocument()
  })

  it('renders custom submit label', () => {
    renderWithIntl(<AuthForm mode="login" onSubmit={vi.fn()} submitLabel="Iniciar sesión" />)
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })

  it('renders default submit label for login', () => {
    renderWithIntl(<AuthForm mode="login" onSubmit={vi.fn()} />)
    // Both title and submit button say "Entrar" in login mode
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('calls onSubmit with form data on valid submission', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderWithIntl(<AuthForm mode="login" onSubmit={onSubmit} />)

    const inputs = screen.getAllByRole('textbox')
    // Type email into the email input
    await user.type(inputs[0], 'ana@test.com')
    // Type password into the password field (not a textbox role, find by placeholder)
    const passInput = screen.getByPlaceholderText('••••••••')
    await user.type(passInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ana@test.com',
        password: 'password123',
        mode: 'login',
      })
    )
  })

  it('shows email validation error for invalid email', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderWithIntl(<AuthForm mode="login" onSubmit={onSubmit} />)

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'invalid-email')

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    await user.click(submitButton)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('renders name field in signup mode', () => {
    renderWithIntl(<AuthForm mode="signup" onSubmit={vi.fn()} />)
    expect(screen.getByPlaceholderText('Ana Sosa')).toBeInTheDocument()
  })

  it('does not render password field in recover mode', () => {
    renderWithIntl(<AuthForm mode="recover" onSubmit={vi.fn()} />)
    expect(screen.queryByPlaceholderText('••••••••')).not.toBeInTheDocument()
  })

  it('renders children content', () => {
    renderWithIntl(
      <AuthForm mode="login" onSubmit={vi.fn()}>
        <p>Forgot password?</p>
      </AuthForm>
    )
    expect(screen.getByText('Forgot password?')).toBeInTheDocument()
  })

  it('renders footer content', () => {
    renderWithIntl(<AuthForm mode="login" onSubmit={vi.fn()} footer={<p>Footer text</p>} />)
    expect(screen.getByText('Footer text')).toBeInTheDocument()
  })

  it('disables submit button when loading', () => {
    renderWithIntl(<AuthForm mode="login" onSubmit={vi.fn()} loading />)
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    expect(submitButton).toBeDisabled()
  })
})
