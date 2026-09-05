/* Flow · Specimens — la tercera pata de cada pieza.
   El contrato promete, la ficha describe, el specimen DEMUESTRA: un registro
   ejecutable id-de-ficha → render vivo con sus variantes, que typechequea
   contra la interfaz real (spm-1) y viaja como entry propio (spm-2) — el
   entry de la librería no lo importa y una app que no documenta no lo paga.
   Cualquier página de docs (Component Detail del banco, flow-docs) lo consume
   de forma genérica, sin conocer piezas por nombre (spm-3). */
import { useState, type ReactNode } from 'react'
import { Switch } from '../ui/primitives/Switch'
import { Checkbox } from '../ui/primitives/Checkbox'
import { Radio } from '../ui/primitives/Radio'
import { Chip } from '../ui/primitives/Chip'
import { ChipGroup } from '../ui/primitives/ChipGroup'
import { Avatar, type AvatarSize } from '../ui/primitives/Avatar'
import { Badge, type BadgeTone } from '../ui/primitives/Badge'
import { StatusPill } from '../ui/primitives/StatusPill'
import { Skeleton } from '../ui/primitives/Skeleton'
import { Spinner } from '../ui/primitives/Spinner'
import { Field } from '../ui/primitives/Field'
import { Input } from '../ui/primitives/Input'
import { Textarea } from '../ui/primitives/Textarea'
import { Select } from '../ui/primitives/Select'
import { Slider } from '../ui/primitives/Slider'
import { Divider } from '../ui/primitives/Divider'
import { Stepper } from '../ui/primitives/Stepper'
import { Breadcrumb } from '../ui/primitives/Breadcrumb'
import { Pagination } from '../ui/primitives/Pagination'
import { ChartLegend } from '../ui/primitives/ChartLegend'
import { Button } from '../ui/primitives/Button'
import { IconButton } from '../ui/primitives/IconButton'
import { Card } from '../ui/components/Card'
import { Tabs } from '../ui/components/Tabs'
import { SegmentedControl } from '../ui/components/SegmentedControl'
import { Menu } from '../ui/components/Menu'
import { Tooltip } from '../ui/components/Tooltip'
import { StatTile } from '../ui/components/StatTile'
import { SectionHeader } from '../ui/primitives/SectionHeader'

export interface SpecimenState {
  variant: string
  size: string
  density: string
}

export interface Specimen {
  /** Valores que el playground ofrece; vacío = la pieza no varía por ese eje. */
  variants?: string[]
  sizes?: string[]
  /** El render recibe el estado del playground — el enchufe de PlaygroundCanvas. */
  render: (state: SpecimenState) => ReactNode
}

/* Los especímenes con estado usan wrappers mínimos: el demo debe poder
   operarse (un switch que no alterna no demuestra nada). */

function SwitchDemo() {
  const [on, setOn] = useState(true)
  return <Switch checked={on} onChange={setOn} label="Alertas de mantenimiento" />
}

function CheckboxDemo() {
  const [v, setV] = useState(true)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox checked={v} onChange={setV} label="Ver unidades" description="Acceso de solo lectura a la flota" />
      <Checkbox checked indeterminate label="Editar unidades" />
      <Checkbox checked={false} onChange={() => {}} label="Eliminar unidades" disabled />
    </div>
  )
}

function RadioDemo() {
  const [v, setV] = useState('a')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Radio name="sp-radio" value="a" checked={v === 'a'} onChange={setV} label="Diario" description="Un resumen cada mañana" />
      <Radio name="sp-radio" value="b" checked={v === 'b'} onChange={setV} label="Semanal" />
      <Radio name="sp-radio" value="c" checked={v === 'c'} onChange={setV} label="Nunca" disabled />
    </div>
  )
}

function ChipsDemo({ size }: { size: 'sm' | 'md' }) {
  const [sel, setSel] = useState('ruta')
  return (
    <ChipGroup>
      {(['ruta', 'taller', 'inactiva'] as const).map((v) => (
        <Chip key={v} label={'En ' + v} size={size} selected={sel === v} onClick={() => setSel(v)} />
      ))}
      <Chip label="KTR-882" size={size} mono onRemove={() => {}} />
    </ChipGroup>
  )
}

function TabsDemo({ variant }: { variant: 'pill' | 'underline' | 'bar' }) {
  const [v, setV] = useState('todas')
  return (
    <Tabs
      variant={variant}
      value={v}
      onChange={setV}
      items={[
        { value: 'todas', label: 'Todas', count: 24 },
        { value: 'ruta', label: 'En ruta', count: 18 },
        { value: 'taller', label: 'Taller', count: 3 },
      ]}
    />
  )
}

