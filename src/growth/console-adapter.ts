import type { GrowthAdapter } from './types'

/* Adapter de desarrollo: loggea cada evento en consola con formato legible.
   Es como research y QA validan instrumentación sin conectar un proveedor.
   En producción se reemplaza por el adapter real (Mixpanel, Firebase, etc.). */
export const consoleAdapter: GrowthAdapter = {
  track(event, props) {
    console.info(`[growth] ${event}`, props ?? {})
  },
  identify(id, traits) {
    console.info(`[growth] identify ${id}`, traits ?? {})
  },
  variant() {
    return undefined
  },
}
