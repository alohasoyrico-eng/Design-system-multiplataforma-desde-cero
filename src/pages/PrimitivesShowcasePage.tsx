import { useState } from 'react'
import { Divider } from '../ui/primitives/Divider'
import { Spinner } from '../ui/primitives/Spinner'
import { Radio } from '../ui/primitives/Radio'
import { Slider } from '../ui/primitives/Slider'
import { Flag } from '../ui/primitives/Flag'
import { Tooltip } from '../ui/components/Tooltip'
import { SegmentedControl } from '../ui/components/SegmentedControl'
import { Timeline } from '../ui/primitives/Timeline'
import { CircularProgress } from '../ui/primitives/CircularProgress'
import { TableTree } from '../ui/components/TableTree'
import { Donut } from '../ui/components/Donut'
import { BulletChart } from '../ui/components/BulletChart'
import { GanttChart } from '../ui/components/GanttChart'
import { SmallMultiples } from '../ui/components/SmallMultiples'
import { ScatterPlot } from '../ui/components/ScatterPlot'
import { ParetoChart } from '../ui/components/ParetoChart'
import { Treemap } from '../ui/components/Treemap'
import { KanbanBoard } from '../ui/components/KanbanBoard'
import css from './PrimitivesShowcasePage.module.css'
import { CardMedia } from '../ui/components/CardMedia'
import { StatusView } from '../ui/primitives/StatusView'
import { OnboardingCarousel } from '../ui/patterns/OnboardingCarousel'
import { Button } from '../ui/primitives/Button'
import { IconButton } from '../ui/primitives/IconButton'

const DONUT_DATA = [
  { label: 'Activos', value: 42 },
  { label: 'En ruta', value: 28 },
  { label: 'Mantenimiento', value: 8 },
  { label: 'Inactivos', value: 12 },
]

const BULLET_DATA = [
  { label: 'Entregas', value: 87, target: 100, prev: 72 },
  { label: 'Satisfacción', value: 4.2, target: 4.5, prev: 3.9 },
  { label: 'Tiempo resp.', value: 115, target: 90, prev: 98 },
]

const GANTT_DATA = [
  { id: '1', name: 'Diseño', start: '2026-08-01', end: '2026-08-10', progress: 100 },
  { id: '2', name: 'Frontend', start: '2026-08-08', end: '2026-08-22', progress: 60 },
  { id: '3', name: 'Backend', start: '2026-08-05', end: '2026-08-20', progress: 80 },
  { id: '4', name: 'QA', start: '2026-08-18', end: '2026-08-28', progress: 10 },
]

const SM_DATA = [
  { id: 'mx', label: 'México', values: [120, 135, 128, 140, 155, 170] },
  { id: 'co', label: 'Colombia', values: [80, 85, 90, 88, 92, 95] },
  { id: 'br', label: 'Brasil', values: [200, 190, 195, 180, 175, 160] },
  { id: 'ar', label: 'Argentina', values: [60, 62, 58, 55, 50, 45] },
]

const SCATTER_POINTS = [
  { id: '1', x: 10, y: 80, label: 'Norte' },
  { id: '2', x: 25, y: 45, label: 'Sur' },
  { id: '3', x: 50, y: 90, label: 'Centro' },
  { id: '4', x: 70, y: 30, label: 'Este' },
  { id: '5', x: 85, y: 65, label: 'Oeste' },
  { id: '6', x: 40, y: 55, label: 'Pacífico' },
]

const PARETO_DATA = [
  { label: 'Retrasos', value: 42 },
  { label: 'Errores', value: 28 },
  { label: 'Faltantes', value: 15 },
  { label: 'Rechazos', value: 8 },
  { label: 'Otros', value: 4 },
  { label: 'Duplicados', value: 3 },
]

const TREEMAP_DATA = [
  { label: 'Flota', value: 350, deviation: 0.08 },
  { label: 'Combustible', value: 220, deviation: -0.12 },
  { label: 'Nómina', value: 180, deviation: 0.02 },
  { label: 'Mantenimiento', value: 90, deviation: -0.07 },
  { label: 'Seguros', value: 60, deviation: 0.01 },
  { label: 'Otros', value: 30 },
]

