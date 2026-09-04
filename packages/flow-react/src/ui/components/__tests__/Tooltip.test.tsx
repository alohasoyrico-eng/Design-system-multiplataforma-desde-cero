import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Tooltip } from '../Tooltip'

describe('Tooltip', () => {
  it('renders children', () => {
    render(<Tooltip content="Ayuda"><button>Hover me</button></Tooltip>)
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument()
  })

  it('does not show tooltip content by default', () => {
    render(<Tooltip content="Texto de ayuda"><span>Trigger</span></Tooltip>)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('does not render tooltip text initially', () => {
    render(<Tooltip content="Info secreta"><span>Target</span></Tooltip>)
    expect(screen.queryByText('Info secreta')).not.toBeInTheDocument()
  })
})
