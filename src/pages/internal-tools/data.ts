export const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'agente', label: 'Agente de soporte' },
  { value: 'pricing', label: 'Pricing / Finanzas' },
  { value: 'ops', label: 'Ops / Back-office' },
  { value: 'growth', label: 'Growth / Producto' },
] as const

export type RoleId = 'admin' | 'agente' | 'pricing' | 'ops' | 'growth'

export const NAV = [
  { id: 'resumen', label: 'Resumen', icon: 'space_dashboard', path: '/internal-tools', roles: ['admin', 'agente', 'pricing', 'ops', 'growth'] },
  { id: 'tickets', label: 'Tickets', icon: 'confirmation_number', path: '/internal-tools/tickets', roles: ['admin', 'agente'] },
  { id: 'cuentas', label: 'Cuentas', icon: 'apartment', path: '/internal-tools/cuentas', roles: ['admin', 'agente', 'pricing', 'ops', 'growth'] },
  { id: 'pricing', label: 'Pricing', icon: 'sell', path: '/internal-tools/pricing', roles: ['admin', 'pricing'] },
  { id: 'casos', label: 'Casos', icon: 'gavel', path: '/internal-tools/casos', roles: ['admin', 'agente'] },
  { id: 'backoffice', label: 'Back-office', icon: 'fact_check', path: '/internal-tools/backoffice', roles: ['admin', 'ops'] },
  { id: 'growth', label: 'Growth · Onboarding', icon: 'trending_up', path: '/internal-tools/growth', roles: ['admin', 'growth'] },
] as const

export const PRIORITY_TONE: Record<string, 'danger' | 'warning' | 'default'> = {
  alta: 'danger',
  media: 'warning',
  baja: 'default',
}

export const STATUS_TONE: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  abierto: 'info',
  'en progreso': 'info',
  'esperando cliente': 'warning',
  cerrado: 'default',
  abierta: 'info',
  investigando: 'info',
  resuelta: 'success',
  rechazada: 'default',
  'pendiente aprobacion': 'warning',
  pendiente: 'warning',
  aprobado: 'success',
  rechazado: 'default',
  vigente: 'success',
  borrador: 'default',
  activa: 'success',
  'en revision': 'warning',
  suspendida: 'default',
}

// ── Tickets ──

export interface TicketMessage {
  role: 'user' | 'agent'
  text: string
  timestamp: string
}

export interface Ticket {
  [key: string]: unknown
  id: string
  subject: string
  who: string
  channel: string
  priority: string
  status: string
  assignee: string
  updated: string
  thread: TicketMessage[]
}

