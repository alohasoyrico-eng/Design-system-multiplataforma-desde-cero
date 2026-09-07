import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Progress } from '../Progress'

describe('Progress', () => {
  it('renders a progressbar role', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow and aria-valuemax', () => {
    render(<Progress value={30} max={200} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(bar).toHaveAttribute('aria-valuemax', '200')
  })

  it('renders label text', () => {
    render(<Progress value={10} label="Progreso" />)
    expect(screen.getByText('Progreso')).toBeInTheDocument()
  })

  it('shows value fraction when showValue is true', () => {
    render(<Progress value={25} max={50} showValue />)
    expect(screen.getByText('25/50')).toBeInTheDocument()
  })

  it('does not show value fraction by default', () => {
    const { container } = render(<Progress value={25} max={50} />)
    expect(container.textContent).not.toContain('25/50')
  })

  it('sets tone data attribute on the bar', () => {
    const { container } = render(<Progress value={50} tone="warning" />)
    const bar = container.querySelector('[data-tone="warning"]')
    expect(bar).toBeInTheDocument()
  })

  it('defaults tone to accent', () => {
    const { container } = render(<Progress value={50} />)
    const bar = container.querySelector('[data-tone="accent"]')
    expect(bar).toBeInTheDocument()
  })

  // El contrato canonico promete tone accent|success|warning|ink; el codigo
  // implementaba solo dos y la deriva vivio invisible (7-sep-2026). Este test
  // ancla la union completa contra el CSS por tokens.
  it('implementa los cuatro tonos del contrato con tokens de status/tinta', () => {
    const hoja = readFileSync(join(__dirname, '../Progress.module.css'), 'utf8')
    for (const [tono, token] of [
      ['accent', '--action-accent'],
      ['success', '--status-success'],
      ['warning', '--status-warning'],
      ['ink', '--text-primary'],
    ]) {
      expect(hoja).toMatch(new RegExp(`data-tone='${tono}'\\][^}]*var\\(${token}\\)`))
      const { container, unmount } = render(<Progress value={50} tone={tono as 'accent'} />)
      expect(container.querySelector(`[data-tone="${tono}"]`)).toBeInTheDocument()
      unmount()
    }
  })
})
