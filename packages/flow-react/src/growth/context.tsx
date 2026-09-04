import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react'
import type { EventDictionary, GrowthAdapter } from './types'
import dictionary from './events.json'

const events = (dictionary as EventDictionary).events

/* Sin provider, Flow funciona igual: el adapter default no hace nada.
   La medición es opt-in del producto, nunca un requisito del DS. */
const noopAdapter: GrowthAdapter = { track: () => {} }

const GrowthContext = createContext<GrowthAdapter>(noopAdapter)

export interface FlowGrowthProviderProps {
  adapter: GrowthAdapter
  children: ReactNode
}

/**
 * Captura declarativa: un solo listener delegado. Cualquier click que
 * burbujee hasta un nodo con `data-growth-event` se trackea — ninguna
 * pieza de la cascada necesita saber de growth para ser medible:
 *
 *   <div data-growth-event="unit_added" data-growth-source="manual">
 *     <Button icon="add">Agregar unidad</Button>
 *   </div>
 *
 * Los `data-growth-*` restantes viajan como props del evento.
 */
function readGrowthProps(el: HTMLElement): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(el.dataset)) {
    if (key === 'growthEvent' || !key.startsWith('growth')) continue
    // dataset camelCase → prop snake_case: growthRangeDays → range_days
    const name = key
      .slice('growth'.length)
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '')
    props[name] = value
  }
  return props
}

export function FlowGrowthProvider({ adapter, children }: FlowGrowthProviderProps) {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      const node = target?.closest<HTMLElement>('[data-growth-event]')
      if (!node) return
      const event = node.dataset.growthEvent
      if (!event) return
      if (import.meta.env?.DEV) warnUnregistered(event)
      adapter.track(event, readGrowthProps(node))
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [adapter])

  return <GrowthContext.Provider value={adapter}>{children}</GrowthContext.Provider>
}

function warnUnregistered(event: string) {
  const def = events[event]
  if (!def) {
    console.warn(
      `[flow/growth] "${event}" no existe en el diccionario (src/growth/events.json). ` +
      'Proponlo ahí — research lo aprueba antes de que llegue a producción.',
    )
  } else if (def.status !== 'approved') {
    console.warn(`[flow/growth] "${event}" está en status "${def.status}" — research aún no lo aprueba.`)
  }
}

/** Función de tracking governada: en dev avisa si el evento no está aprobado. */
export function useTrack() {
  const adapter = useContext(GrowthContext)
  return useCallback(
    (event: string, props?: Record<string, unknown>) => {
      if (import.meta.env?.DEV) warnUnregistered(event)
      adapter.track(event, props)
    },
    [adapter],
  )
}

/** Adapter completo (track / identify / variant) para casos avanzados. */
export function useGrowth(): GrowthAdapter {
  return useContext(GrowthContext)
}

/**
 * Variante asignada de un experimento. Reporta la exposición una sola vez
 * por render del hook (evento `experiment_exposed`). Sin adapter con
 * soporte de experimentos, devuelve `fallback` y no reporta nada.
 */
export function useExperiment(experiment: string, fallback: string): string {
  const adapter = useContext(GrowthContext)
  return useMemo(() => {
    const variant = adapter.variant?.(experiment)
    if (variant === undefined) return fallback
    adapter.track('experiment_exposed', { experiment, variant })
    return variant
  }, [adapter, experiment, fallback])
}
