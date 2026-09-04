import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { renderWithIntl } from '../../../test-utils'
import { ChatComposer } from '../ChatComposer'

describe('ChatComposer', () => {
  it('renders textarea with placeholder', () => {
    renderWithIntl(<ChatComposer />)
    expect(screen.getByRole('textbox', { name: 'Pregunta sobre tu flota…' })).toBeInTheDocument()
  })

  it('renders custom placeholder', () => {
    renderWithIntl(<ChatComposer placeholder="Escribe algo" />)
    expect(screen.getByRole('textbox', { name: 'Escribe algo' })).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithIntl(<ChatComposer value="" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'h')
    expect(onChange).toHaveBeenCalledWith('h')
  })

  it('calls onSend when send button is clicked', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    renderWithIntl(<ChatComposer value="Hello" onSend={onSend} />)
    await user.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(onSend).toHaveBeenCalledWith('Hello')
  })

  it('disables send button when value is empty', () => {
    renderWithIntl(<ChatComposer value="" />)
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDisabled()
  })

  it('disables send button when only whitespace', () => {
    renderWithIntl(<ChatComposer value="   " />)
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDisabled()
  })

  it('sends on Enter key', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    renderWithIntl(<ChatComposer value="Hello" onSend={onSend} />)
    await user.click(screen.getByRole('textbox'))
    await user.keyboard('{Enter}')
    expect(onSend).toHaveBeenCalledWith('Hello')
  })

  it('renders suggestion buttons', () => {
    renderWithIntl(<ChatComposer suggestions={['Hola', 'Ayuda']} />)
    expect(screen.getByRole('button', { name: 'Hola' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ayuda' })).toBeInTheDocument()
  })

  it('calls onSend when suggestion is clicked', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    renderWithIntl(<ChatComposer suggestions={['Hola']} onSend={onSend} />)
    await user.click(screen.getByRole('button', { name: 'Hola' }))
    expect(onSend).toHaveBeenCalledWith('Hola')
  })

  it('disables textarea when disabled', () => {
    renderWithIntl(<ChatComposer disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
