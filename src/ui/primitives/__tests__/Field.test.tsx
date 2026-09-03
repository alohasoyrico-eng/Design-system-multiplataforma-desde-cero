import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Field } from '../Field'

describe('Field', () => {
  it('renders label text', () => {
    render(<Field label="Correo" htmlFor="email"><input id="email" /></Field>)
    expect(screen.getByText('Correo')).toBeInTheDocument()
  })

  it('associates label with control via htmlFor', () => {
    render(<Field label="Correo" htmlFor="email"><input id="email" /></Field>)
    expect(screen.getByLabelText('Correo')).toBeInTheDocument()
  })

  it('shows required asterisk', () => {
    const { container } = render(
      <Field label="Nombre" htmlFor="name" required><input id="name" /></Field>
    )
    expect(container.querySelector('.required')).toHaveTextContent('*')
  })

  it('shows help text', () => {
    render(<Field label="Tel" htmlFor="tel" help="Incluye lada"><input id="tel" /></Field>)
    expect(screen.getByText('Incluye lada')).toBeInTheDocument()
  })

  it('shows error message with alert role', () => {
    render(<Field label="Email" htmlFor="em" error="Inválido"><input id="em" /></Field>)
    expect(screen.getByRole('alert')).toHaveTextContent('Inválido')
  })

  it('error message overrides help text', () => {
    render(
      <Field label="Email" htmlFor="em" help="tu@correo" error="Requerido"><input id="em" /></Field>
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Requerido')
    expect(screen.queryByText('tu@correo')).not.toBeInTheDocument()
  })

  it('shows valid message with check icon', () => {
    const { container } = render(
      <Field label="Email" htmlFor="em" valid validMessage="Correcto"><input id="em" /></Field>
    )
    expect(screen.getByText('Correcto')).toBeInTheDocument()
    expect(container.querySelector('.validIcon')).toBeInTheDocument()
  })

  it('sets data-error on root when error is present', () => {
    const { container } = render(
      <Field label="X" htmlFor="x" error="Bad"><input id="x" /></Field>
    )
    expect(container.firstChild).toHaveAttribute('data-error')
  })
})

describe('Field · conformance fld-2/fld-4', () => {
  it('el control queda referenciado al mensaje y marcado invalido con error', () => {
    render(
      <Field label="Correo" htmlFor="mail" error="No es un correo válido">
        <input id="mail" />
      </Field>,
    )
    const input = screen.getByLabelText('Correo')
    expect(input).toHaveAttribute('aria-describedby', 'mail-msg')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('No es un correo válido')
  })

  it('requerido viaja al control como aria-required', () => {
    render(
      <Field label="Nombre" htmlFor="n" required>
        <input id="n" />
      </Field>,
    )
    expect(screen.getByLabelText(/Nombre/)).toHaveAttribute('aria-required', 'true')
  })
})
