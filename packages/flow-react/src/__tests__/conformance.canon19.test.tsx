/**
 * Conformance con el canon — tanda 19: el registro de especímenes.
 * La tercera pata de cada pieza: el contrato promete, la ficha describe,
 * el specimen demuestra (spm-1..spm-3).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { IntlProvider } from 'react-intl'
import { SPECIMENS } from '../specimens'
import fichas from '../data/items.json'

// jsdom no trae ResizeObserver (SegmentedControl/Tabs miden su indicador)
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', MockResizeObserver)

const fuente = (rel: string) => readFileSync(join(__dirname, rel), 'utf8')

describe('conformance canon · specimen-registry', () => {
  it('spm-1: todo specimen apunta a una ficha existente y el registro solo crece', () => {
    const ids = Object.keys(SPECIMENS)
    for (const id of ids) {
      expect(fichas, `specimen "${id}" sin ficha`).toHaveProperty(id)
    }
    // ratchet: como el --min de conformance, este numero solo puede subir
    expect(ids.length).toBeGreaterThanOrEqual(36)
  })

  it('spm-2: el entry de la libreria no importa specimens — quien no documenta no lo paga', () => {
    expect(fuente('../ui/lib.ts')).not.toMatch(/specimens/)
    expect(fuente('../ui/lib-entry.ts')).not.toMatch(/specimens/)
    const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'))
    expect(pkg.exports['./specimens']).toBeDefined()
  })

  it('spm-3: cada specimen se rinde sin errores con sus variantes y tamanos declarados', () => {
    for (const [id, sp] of Object.entries(SPECIMENS)) {
      const variants = sp.variants?.length ? sp.variants : ['default']
      const sizes = sp.sizes?.length ? sp.sizes : ['md']
      for (const variant of variants) {
        for (const size of sizes) {
          const { unmount } = render(
            <IntlProvider locale="es">
              <div data-specimen={id}>{sp.render({ variant, size, density: 'default' })}</div>
            </IntlProvider>,
          )
          unmount()
        }
      }
    }
  })
})
