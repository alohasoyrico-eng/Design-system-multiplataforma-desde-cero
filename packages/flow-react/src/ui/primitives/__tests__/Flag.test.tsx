import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Flag } from '../Flag'

describe('Flag', () => {
  it('renders with the correct country class', () => {
    const { container } = render(<Flag country="mx" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('fi-mx')
  })

  it('sets role img and aria-label when label is provided', () => {
    render(<Flag country="us" label="United States" />)
    const flag = screen.getByRole('img')
    expect(flag).toHaveAttribute('aria-label', 'United States')
  })

  it('is aria-hidden when no label is provided', () => {
    const { container } = render(<Flag country="fr" />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom size', () => {
    const { container } = render(<Flag country="de" size={32} />)
    expect(container.firstChild).toHaveStyle({ width: '32px', height: '32px' })
  })

  it('applies shape as border-radius', () => {
    const { container } = render(<Flag country="jp" shape="square" />)
    expect(container.firstChild).toHaveStyle({ borderRadius: '0' })
  })

  it('removes ring shadow when ring is false', () => {
    const { container } = render(<Flag country="br" ring={false} />)
    expect(container.firstChild).toHaveStyle({ boxShadow: 'none' })
  })

  // Regresión 5-sep: el CSS de flag-icons DEBE ser global. Dentro de un CSS
  // Module, lightningcss hashea sus clases (.Xxx_fi-mx) y el componente pone
  // las globales (fi fi-mx): banderas invisibles en 0.4.0/0.5.0.
  it('flag-icons entra global desde styles.css, jamas desde el module', () => {
    const { readFileSync } = require('node:fs') as typeof import('node:fs')
    const { join } = require('node:path') as typeof import('node:path')
    const styles = readFileSync(join(__dirname, '../../../styles.css'), 'utf8')
    const modulo = readFileSync(join(__dirname, '../Flag.module.css'), 'utf8')
    expect(styles).toMatch(/@import "flag-icons\/css\/flag-icons\.min\.css"/)
    expect(modulo).not.toMatch(/@import/)
  })
})