export const TICKETS: Ticket[] = [
  { id: 'T-1042', subject: 'No se refleja el pago de esta semana', who: 'Ana Sosa', channel: 'chat', priority: 'alta', status: 'abierto', assignee: 'Marta Vidal', updated: 'hace 12 min',
    thread: [
      { role: 'user', text: 'Hice 14 viajes esta semana pero mi resumen muestra solo 9. ¿Pueden revisar?', timestamp: '09:14' },
      { role: 'agent', text: 'Claro Ana, dame un momento para revisar tu historial de viajes contra el corte de pago.', timestamp: '09:16' },
      { role: 'agent', text: 'Encontré el problema: 5 viajes quedaron en un corte anterior por un error de sincronización. Los agrego a tu próximo depósito.', timestamp: '09:22' },
    ] },
  { id: 'T-1041', subject: 'Solicita factura de comisión', who: 'Transportes Vidal SA', channel: 'email', priority: 'media', status: 'en progreso', assignee: 'Diego Ruiz', updated: 'hace 1 h',
    thread: [
      { role: 'user', text: 'Necesitamos la factura de comisión de junio para nuestra contabilidad.', timestamp: 'ayer' },
      { role: 'agent', text: 'La genero y te la envío a este correo en un par de horas.', timestamp: 'ayer' },
    ] },
  { id: 'T-1038', subject: 'App no detecta ubicación', who: 'Luis Prieto', channel: 'teléfono', priority: 'alta', status: 'esperando cliente', assignee: 'Marta Vidal', updated: 'hace 3 h',
    thread: [
      { role: 'agent', text: 'Pedimos que actualices los permisos de ubicación a "Siempre" en ajustes del teléfono. ¿Puedes confirmarnos si ya quedó?', timestamp: '11:02' },
    ] },
  { id: 'T-1035', subject: 'Duda sobre bono de fin de semana', who: 'Rosa Duarte', channel: 'chat', priority: 'baja', status: 'cerrado', assignee: 'Diego Ruiz', updated: 'ayer',
    thread: [
      { role: 'user', text: '¿El bono de fin de semana aplica también a viajes con tarjeta?', timestamp: 'ayer' },
      { role: 'agent', text: 'Sí, aplica a todos los métodos de pago dentro del horario del bono.', timestamp: 'ayer' },
    ] },
  { id: 'T-1033', subject: 'No puede agregar tarjeta nueva', who: 'Marco Gil', channel: 'chat', priority: 'media', status: 'abierto', assignee: 'Sin asignar', updated: 'hace 40 min',
    thread: [
      { role: 'user', text: 'Intento agregar mi tarjeta y me marca "número inválido" aunque la escribo bien.', timestamp: '10:20' },
    ] },
  { id: 'T-1030', subject: 'Cobro duplicado en viaje', who: 'Elena Ruz', channel: 'email', priority: 'alta', status: 'en progreso', assignee: 'Marta Vidal', updated: 'hace 2 h',
    thread: [
      { role: 'user', text: 'Me cobraron dos veces el viaje del martes por la tarde.', timestamp: '09:40' },
      { role: 'agent', text: 'Confirmado el duplicado, ya inicié el reembolso de una de las cargas.', timestamp: '10:05' },
    ] },
  { id: 'T-1028', subject: 'Cambio de unidad no se refleja', who: 'KTR Flotillas', channel: 'email', priority: 'media', status: 'cerrado', assignee: 'Diego Ruiz', updated: 'hace 2 días',
    thread: [
      { role: 'agent', text: 'Listo, ya actualizamos la unidad asignada en el sistema.', timestamp: 'lunes' },
    ] },
  { id: 'T-1025', subject: 'Pregunta sobre cobertura de seguro', who: 'Pablo Mena', channel: 'teléfono', priority: 'baja', status: 'esperando cliente', assignee: 'Sin asignar', updated: 'hace 5 h',
    thread: [
      { role: 'agent', text: 'Te compartimos la póliza por correo, avísanos si tienes dudas.', timestamp: '08:30' },
    ] },
]

// ── Accounts ──

export interface AccountActivity {
  title: string
  timestamp: string
  status: 'done' | 'active' | 'error'
}

export interface AccountTicket {
  id: string
  subject: string
  status: string
}

export interface Account {
  [key: string]: unknown
  id: string
  name: string
  type: 'Flota' | 'Conductor'
  metric: string
  status: string
  since: string
  activity: AccountActivity[]
  tickets: AccountTicket[]
}