const KANBAN_COLS = [
  { id: 'todo', label: 'Por hacer' },
  { id: 'doing', label: 'En progreso', limit: 3 },
  { id: 'review', label: 'Revisión' },
  { id: 'done', label: 'Hecho' },
]

const ONBOARDING_SLIDES = [
  { icon: 'rocket_launch', title: 'Bienvenido a Flow', description: 'Tu plataforma para gestionar flotas y operaciones en tiempo real.' },
  { icon: 'map', title: 'Seguimiento GPS', description: 'Monitorea todas tus unidades con actualizaciones en tiempo real.' },
  { icon: 'insights', title: 'Reportes inteligentes', description: 'Analiza datos de operación con visualizaciones interactivas.' },
]

const TREE_COLS = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'size', label: 'Tamaño', align: 'right' as const, mono: true },
]

const TREE_ROWS = [
  {
    id: 'src', name: 'src', type: 'Carpeta', size: '—',
    children: [
      { id: 'components', name: 'components', type: 'Carpeta', size: '—', children: [
        { id: 'btn', name: 'Button.tsx', type: 'Archivo', size: '2.1 KB' },
        { id: 'card', name: 'Card.tsx', type: 'Archivo', size: '1.8 KB' },
      ] },
      { id: 'utils', name: 'utils', type: 'Carpeta', size: '—', children: [
        { id: 'format', name: 'format.ts', type: 'Archivo', size: '540 B' },
      ] },
    ],
  },
  { id: 'pkg', name: 'package.json', type: 'Archivo', size: '1.2 KB' },
  { id: 'readme', name: 'README.md', type: 'Archivo', size: '3.4 KB' },
]

const TIMELINE_STEPS = [
  { title: 'Pedido recibido', timestamp: '10:32 AM', status: 'done' as const, description: 'Pedido #4521 confirmado por el sistema' },
  { title: 'En preparación', timestamp: '10:45 AM', status: 'done' as const },
  { title: 'En camino', timestamp: '11:10 AM', status: 'active' as const, description: 'Conductor: Juan Pérez — ETA 20 min' },
  { title: 'Entregado', status: 'pending' as const },
]

const TIMELINE_EVENTS = [
  { title: 'Factura generada', timestamp: '14 ago 2026', status: 'done' as const, description: 'PDF enviado al correo del cliente' },
  { title: 'Pago parcial recibido', timestamp: '15 ago 2026', status: 'active' as const },
  { title: 'Vencimiento', timestamp: '30 ago 2026', status: 'pending' as const },
  { title: 'Rechazo bancario', timestamp: '12 ago 2026', status: 'error' as const, description: 'Fondos insuficientes' },
]

