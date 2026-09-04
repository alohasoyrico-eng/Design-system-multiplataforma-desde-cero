export interface DomainMeta {
  token: string
  icon: string
  label: string
}

export const DOMAIN: Record<string, DomainMeta> = {
  combustible:      { token: 'var(--viz-combustible)',    icon: 'local_gas_station', label: 'Combustible' },
  peaje:            { token: 'var(--viz-peaje)',          icon: 'toll',              label: 'Peaje' },
  mantenimiento:    { token: 'var(--viz-mantenimiento)',  icon: 'build',             label: 'Mantenimiento' },
  electromovilidad: { token: 'var(--viz-electro)',        icon: 'ev_station',        label: 'Electromovilidad' },
  preventivo:       { token: 'var(--viz-1)',              icon: 'verified_user',     label: 'Preventivo' },
  correctivo:       { token: 'var(--viz-3)',               icon: 'handyman',          label: 'Correctivo' },
  llantas:          { token: 'var(--viz-4)',              icon: 'tire_repair',       label: 'Llantas' },
  combustion:       { token: 'var(--viz-combustible)',    icon: 'local_gas_station', label: 'Combustión' },
  electricas:       { token: 'var(--viz-electro)',        icon: 'ev_station',        label: 'Eléctricas' },
  hibridas:         { token: 'var(--viz-1)',              icon: 'sync_alt',          label: 'Híbridas' },
  viajes:           { token: 'var(--viz-viajes)',          icon: 'navigation',        label: 'Viajes' },
  ingreso:          { token: 'var(--viz-positive)',       icon: 'trending_up',       label: 'Ingreso' },
  costo:            { token: 'var(--viz-combustible)',    icon: 'payments',          label: 'Costo' },
  gasto:            { token: 'var(--viz-combustible)',    icon: 'payments',          label: 'Gasto' },
  precio:           { token: 'var(--viz-peaje)',          icon: 'sell',              label: 'Precio' },
}

export function domainFor(label: string): DomainMeta | undefined {
  const key = label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return DOMAIN[key]
}