export const ACCOUNTS: Account[] = [
  { id: 'A-1', name: 'Transportes Vidal SA', type: 'Flota', metric: '42 unidades', status: 'activa', since: '2022',
    activity: [
      { title: 'Alta de 3 unidades nuevas', timestamp: 'hace 2 días', status: 'done' },
      { title: 'Renovación de póliza', timestamp: 'hace 1 semana', status: 'done' },
      { title: 'Solicitud de factura', timestamp: 'hace 1 h', status: 'active' },
    ],
    tickets: [
      { id: 'T-1041', subject: 'Solicita factura de comisión', status: 'en progreso' },
    ] },
  { id: 'A-2', name: 'Rutas Cobalto', type: 'Flota', metric: '18 unidades', status: 'en revision', since: '2023',
    activity: [
      { title: 'Documentos KYB enviados', timestamp: 'hace 3 días', status: 'done' },
      { title: 'Revisión de documentos', timestamp: 'hace 1 día', status: 'active' },
    ],
    tickets: [
      { id: 'C-500', subject: 'Fraude sospechado', status: 'abierta' },
    ] },
  { id: 'A-3', name: 'Ana Sosa', type: 'Conductor', metric: '1,240 viajes', status: 'activa', since: '2021',
    activity: [
      { title: 'Último viaje completado', timestamp: 'hace 12 min', status: 'done' },
      { title: 'Actualización de datos bancarios', timestamp: 'hace 3 días', status: 'done' },
    ],
    tickets: [
      { id: 'T-1042', subject: 'No se refleja el pago de esta semana', status: 'abierto' },
    ] },
  { id: 'A-4', name: 'Luis Prieto', type: 'Conductor', metric: '870 viajes', status: 'suspendida', since: '2022',
    activity: [
      { title: 'Cuenta suspendida por documentos vencidos', timestamp: 'hace 5 días', status: 'error' },
    ],
    tickets: [
      { id: 'T-1038', subject: 'App no detecta ubicación', status: 'esperando cliente' },
    ] },
  { id: 'A-5', name: 'Marco Gil', type: 'Conductor', metric: '320 viajes', status: 'activa', since: '2024',
    activity: [
      { title: 'Registro completado', timestamp: 'hace 2 meses', status: 'done' },
    ],
    tickets: [
      { id: 'T-1033', subject: 'No puede agregar tarjeta nueva', status: 'abierto' },
    ] },
  { id: 'A-6', name: 'KTR Flotillas', type: 'Flota', metric: '8 unidades', status: 'activa', since: '2024',
    activity: [
      { title: 'Alta completada', timestamp: 'hace 1 mes', status: 'done' },
    ],
    tickets: [] },
  { id: 'A-7', name: 'Elena Ruz', type: 'Conductor', metric: '2,100 viajes', status: 'activa', since: '2020',
    activity: [
      { title: 'Último viaje completado', timestamp: 'hace 2 h', status: 'done' },
    ],
    tickets: [
      { id: 'T-1030', subject: 'Cobro duplicado en viaje', status: 'en progreso' },
    ] },
]

// ── Pricing ──

export interface PricingRule {
  [key: string]: unknown
  id: string
  name: string
  scope: string
  type: string
  value: string
  status: string
  by: string
}

export const PRICING_RULES: PricingRule[] = [
  { id: 'P-101', name: 'Tarifa base CDMX', scope: 'Ciudad · CDMX', type: 'Base', value: '$10.50/km', status: 'vigente', by: 'Marta Vidal' },
  { id: 'P-102', name: 'Tarifa base Guadalajara', scope: 'Ciudad · GDL', type: 'Base', value: '$9.80/km', status: 'vigente', by: 'Admin' },
  { id: 'P-103', name: 'Surge hora pico CDMX', scope: 'Ciudad · CDMX', type: 'Surge', value: 'x1.8', status: 'vigente', by: 'Admin' },
  { id: 'P-104', name: 'Tarifa base Guadalajara', scope: 'Ciudad · GDL', type: 'Base', value: '$10.20/km', status: 'pendiente aprobacion', by: 'Laura Ríos' },
  { id: 'P-105', name: 'Comisión estándar', scope: 'Nacional', type: 'Comision', value: '18%', status: 'vigente', by: 'Admin' },
  { id: 'P-106', name: 'Comisión flotas grandes', scope: 'Zona centro', type: 'Comision', value: '14%', status: 'pendiente aprobacion', by: 'Laura Ríos' },
]

// ── Cases ──

export interface CaseStep {
  title: string
  timestamp: string
  status: 'done' | 'active' | 'error'
}

export interface Case {
  [key: string]: unknown
  id: string
  type: string
  who: string
  amount: string
  status: string
  opened: string
  steps: CaseStep[]
}