export function PrimitivesShowcasePage() {
  const [radio, setRadio] = useState('a')
  const [slider, setSlider] = useState(40)
  const [segment, setSegment] = useState('list')
  const [timelineMode, setTimelineMode] = useState<'steps' | 'events'>('steps')
  const [kanbanItems, setKanbanItems] = useState([
    { id: 'k1', title: 'Diseñar login', tag: 'UI', assignee: 'Ana', columnId: 'doing', description: 'Crear pantalla de inicio de sesión' },
    { id: 'k2', title: 'API de usuarios', tag: 'Backend', assignee: 'Carlos', columnId: 'doing' },
    { id: 'k3', title: 'Tests e2e', tag: 'QA', columnId: 'todo' },
    { id: 'k4', title: 'Deploy staging', tag: 'DevOps', assignee: 'Luis', columnId: 'review' },
    { id: 'k5', title: 'Documentación', columnId: 'todo' },
    { id: 'k6', title: 'Migrar DB', tag: 'Backend', assignee: 'Carlos', columnId: 'done' },
  ])
  const [onbIndex, setOnbIndex] = useState(0)

  return (
    <div style={{ padding: 40, maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <h2 style={{ font: 'var(--type-headline-lg)', margin: 0 }}>Showcase</h2>

      {/* ── Primitives ── */}
      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>Divider</h3>
        <Divider />
        <div style={{ height: 16 }} />
        <Divider label="Sección" />
        <div style={{ height: 16 }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', height: 32 }}>
          <span>A</span>
          <Divider orientation="vertical" />
          <span>B</span>
          <Divider orientation="vertical" />
          <span>C</span>
        </div>
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>Spinner</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Spinner size={16} />
          <Spinner />
          <Spinner size={32} />
          <Spinner size={48} color="var(--status-warning)" />
        </div>
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>Radio</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Radio name="demo" value="a" label="Opción A" description="Descripción de la primera opción" checked={radio === 'a'} onChange={setRadio} />
          <Radio name="demo" value="b" label="Opción B" checked={radio === 'b'} onChange={setRadio} />
          <Radio name="demo" value="c" label="Opción C" checked={radio === 'c'} onChange={setRadio} disabled />
        </div>
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>Slider</h3>
        <Slider value={slider} onChange={setSlider} label="Velocidad máxima" format={(v) => `${v} km/h`} />
        <div style={{ height: 16 }} />
        <Slider value={65} onChange={() => {}} label="Deshabilitado" disabled />
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>Flag</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Flag country="mx" label="México" size={32} />
          <Flag country="us" label="USA" size={32} />
          <Flag country="br" label="Brasil" size={32} shape="rounded" />
          <Flag country="jp" label="Japón" size={32} shape="square" />
          <Flag country="co" size={24} />
          <Flag country="ar" size={24} />
        </div>
      </section>

      <Divider />

      {/* ── Components ── */}
      <h2 style={{ font: 'var(--type-headline-lg)', margin: 0 }}>Components</h2>

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>Tooltip</h3>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip content="Guardar cambios" position="top">
            <Button>Hover me (top)</Button>
          </Tooltip>
          <Tooltip content="Más opciones disponibles para esta unidad" position="bottom">
            <Button variant="ghost">Bottom</Button>
          </Tooltip>
          <Tooltip content="Editar" position="left">
            <IconButton icon="edit" ariaLabel="Editar" />
          </Tooltip>
          <Tooltip content="Info del conductor" position="right">
            <IconButton icon="info" ariaLabel="Info" />
          </Tooltip>
        </div>
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>SegmentedControl</h3>
        <SegmentedControl
          items={[
            { value: 'list', label: 'Lista', icon: 'view_list' },
            { value: 'map', label: 'Mapa', icon: 'map' },
            { value: 'stats', label: 'Stats', icon: 'bar_chart' },
          ]}
          value={segment}
          onChange={setSegment}
        />
        <p style={{ font: 'var(--type-body-md)', color: 'var(--text-secondary)', marginTop: 12 }}>
          Vista seleccionada: <strong>{segment}</strong>
        </p>
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>Timeline</h3>
        <SegmentedControl
          items={[
            { value: 'steps', label: 'Steps' },
            { value: 'events', label: 'Events' },
          ]}
          value={timelineMode}
          onChange={(v) => setTimelineMode(v as 'steps' | 'events')}
          style={{ maxWidth: 240, marginBottom: 20 }}
        />
        <Timeline
          items={timelineMode === 'steps' ? TIMELINE_STEPS : TIMELINE_EVENTS}
          mode={timelineMode}
        />
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>CircularProgress</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <CircularProgress value={72} showValue label="Batería" />
          <CircularProgress value={45} max={100} tone="warning" showValue label="Cuota" size={48} />
          <CircularProgress value={100} tone="success" showValue label="Sincronizado" size={40} strokeWidth={4} />
          <CircularProgress value={15} tone="danger" showValue label="Almacenamiento" size={64} strokeWidth={6} />
        </div>
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>TableTree</h3>
        <TableTree columns={TREE_COLS} rows={TREE_ROWS} />
      </section>

      <Divider />

      <h2 style={{ font: 'var(--type-headline-lg)', margin: 0 }}>Dataviz</h2>

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>Donut</h3>
        <Donut segments={DONUT_DATA} centerLabel="Unidades" centerValue={90} />
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>BulletChart</h3>
        <BulletChart rows={BULLET_DATA} />
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>GanttChart</h3>
        <GanttChart tasks={GANTT_DATA} />
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>SmallMultiples</h3>
        <SmallMultiples items={SM_DATA} isOutlier={(it) => it.id === 'ar'} format={(v) => `$${v}k`} />
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>ScatterPlot</h3>
        <ScatterPlot points={SCATTER_POINTS} xLabel="Distancia (km)" yLabel="Eficiencia (%)" xThreshold={50} yThreshold={60} />
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>ParetoChart</h3>
        <ParetoChart data={PARETO_DATA} threshold={0.8} />
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>Treemap</h3>
        <Treemap nodes={TREEMAP_DATA} />
      </section>

      <Divider />

      <h2 style={{ font: 'var(--type-headline-lg)', margin: 0 }}>UI Desktop</h2>

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>KanbanBoard</h3>
        <KanbanBoard
          columns={KANBAN_COLS}
          items={kanbanItems}
          renderCard={(item, { dragging }) => (
            <div style={{ opacity: dragging ? 0.5 : 1 }}>
              <div className={css.kanbanTitle}>{item.title as string}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                {item.tag && <span className={css.kanbanTag}>{item.tag as string}</span>}
                {item.assignee && <span className={css.kanbanAssignee}>{item.assignee as string}</span>}
              </div>
            </div>
          )}
          renderDetail={(item) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ margin: 0, font: 'var(--type-title-md)' }}>{item.title as string}</h3>
              {item.description && <p style={{ margin: 0 }} className={css.kanbanDetailDesc}>{item.description as string}</p>}
              {item.assignee && <p style={{ margin: 0 }} className={css.kanbanDetailAssignee}>Asignado: {item.assignee as string}</p>}
            </div>
          )}
          onMove={(cardId, toCol) => {
            setKanbanItems((prev) =>
              prev.map((c) => c.id === cardId ? { ...c, columnId: toCol } : c)
            )
          }}
        />
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>CardMedia</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <CardMedia
            image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200'%3E%3Crect fill='%23374151' width='320' height='200'/%3E%3Ctext x='160' y='105' text-anchor='middle' fill='%239CA3AF' font-size='14'%3EImagen 1%3C/text%3E%3C/svg%3E"
            title="Reporte mensual"
            description="Resumen de operaciones del mes de agosto con indicadores clave."
            interactive
            onClick={() => {}}
          />
          <CardMedia
            image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200'%3E%3Crect fill='%231e3a5f' width='320' height='200'/%3E%3Ctext x='160' y='105' text-anchor='middle' fill='%2390cdf4' font-size='14'%3EImagen 2%3C/text%3E%3C/svg%3E"
            title="Mapa de rutas"
            description="Visualización geográfica de las rutas activas."
          />
        </div>
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>StatusView</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <StatusView status="success" title="Operación completada" description="Los datos se sincronizaron correctamente." />
          <StatusView status="error" title="Error de conexión" description="No se pudo conectar al servidor." primaryAction={<Button size="sm">Reintentar</Button>} />
          <StatusView status="loading" title="Procesando..." description="Espera mientras preparamos tus datos." />
          <StatusView status="offline" title="Sin conexión" description="Revisa tu conexión a internet." />
        </div>
      </section>

      <Divider />

      <section>
        <h3 style={{ font: 'var(--type-title-md)', marginBottom: 12 }}>OnboardingCarousel</h3>
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-m)', overflow: 'hidden', maxWidth: 400, height: 480 }}>
          <OnboardingCarousel
            slides={ONBOARDING_SLIDES}
            index={onbIndex}
            onIndexChange={setOnbIndex}
            onDone={() => alert('¡Onboarding completado!')}
            onSkip={() => alert('Omitido')}
          />
        </div>
      </section>
    </div>
  )
}
