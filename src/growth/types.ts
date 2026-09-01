/* Flow · Foundation · Growth
   Contrato agnóstico de proveedor para medición y experimentos.
   Mixpanel, Amplitude o PostHog se conectan implementando GrowthAdapter —
   Flow no depende de ninguno. */

export interface GrowthAdapter {
  /** Envía un evento. `event` debe existir en el diccionario (events.json). */
  track(event: string, props?: Record<string, unknown>): void
  /** Asocia la sesión a un usuario. Opcional según proveedor. */
  identify?(id: string, traits?: Record<string, unknown>): void
  /** Variante asignada para un experimento, o undefined si no participa. */
  variant?(experiment: string): string | undefined
}

export type EventStatus = 'proposed' | 'approved' | 'deprecated'

export interface EventDefinition {
  description: string
  /** Props esperadas del evento (nombres en snake_case). */
  props: string[]
  /** Solo research aprueba: proposed → approved. */
  status: EventStatus
  /** Superficie(s) donde se dispara: template, pattern o producto. */
  surfaces: string[]
}

export interface EventDictionary {
  /** Equipo dueño del diccionario. Los cambios de status pasan por ellos. */
  owner: string
  events: Record<string, EventDefinition>
}