export const CASES: Case[] = [
  { id: 'C-501', type: 'Disputa de pago', who: 'Ana Sosa', amount: '$1,240', status: 'investigando', opened: 'hace 2 días',
    steps: [
      { title: 'Caso abierto por el cliente', timestamp: 'hace 2 días', status: 'done' },
      { title: 'Revisión de transacciones', timestamp: 'hace 1 día', status: 'done' },
      { title: 'Contacto con procesador de pagos', timestamp: 'hoy', status: 'active' },
    ] },
  { id: 'C-500', type: 'Fraude sospechado', who: 'Rutas Cobalto', amount: '$8,400', status: 'abierta', opened: 'hace 3 días',
    steps: [
      { title: 'Alerta automática por patrón inusual', timestamp: 'hace 3 días', status: 'done' },
      { title: 'Investigación pendiente', timestamp: '—', status: 'active' },
    ] },
  { id: 'C-498', type: 'Seguridad', who: 'Marco Gil', amount: '---', status: 'investigando', opened: 'hace 4 días',
    steps: [
      { title: 'Reporte de acceso no autorizado', timestamp: 'hace 4 días', status: 'done' },
      { title: 'Bloqueo preventivo de cuenta', timestamp: 'hace 4 días', status: 'done' },
      { title: 'Verificación de identidad en curso', timestamp: 'hace 2 días', status: 'active' },
    ] },
  { id: 'C-495', type: 'Disputa de pago', who: 'Rosa Duarte', amount: '$320', status: 'resuelta', opened: 'hace 1 semana',
    steps: [
      { title: 'Caso abierto', timestamp: 'hace 1 semana', status: 'done' },
      { title: 'Verificación completada', timestamp: 'hace 5 días', status: 'done' },
      { title: 'Reembolso procesado', timestamp: 'hace 3 días', status: 'done' },
    ] },
  { id: 'C-490', type: 'Fraude sospechado', who: 'Elena Ruz', amount: '$2,100', status: 'rechazada', opened: 'hace 2 semanas',
    steps: [
      { title: 'Alerta automática', timestamp: 'hace 2 semanas', status: 'done' },
      { title: 'Investigación completada', timestamp: 'hace 10 días', status: 'done' },
      { title: 'Caso rechazado — actividad legítima', timestamp: 'hace 8 días', status: 'error' },
    ] },
  { id: 'C-488', type: 'Seguridad', who: 'Transportes Vidal SA', amount: '---', status: 'resuelta', opened: 'hace 3 semanas',
    steps: [
      { title: 'Reporte de phishing', timestamp: 'hace 3 semanas', status: 'done' },
      { title: 'Credenciales rotadas', timestamp: 'hace 3 semanas', status: 'done' },
      { title: 'Caso cerrado', timestamp: 'hace 2 semanas', status: 'done' },
    ] },
]

// ── Back-office ──

export interface Doc {
  [key: string]: unknown
  id: string
  who: string
  doc: string
  submitted: string
  status: string
  file: string
}

export const DOCS: Doc[] = [
  { id: 'D-220', who: 'Diego Vera', doc: 'Licencia de conducir', submitted: 'hace 1 día', status: 'pendiente', file: 'licencia_dvera.pdf' },
  { id: 'D-221', who: 'Ana Sosa', doc: 'Tarjeta de circulación (renovación)', submitted: 'hace 1 día', status: 'pendiente', file: 'tc_anasosa_2024.pdf' },
  { id: 'D-222', who: 'Marco Gil', doc: 'Seguro de unidad', submitted: 'hace 2 días', status: 'pendiente', file: 'seguro_mgil.pdf' },
  { id: 'D-223', who: 'Rutas Cobalto', doc: 'Documentos de alta de flota', submitted: 'hace 3 días', status: 'pendiente', file: 'alta_flota_cobalto.zip' },
  { id: 'D-218', who: 'Luis Prieto', doc: 'Verificación de identidad (INE)', submitted: 'hace 4 días', status: 'aprobado', file: 'ine_lprieto.pdf' },
  { id: 'D-215', who: 'KTR Flotillas', doc: 'Póliza de seguro', submitted: 'hace 1 semana', status: 'rechazado', file: 'poliza_ktr.pdf' },
]

// ── Growth ──

export interface GrowthCandidate {
  id: string
  name: string
  units: number
  channel: string
  owner: string
  stage: string
  days: number
  risk: string | null
  value: string
  contact: string
  note?: string
}

