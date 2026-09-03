import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { FlowModeProvider, useFlowMode } from '../FlowMode'

function Sonda() {
  const { resolved, toggle } = useFlowMode()
  return <button onClick={toggle}>modo: {resolved}</button>
}

describe('FlowModeProvider', () => {
  it('administra data-mode en el html y alterna', async () => {
    render(
      <FlowModeProvider defaultMode="light">
        <Sonda />
      </FlowModeProvider>,
    )
    expect(document.documentElement.hasAttribute('data-mode')).toBe(false)
    await userEvent.click(screen.getByRole('button'))
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark')
    expect(screen.getByRole('button')).toHaveTextContent('modo: dark')
  })
})