function SegmentedDemo({ size }: { size: 'sm' | 'md' }) {
  const [v, setV] = useState('lista')
  return (
    <SegmentedControl
      size={size}
      value={v}
      onChange={setV}
      items={[
        { value: 'lista', label: 'Lista', icon: 'table_rows' },
        { value: 'mapa', label: 'Mapa', icon: 'map' },
        { value: 'stats', label: 'Stats', icon: 'insert_chart' },
      ]}
    />
  )
}

function SelectDemo({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const [v, setV] = useState<string | string[] | undefined>('cdmx')
  return (
    <Select
      size={size}
      insetLabel="Zona"
      value={v}
      onChange={setV}
      options={[
        { value: 'cdmx', label: 'Ciudad de México' },
        { value: 'gdl', label: 'Guadalajara' },
        { value: 'mty', label: 'Monterrey' },
      ]}
    />
  )
}

function SliderDemo() {
  const [v, setV] = useState(80)
  return <Slider label="Velocidad máxima" value={v} onChange={setV} min={0} max={140} format={(n) => `${n} km/h`} />
}

function PaginationDemo() {
  const [p, setP] = useState(4)
  return <Pagination page={p} pages={9} onChange={setP} total={87} pageSize={10} />
}

export const SPECIMENS: Record<string, Specimen> = {
  switch: { render: () => <SwitchDemo /> },
  checkbox: { render: () => <CheckboxDemo /> },
  radio: { render: () => <RadioDemo /> },
  chip: {
    sizes: ['sm', 'md'],
    render: ({ size }) => <ChipsDemo size={size === 'sm' ? 'sm' : 'md'} />,
  },
  'chip-group': { render: () => <ChipsDemo size="md" /> },
  avatar: {
    sizes: ['sm', 'md', 'lg', 'xl'],
    render: ({ size }) => (
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Avatar name="Marta Vidal" size={size as AvatarSize} status="online" />
        <Avatar name="Diego Herrera" size={size as AvatarSize} status="busy" />
        <Avatar name="Ana" size={size as AvatarSize} status="offline" />
      </div>
    ),
  },
  badge: {
    variants: ['default', 'success', 'warning', 'danger', 'info'],
    render: ({ variant }) => (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Badge tone={variant as BadgeTone}>Etiqueta</Badge>
        <Badge tone={variant as BadgeTone} icon="bolt">Con icono</Badge>
        <Badge tone={variant as BadgeTone} live>En vivo</Badge>
      </div>
    ),
  },
  'status-pill': {
    render: () => (
      <div style={{ display: 'flex', gap: 8 }}>
        <StatusPill label="Activa" tone="success" />
        <StatusPill label="En revisión" tone="warning" />
        <StatusPill label="Bloqueada" tone="danger" />
        <StatusPill label="Informativa" tone="info" />
      </div>
    ),
  },
  skeleton: {
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 260 }}>
        <Skeleton variant="title" width={160} />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="card" height={72} />
      </div>
    ),
  },
  spinner: { render: () => <Spinner /> },
  field: {
    variants: ['default', 'error', 'valid'],
    render: ({ variant }) => (
      <Field
        label="Correo de trabajo"
        htmlFor="sp-field"
        required
        help={variant === 'default' ? 'Se usa para las alertas de la flota.' : undefined}
        error={variant === 'error' ? 'Ese dominio no está permitido.' : undefined}
        valid={variant === 'valid'}
        validMessage={variant === 'valid' ? 'Correo verificado.' : undefined}
      >
        <Input id="sp-field" type="email" value="marta@flota.mx" onChange={() => {}} invalid={variant === 'error'} />
      </Field>
    ),
  },
  input: {
    sizes: ['sm', 'md', 'lg'],
    variants: ['default', 'invalid', 'mono'],
    render: ({ size, variant }) => (
      <Input
        size={size as 'sm' | 'md' | 'lg'}
        value={variant === 'mono' ? 'KTR-882-A' : 'Transportes Vidal'}
        onChange={() => {}}
        icon="search"
        mono={variant === 'mono'}
        invalid={variant === 'invalid'}
        ariaLabel="Ejemplo"
        trailing={variant === 'mono' ? <span>placa</span> : undefined}
      />
    ),
  },
  textarea: { render: () => (
      <Field label="Notas del turno" htmlFor="sp-ta">
        <Textarea id="sp-ta" value="Observaciones del turno…" onChange={() => {}} rows={3} maxLength={200} />
      </Field>
    ) },
  select: {
    sizes: ['sm', 'md', 'lg'],
    render: ({ size }) => <SelectDemo size={size as 'sm' | 'md' | 'lg'} />,
  },
  slider: { render: () => <SliderDemo /> },
  divider: {
    render: () => (
      <div style={{ width: 320 }}>
        <Divider />
        <Divider label="Sección" />
      </div>
    ),
  },
  stepper: {
    variants: ['horizontal', 'vertical'],
    render: ({ variant }) => (
      <Stepper
        orientation={variant === 'vertical' ? 'vertical' : 'horizontal'}
        steps={[{ label: 'Datos' }, { label: 'Pago' }, { label: 'Confirmar' }]}
        current={1}
      />
    ),
  },
  breadcrumb: {
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Breadcrumb items={[{ label: 'Flota', href: '#' }, { label: 'Unidades', href: '#' }, { label: 'KTR-882' }]} />
        {/* brc-3: la ruta larga colapsa por el medio y conserva el primero y el actual */}
        <Breadcrumb items={[{ label: 'Flota', href: '#' }, { label: 'Regiones', href: '#' }, { label: 'Norte', href: '#' }, { label: 'Unidades', href: '#' }, { label: 'KTR-882', href: '#' }, { label: 'Servicio 40k' }]} />
      </div>
    ),
  },
  pagination: { render: () => <PaginationDemo /> },
  'chart-legend': {
    variants: ['horizontal', 'vertical'],
    render: ({ variant }) => (
      <ChartLegend
        direction={variant === 'vertical' ? 'vertical' : 'horizontal'}
        items={[
          { label: 'Combustible', color: 'var(--viz-1)', value: '73%' },
          { label: 'Peaje', color: 'var(--viz-4)', value: '17%' },
          { label: 'Mantenimiento', color: 'var(--viz-5)', value: '10%' },
        ]}
      />
    ),
  },
  button: {
    variants: ['primary', 'secondary', 'ghost', 'danger', 'link'],
    sizes: ['sm', 'md', 'lg'],
    render: ({ variant, size }) => (
      <Button variant={variant as 'primary'} size={size as 'md'} icon="add">
        Agregar unidad
      </Button>
    ),
  },
  'icon-button': {
    render: () => (
      <div style={{ display: 'flex', gap: 8 }}>
        <IconButton icon="favorite" ariaLabel="Favorito" />
        <IconButton icon="favorite" ariaLabel="Favorito activo" selected />
        <IconButton icon="delete" ariaLabel="Eliminar" variant="ghost" />
      </div>
    ),
  },
  card: {
    variants: ['elevated', 'outlined', 'inverse'],
    render: ({ variant }) => (
      <Card surface={variant as 'elevated'} status={variant === 'outlined' ? 'warning' : undefined} style={{ width: 280 }}>
        <SectionHeader size="sm" level={3} description="Radio interior menor que el de la tarjeta.">
          Tarjeta {variant}
        </SectionHeader>
        <Badge tone="info">Anidado</Badge>
      </Card>
    ),
  },
  menu: {
    render: () => (
      <Menu
        trigger={<Button variant="secondary" icon="more_vert">Acciones</Button>}
        items={[
          { label: 'Editar', icon: 'edit' },
          { label: 'Duplicar', icon: 'content_copy' },
          'divider',
          { label: 'Eliminar', icon: 'delete', danger: true },
        ]}
      />
    ),
  },
  tooltip: {
    render: () => (
      <Tooltip content="Explica sin interrumpir">
        <Button variant="secondary">Pasa el cursor</Button>
      </Tooltip>
    ),
  },
  tabs: {
    variants: ['pill', 'underline', 'bar'],
    render: ({ variant }) => <TabsDemo variant={variant as 'pill'} />,
  },
  segmented: {
    sizes: ['sm', 'md'],
    render: ({ size }) => <SegmentedDemo size={size === 'sm' ? 'sm' : 'md'} />,
  },
  stattile: {
    render: ({ density }) => (
      <StatTile
        label="Viajes hoy"
        value={412}
        delta="+12% vs ayer"
        trend={[3, 5, 4, 6, 8, 7, 9]}
        description="Completados esta semana"
        loading={density === 'loading'}
        style={{ width: 240 }}
      />
    ),
  },
  'section-header': {
    variants: ['sm', 'md', 'display'],
    render: ({ variant }) => (
      <SectionHeader size={variant as 'md'} description="La bajada vive fuera del heading." trailing={<Badge>3</Badge>}>
        Actividad de la flota
      </SectionHeader>
    ),
  },
}