export const GROWTH_STAGES = [
  { id: 'prospecto', label: 'Prospecto', icon: 'person_search' },
  { id: 'propuesta', label: 'Propuesta', icon: 'description' },
  { id: 'verificacion', label: 'Verificación (KYB)', icon: 'verified_user' },
  { id: 'configuracion', label: 'Configuración', icon: 'settings' },
  { id: 'piloto', label: 'Piloto', icon: 'science' },
  { id: 'activada', label: 'Activada', icon: 'check_circle' },
] as const

export const GROWTH_CANDIDATES: GrowthCandidate[] = [
  { id: 'g1', name: 'Grupo Vertex', units: 120, channel: 'referido', owner: 'Laura Ríos', stage: 'verificacion', days: 8, risk: 'alto', value: '$52,000/mes', contact: 'Sandra Mejía · Directora de operaciones' },
  { id: 'g2', name: 'Carga Rápida MX', units: 45, channel: 'outbound', owner: 'Laura Ríos', stage: 'propuesta', days: 12, risk: 'medio', value: '$18,500/mes', contact: 'Roberto Leal · Gerente de logística' },
  { id: 'g3', name: 'Transportes Bravo', units: 30, channel: 'inbound', owner: 'Carlos Peña', stage: 'propuesta', days: 5, risk: 'medio', value: '$12,000/mes', contact: 'Martín Soto · Director general' },
  { id: 'g4', name: 'EcoFleet', units: 25, channel: 'referido', owner: 'Laura Ríos', stage: 'prospecto', days: 3, risk: 'bajo', value: '$10,200/mes', contact: 'Ana Torres · COO' },
  { id: 'g5', name: 'Rutas del Pacífico', units: 60, channel: 'outbound', owner: 'Carlos Peña', stage: 'configuracion', days: 4, risk: 'bajo', value: '$24,000/mes', contact: 'Diego Ramos · VP Operaciones' },
  { id: 'g6', name: 'Logística Norte', units: 80, channel: 'inbound', owner: 'Laura Ríos', stage: 'piloto', days: 15, risk: 'bajo', value: '$33,000/mes', contact: 'Patricia Luna · Directora' },
  { id: 'g7', name: 'FlotaExpress', units: 35, channel: 'referido', owner: 'Carlos Peña', stage: 'activada', days: 0, risk: null, value: '$14,200/mes', contact: 'Miguel Ángel Cruz · Gerente' },
  { id: 'g8', name: 'Transporte Unión', units: 90, channel: 'outbound', owner: 'Laura Ríos', stage: 'activada', days: 0, risk: null, value: '$38,000/mes', contact: 'Claudia Herrera · Directora' },
  { id: 'g9', name: 'MoviCarga', units: 20, channel: 'inbound', owner: 'Carlos Peña', stage: 'prospecto', days: 1, risk: 'bajo', value: '$8,400/mes', contact: 'Jorge Blanco · Fundador' },
  { id: 'g10', name: 'Red Transporte MX', units: 55, channel: 'outbound', owner: 'Laura Ríos', stage: 'verificacion', days: 20, risk: 'alto', value: '$22,500/mes', contact: 'Isabel Moreno · CFO' },
]

export const CHANNEL_TONE: Record<string, 'default' | 'info' | 'success'> = {
  referido: 'success',
  outbound: 'info',
  inbound: 'default',
}

export const RISK_TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  bajo: 'success',
  medio: 'warning',
  alto: 'danger',
}

// ── Resumen preview data ──

export const TICKETS_PREVIEW = TICKETS.filter(t => t.status !== 'cerrado').slice(0, 3)
export const CASES_PREVIEW = CASES.filter(c => c.status !== 'resuelta' && c.status !== 'rechazada').slice(0, 3)
export const PRICING_PREVIEW = PRICING_RULES.filter(r => r.status === 'pendiente aprobacion').slice(0, 3)
export const BACKOFFICE_PREVIEW = DOCS.filter(d => d.status === 'pendiente').slice(0, 3)
