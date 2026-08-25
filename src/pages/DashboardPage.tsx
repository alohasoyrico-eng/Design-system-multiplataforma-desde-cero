import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { StatTile } from '../ui/components/StatTile'
import { Card } from '../ui/components/Card'
import { Bars } from '../ui/components/Bars'
import { FlowChart } from '../ui/primitives/FlowChart'
import { Table } from '../ui/components/Table'
import { Tabs } from '../ui/components/Tabs'
import { Menu } from '../ui/components/Menu'
import { Badge } from '../ui/primitives/Badge'
import { Button } from '../ui/primitives/Button'
import { Breadcrumb } from '../ui/components/Breadcrumb'
import { DatePicker } from '../ui/components/DatePicker'
import { Sparkline } from '../ui/primitives/Sparkline'
import { NotificationCenter } from '../ui/components/NotificationCenter'
import { ThemeToggle } from '../components/ThemeToggle'
import { useNotifications } from '../data/api'
import { Donut } from '../ui/components/Donut'
import { ScatterPlot } from '../ui/components/ScatterPlot'
import { SmallMultiples } from '../ui/components/SmallMultiples'
import { ParetoChart } from '../ui/components/ParetoChart'
import { Treemap } from '../ui/components/Treemap'
import { BulletChart } from '../ui/components/BulletChart'
import { GanttChart } from '../ui/components/GanttChart'
import { MapCanvas } from '../ui/components/MapCanvas'
import { ChartLegend } from '../ui/components/ChartLegend'
import { DOMAIN } from '../data/domain-colors'
import css from '../App.module.css'

function DashboardHeader({ title, crumbs, cta }: { title: string; crumbs: string[]; cta?: ReactNode }) {
  const [range, setRange] = useState('30d')
  const [custom, setCustom] = useState('')
  const { data: notifs = [] } = useNotifications()
  return (
    <div className={css.dashToolbar}>
      <div className={css.dashToolbarLeft}>
        <Breadcrumb items={crumbs.map(c => ({ label: c }))} />
        <h1 className={css.pageTitle}>{title}</h1>
      </div>
      <div className={css.dashToolbarRight}>
        <Tabs value={range} onChange={setRange} items={[
          { value: '7d', label: '7 dias' },
          { value: '30d', label: '30 dias' },
          { value: '90d', label: 'Trimestre' },
        ]} />
        <div className={css.dashDatePicker}>
          <DatePicker value={custom} onChange={setCustom} placeholder="Rango personalizado" />
        </div>
        {cta}
        <Menu
          align="right"
          trigger={<Button variant="secondary" icon="download" iconTrailing="expand_more">Exportar</Button>}
          items={[
            { label: 'CSV', icon: 'table' },
            { label: 'PDF', icon: 'picture_as_pdf' },
            { label: 'Enviar por correo', icon: 'mail' },
          ]}
        />
        <NotificationCenter items={notifs} onItemClick={() => {}} onMarkAllRead={() => {}} />
        <ThemeToggle />
      </div>
    </div>
  )
}

function OverviewView() {
  return (
    <>
      <DashboardHeader title="Overview" crumbs={['Dashboards', 'Overview']}
        cta={<Link to="/unidades/nueva" style={{ textDecoration: 'none' }}><Button variant="accent" icon="add">Agregar unidad</Button></Link>}
      />
      <div className={css.kpiGrid4}>
        <StatTile label="Unidades activas" value="128" delta="+4 vs ayer" trend={[98, 104, 112, 109, 118, 124, 128]} icon="local_taxi" />
        <StatTile label="Viajes hoy" value="412" delta="+12%" trend={[290, 340, 310, 365, 388, 395, 412]} icon="navigation" />
        <StatTile label="Gasto del mes" value="$248k" delta="−4% vs mes pasado" trend={[280, 270, 265, 258, 252, 250, 248]} icon="payments" />
        <StatTile label="Alertas abiertas" value="3" delta="−2 vs ayer" icon="warning" tone="warning" />
      </div>
      <div className={css.dashGrid2}>
        <Card>
          <div className={css.chartHeaderSolo}>Viajes por dia</div>
          <Bars height={190} data={[
            { label: 'Lun', value: 288, color: 'var(--viz-1)' }, { label: 'Mar', value: 342, color: 'var(--viz-2)' }, { label: 'Mie', value: 315, color: 'var(--viz-3)' },
            { label: 'Jue', value: 371, color: 'var(--viz-4)' }, { label: 'Vie', value: 412, color: 'var(--viz-5)' }, { label: 'Sab', value: 389, color: 'var(--viz-6)' }, { label: 'Dom', value: 214, color: 'var(--viz-7)' },
          ]} />
        </Card>
        <Card>
          <div className={css.chartHeaderSolo}>Gasto por categoria</div>
          <Donut
            segments={[
              { label: 'Combustible', value: 182, color: DOMAIN.combustible.token, icon: DOMAIN.combustible.icon },
              { label: 'Peaje', value: 41, color: DOMAIN.peaje.token, icon: DOMAIN.peaje.icon },
              { label: 'Mantenimiento', value: 25, color: DOMAIN.mantenimiento.token, icon: DOMAIN.mantenimiento.icon },
            ]}
            centerValue="$248k"
            centerLabel="Total"
            legend
          />
        </Card>
      </div>
      <Card>
        <div className={css.chartHeader}>Mix de gasto por producto y entidad</div>
        <div className={css.chartDesc}>Normalizado a 100% — comparable aunque el gasto total difiera mucho entre entidades</div>
        <ChartLegend items={[
          { label: 'Combustible', color: DOMAIN.combustible.token, icon: DOMAIN.combustible.icon },
          { label: 'Peaje', color: DOMAIN.peaje.token, icon: DOMAIN.peaje.icon },
          { label: 'Mantenimiento', color: DOMAIN.mantenimiento.token, icon: DOMAIN.mantenimiento.icon },
          { label: 'Electromovilidad', color: DOMAIN.electromovilidad.token, icon: DOMAIN.electromovilidad.icon },
        ]} style={{ marginBottom: 'var(--space-3)' }} />
        <FlowChart
          type="stacked100"
          palette="categorical"
          height={240}
          legend={false}
          labels={['CDMX', 'Guadalajara', 'Monterrey', 'Puebla']}
          series={[
            { label: 'Combustible', values: [52, 70, 40, 60], color: DOMAIN.combustible.token },
            { label: 'Peaje', values: [18, 10, 12, 22], color: DOMAIN.peaje.token },
            { label: 'Mantenimiento', values: [20, 15, 18, 14], color: DOMAIN.mantenimiento.token },
            { label: 'Electromovilidad', values: [10, 5, 30, 4], color: DOMAIN.electromovilidad.token },
          ]}
          ariaLabel="Monterrey es la unica entidad donde electromovilidad pesa un tercio del gasto"
        />
      </Card>
      <Card style={{ marginTop: 16 }}>
        <div className={css.chartHeader}>Ubicacion de la flota en tiempo real</div>
        <div className={css.chartDesc}>7 unidades + 4 establecimientos — click en un pin para ver detalle</div>
        <MapCanvas
          center={[19.4326, -99.1332]}
          zoom={12}
          pins={[
            { id: 'JMX-214', lat: 19.4360, lon: -99.1540, label: 'JMX-214', subtitle: 'En ruta · Reforma', color: 'var(--viz-positive)', icon: 'navigation' },
            { id: 'KTR-882', lat: 19.4190, lon: -99.1680, label: 'KTR-882', subtitle: 'Alerta · consumo alto', color: 'var(--viz-negative)', icon: 'warning' },
            { id: 'MVD-101', lat: 19.4450, lon: -99.1200, label: 'MVD-101', subtitle: 'Taller · Serv. 40k km', color: DOMAIN.mantenimiento.token, icon: 'build' },
            { id: 'PLQ-472', lat: 19.4100, lon: -99.1400, label: 'PLQ-472', subtitle: 'En ruta · Insurgentes', color: 'var(--viz-positive)', icon: 'navigation' },
            { id: 'QRS-330', lat: 19.4280, lon: -99.1900, label: 'QRS-330', subtitle: 'En ruta · Periferico', color: 'var(--viz-positive)', icon: 'navigation' },
            { id: 'TWN-559', lat: 19.4510, lon: -99.1350, label: 'TWN-559', subtitle: 'Cargando · Polanco EV', color: DOMAIN.electromovilidad.token, icon: 'ev_station' },
            { id: 'BNM-220', lat: 19.4380, lon: -99.1070, label: 'BNM-220', subtitle: 'Estacionado · Base', color: 'var(--viz-neutral)', icon: 'local_parking' },
            { id: 'GAS-01', lat: 19.4420, lon: -99.1580, label: 'Pemex Reforma', subtitle: 'Gasolinera · $23.40/L', color: DOMAIN.combustible.token, icon: 'local_gas_station' },
            { id: 'EV-01', lat: 19.4480, lon: -99.1280, label: 'Polanco EV Hub', subtitle: 'Electrolinera · 4 cargadores', color: DOMAIN.electromovilidad.token, icon: 'ev_station' },
            { id: 'TOLL-01', lat: 19.4050, lon: -99.1550, label: 'Caseta Tlalpan', subtitle: 'Caseta · $86/cruce', color: DOMAIN.peaje.token, icon: 'toll' },
            { id: 'SHOP-01', lat: 19.4320, lon: -99.1050, label: 'AutoTaller Roma', subtitle: 'Taller · llantas y frenos', color: DOMAIN.mantenimiento.token, icon: 'car_repair' },
          ]}
          route={[
            [19.4360, -99.1540], [19.4320, -99.1480], [19.4280, -99.1400],
            [19.4260, -99.1300], [19.4280, -99.1200], [19.4350, -99.1150],
            [19.4450, -99.1200],
          ]}
          style={{ height: 340 }}
        />
      </Card>
      <Card style={{ marginTop: 16 }}>
        <div className={css.chartHeader}>Actividad de la flota por hora y dia</div>
        <div className={css.chartDesc}>Viajes iniciados — mas oscuro = mayor actividad</div>
        <FlowChart
          type="heatmap"
          height={220}
          color="var(--viz-1)"
          matrix={{
            rows: ['Dom', 'Sab', 'Vie', 'Jue', 'Mie', 'Mar', 'Lun'],
            cols: ['6am', '7', '8', '9', '10', '11', '12pm', '1', '2', '3', '4', '5', '6', '7', '8pm'],
            values: [
              [0,6,0],[0,6,1],[0,6,2],[1,6,3],[2,6,4],[4,6,5],[3,6,6],[2,6,7],[3,6,8],[4,6,9],[5,6,10],[3,6,11],[1,6,12],[0,6,13],[0,6,14],
              [1,5,0],[2,5,1],[4,5,2],[6,5,3],[8,5,4],[7,5,5],[5,5,6],[4,5,7],[6,5,8],[7,5,9],[8,5,10],[6,5,11],[3,5,12],[2,5,13],[1,5,14],
              [2,4,0],[4,4,1],[8,4,2],[12,4,3],[14,4,4],[11,4,5],[8,4,6],[6,4,7],[9,4,8],[12,4,9],[14,4,10],[10,4,11],[6,4,12],[3,4,13],[1,4,14],
              [2,3,0],[3,3,1],[7,3,2],[11,3,3],[13,3,4],[10,3,5],[7,3,6],[5,3,7],[8,3,8],[11,3,9],[13,3,10],[9,3,11],[5,3,12],[2,3,13],[1,3,14],
              [1,2,0],[3,2,1],[6,2,2],[10,2,3],[12,2,4],[9,2,5],[7,2,6],[5,2,7],[7,2,8],[10,2,9],[12,2,10],[8,2,11],[4,2,12],[2,2,13],[1,2,14],
              [1,1,0],[3,1,1],[5,1,2],[9,1,3],[11,1,4],[8,1,5],[6,1,6],[4,1,7],[6,1,8],[9,1,9],[11,1,10],[7,1,11],[3,1,12],[1,1,13],[0,1,14],
              [0,0,0],[1,0,1],[3,0,2],[5,0,3],[6,0,4],[4,0,5],[3,0,6],[2,0,7],[3,0,8],[4,0,9],[5,0,10],[3,0,11],[1,0,12],[0,0,13],[0,0,14],
            ],
          }}
          ariaLabel="La actividad pico es entre 9-11am y 3-5pm de lunes a viernes"
        />
      </Card>
      <Card style={{ marginTop: 16 }}>
        <div className={css.chartHeaderSolo}>Alertas que requieren accion</div>
        <Table
          columns={[
            { key: 'sev', label: '', render: (r: { sev: string }) => (
              <span className="flow-icon flow-icon--fill" aria-hidden="true" style={{ fontSize: 18, color: r.sev === 'alta' ? 'var(--status-danger)' : 'var(--status-warning)' }}>warning</span>
            ) },
            { key: 'msg', label: 'Alerta' },
            { key: 'unit', label: 'Unidad', mono: true },
            { key: 'time', label: 'Desde' },
            { key: 'a', label: '', align: 'right' as const, render: () => <Button variant="ghost" size="sm">Resolver</Button> },
          ]}
          rows={[
            { sev: 'alta', msg: 'Consumo de combustible 38% sobre promedio', unit: 'KTR-882-A', time: 'hace 2 h' },
            { sev: 'media', msg: 'Tag de peaje vence en 5 dias', unit: 'PLQ-472-D', time: 'hoy' },
            { sev: 'media', msg: 'Servicio de 40,000 km vencido', unit: 'MVD-101-C', time: 'hace 3 dias' },
          ]}
          rowKey="unit"
          density="compact"
          style={{ border: 'none', boxShadow: 'none' }}
        />
      </Card>
    </>
  )
}

function CombustibleView() {
  return (
    <>
      <DashboardHeader title="Combustible" crumbs={['Dashboards', 'Combustible']}
        cta={<Button variant="accent" icon="local_gas_station">Registrar carga</Button>}
      />
      <div className={css.kpiGrid4}>
        <StatTile label="Gasto del mes" value="$182,400" delta="+8% vs mes pasado" icon="local_gas_station" tone="danger" />
        <StatTile label="Costo por km" value="$2.14" delta="+3%" icon="route" tone="danger" />
        <StatTile label="Litros cargados" value="7,930" delta="+5%" icon="water_drop" />
        <StatTile label="Precio prom. pagado" value="$23.02/L" delta="−$0.40 vs mercado" icon="sell" tone="success" />
      </div>
      <div className={css.dashGrid2}>
        <Card>
          <div className={css.chartHeader}>Eficiencia por unidad: costo/km vs km recorridos</div>
          <div className={css.chartDesc}>Cuadrante superior derecho = revisar primero</div>
          <ScatterPlot
            points={[
              { id: 'JMX-214', x: 8200, y: 2.1, label: 'JMX-214' },
              { id: 'BNM-220', x: 3100, y: 3.4, label: 'BNM-220' },
              { id: 'MVD-101', x: 9400, y: 1.9, label: 'MVD-101' },
              { id: 'QRS-330', x: 2200, y: 2.6, label: 'QRS-330' },
              { id: 'TWN-559', x: 6100, y: 2.3, label: 'TWN-559' },
              { id: 'PLQ-472', x: 4800, y: 3.1, label: 'PLQ-472' },
              { id: 'KTR-882', x: 1900, y: 4.2, label: 'KTR-882' },
            ]}
            color={DOMAIN.combustible.token}
            xLabel="Km recorridos"
            yLabel="Costo/km ($)"
            xThreshold={5000}
            yThreshold={3.0}
          />
        </Card>
        <Card>
          <div className={css.chartHeaderSolo}>Consumo por region (8 semanas)</div>
          <SmallMultiples
            items={[
              { id: 'cdmx', label: 'CDMX Norte', values: [38, 40, 42, 45, 47, 44, 49, 52] },
              { id: 'gdl', label: 'Guadalajara', values: [22, 23, 24, 23, 25, 26, 24, 25] },
              { id: 'mty', label: 'Monterrey', values: [18, 19, 20, 22, 21, 23, 22, 24] },
            ]}
            format={(v) => `${v}k L`}
          />
        </Card>
      </div>
      <div className={css.dashGrid2}>
        <Card>
          <div className={css.chartHeader}>Consumo por unidad (L/100km)</div>
          <div className={css.chartDesc}>La barra accent marca el outlier a investigar</div>
          <Bars height={180} color={DOMAIN.combustible.token} data={[
            { label: 'JMX-214', value: 9.1 }, { label: 'KTR-882', value: 14.8, color: 'var(--viz-negative)' },
            { label: 'MVD-101', value: 9.8 }, { label: 'PLQ-472', value: 4.2 },
            { label: 'QRS-330', value: 11.2 }, { label: 'TWN-559', value: 9.4 },
          ]} />
        </Card>
        <Card>
          <div className={css.chartHeader}>Gasto vs precio por litro</div>
          <div className={css.chartDesc}>7 dias — guia sincronizada</div>
          <FlowChart
            type="line"
            height={170}
            labels={['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']}
            series={[
              { label: 'Gasto ($k)', values: [38, 42, 40, 45, 44, 47, 46], color: DOMAIN.combustible.token },
              { label: '$/L', values: [22.4, 22.6, 22.9, 23.1, 23.0, 23.2, 23.0], color: DOMAIN.precio.token },
            ]}
            ariaLabel="El gasto sube mas rapido que el precio por litro"
          />
        </Card>
      </div>
      <Card>
        <div className={css.chartHeaderSolo}>Ultimas cargas</div>
        <Table
          columns={[
            { key: 'unit', label: 'Unidad', mono: true },
            { key: 'station', label: 'Estacion' },
            { key: 'liters', label: 'Litros', align: 'right' as const, mono: true },
            { key: 'price', label: '$/L', align: 'right' as const, mono: true },
            { key: 'total', label: 'Total', align: 'right' as const, mono: true },
            { key: 'time', label: 'Cuando' },
          ]}
          rows={[
            { unit: 'JMX-214-B', station: 'Pemex Reforma', liters: '42.3', price: '23.40', total: '$989.80', time: 'hoy 14:32' },
            { unit: 'KTR-882-A', station: 'G500 Roma Norte', liters: '58.0', price: '22.90', total: '$1,328.20', time: 'hoy 11:08' },
            { unit: 'TWN-559-F', station: 'Pemex Polanco', liters: '39.5', price: '23.40', total: '$924.30', time: 'ayer 19:44' },
          ]}
          rowKey="unit"
          density="compact"
          style={{ border: 'none', boxShadow: 'none' }}
        />
      </Card>
    </>
  )
}

function MantenimientoView() {
  return (
    <>
      <DashboardHeader title="Mantenimiento" crumbs={['Dashboards', 'Mantenimiento']}
        cta={<Button variant="accent" icon="build">Agendar servicio</Button>}
      />
      <div className={css.kpiGrid4}>
        <StatTile label="En taller ahora" value="9" delta="+2 vs semana pasada" icon="build" tone="danger" />
        <StatTile label="Costo del mes" value="$25,300" delta="−12%" icon="payments" tone="success" />
        <StatTile label="Tiempo medio en taller" value="1.8 dias" delta="−0.4 dias" icon="schedule" tone="success" />
        <StatTile label="Servicios proximos (14 d)" value="12" icon="event_upcoming" />
      </div>
      <div className={css.dashGrid2eq}>
        <Card>
          <div className={css.chartHeaderSolo}>Costo por tipo</div>
          <Donut
            segments={[
              { label: 'Preventivo', value: 11, color: DOMAIN.preventivo.token, icon: DOMAIN.preventivo.icon },
              { label: 'Correctivo', value: 9, color: DOMAIN.correctivo.token, icon: DOMAIN.correctivo.icon },
              { label: 'Llantas', value: 5.3, color: DOMAIN.llantas.token, icon: DOMAIN.llantas.icon },
            ]}
            centerValue="$25.3k"
            centerLabel="Mes"
            legend
          />
        </Card>
        <Card>
          <div className={css.chartHeaderSolo}>KPIs de mantenimiento vs meta</div>
          <BulletChart color={DOMAIN.mantenimiento.token} rows={[
            { label: 'Disponibilidad', value: 93, target: 95, prev: 89, max: 100 },
            { label: 'Costo/unidad ($k)', value: 1.98, target: 2.5, prev: 2.2, max: 3 },
            { label: 'Dias en taller', value: 1.8, target: 2.0, prev: 2.2, max: 4 },
          ]} />
        </Card>
      </div>
      <Card>
        <div className={css.chartHeaderSolo}>Calendario de servicios</div>
        <GanttChart tasks={[
          { id: 'm1', name: 'MVD-101 · Servicio 40k', start: '2026-08-15', end: '2026-08-18', progress: 80, color: DOMAIN.preventivo.token },
          { id: 'm2', name: 'KTR-882 · Balatas', start: '2026-08-20', end: '2026-08-22', progress: 0, color: DOMAIN.correctivo.token },
          { id: 'm3', name: 'JMX-214 · Rotación llantas', start: '2026-08-25', end: '2026-08-26', progress: 0, color: DOMAIN.llantas.token },
          { id: 'm4', name: 'QRS-330 · Servicio 20k', start: '2026-09-01', end: '2026-09-04', progress: 0, color: DOMAIN.preventivo.token },
        ]} />
      </Card>
      <div className={css.dashGrid2eq} style={{ marginTop: 16 }}>
        <Card>
          <div className={css.chartHeader}>Salud de flota por dimension</div>
          <div className={css.chartDesc}>Promedio ponderado 0-100 — las areas debiles requieren atencion</div>
          <FlowChart
            type="radar"
            height={260}
            indicators={[
              { name: 'Motor', max: 100, icon: 'speed' },
              { name: 'Frenos', max: 100, icon: 'do_not_step' },
              { name: 'Carroceria', max: 100, icon: 'directions_car' },
              { name: 'Electrico', max: 100, icon: 'bolt' },
              { name: 'Suspension', max: 100, icon: 'unfold_more' },
              { name: 'Llantas', max: 100, icon: 'tire_repair' },
            ]}
            itemColors={[
              'var(--viz-3)',
              'var(--status-danger)',
              'var(--viz-2)',
              'var(--viz-1)',
              'var(--viz-5)',
              'var(--viz-4)',
            ]}
            series={[
              { label: 'Flota actual', values: [82, 68, 95, 88, 91, 74], color: DOMAIN.mantenimiento.token },
              { label: 'Meta', values: [90, 85, 90, 90, 90, 85], color: 'var(--border-strong)' },
            ]}
            ariaLabel="Frenos y llantas estan por debajo de la meta de salud de flota"
          />
        </Card>
        <Card>
          <div className={css.chartHeader}>Tendencia de costos (6 meses)</div>
          <div className={css.chartDesc}>Apilado por tipo de servicio</div>
          <FlowChart
            type="stackedBar"
            height={240}
            labels={['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago']}
            series={[
              { label: 'Preventivo', values: [14, 12, 15, 11, 13, 11], color: DOMAIN.preventivo.token },
              { label: 'Correctivo', values: [8, 11, 7, 10, 8, 9], color: DOMAIN.correctivo.token },
              { label: 'Llantas', values: [4, 3, 6, 4, 5, 5.3], color: DOMAIN.llantas.token },
            ]}
            ariaLabel="El costo correctivo se mantiene alto mientras el preventivo baja"
          />
        </Card>
      </div>
      <Card style={{ marginTop: 16 }}>
        <div className={css.chartHeaderSolo}>Proximos servicios</div>
        <Table
          columns={[
            { key: 'unit', label: 'Unidad', mono: true },
            { key: 'service', label: 'Servicio' },
            { key: 'km', label: 'Km actuales', align: 'right' as const, mono: true },
            { key: 'due', label: 'Vence', render: (r: { days: number }) =>
              r.days <= 0 ? <Badge tone="danger" icon="error">Vencido</Badge>
                : r.days <= 7 ? <Badge tone="warning" icon="schedule">{r.days} dias</Badge>
                : <Badge tone="default">{r.days} dias</Badge>
            },
            { key: 'a', label: '', align: 'right' as const, render: () => <Button variant="secondary" size="sm">Agendar</Button> },
          ]}
          rows={[
            { unit: 'MVD-101-C', service: 'Servicio 40,000 km', km: '41,280', days: -3 },
            { unit: 'KTR-882-A', service: 'Cambio de balatas', km: '62,110', days: 4 },
            { unit: 'JMX-214-B', service: 'Rotacion de llantas', km: '28,400', days: 11 },
            { unit: 'QRS-330-E', service: 'Servicio 20,000 km', km: '19,050', days: 18 },
          ]}
          rowKey="unit"
          density="compact"
          style={{ border: 'none', boxShadow: 'none' }}
        />
      </Card>
    </>
  )
}

function ElectroView() {
  return (
    <>
      <DashboardHeader title="Electromovilidad" crumbs={['Dashboards', 'Electromovilidad']}
        cta={<Button variant="accent" icon="ev_station">Nueva carga</Button>}
      />
      <div className={css.kpiGrid4}>
        <StatTile label="kWh cargados (mes)" value="4,820" delta="+18%" icon="bolt" tone="success" />
        <StatTile label="Costo por km (EV)" value="$0.86" delta="vs $2.14 combustion" icon="route" tone="success" />
        <StatTile label="CO₂ evitado" value="3.1 t" delta="+0.5 t vs mes pasado" icon="eco" tone="success" />
        <StatTile label="Autonomia media" value="312 km" delta="−4% (clima)" icon="battery_charging_full" />
      </div>
      <div className={css.dashGrid2}>
        <Card>
          <div className={css.chartHeader}>Sesiones de carga por estacion</div>
          <div className={css.chartDesc}>186 sesiones este mes</div>
          <Bars height={180} data={[
            { label: 'Polanco', value: 64, color: 'var(--viz-1)' }, { label: 'Condesa', value: 48, color: 'var(--viz-4)' },
            { label: 'Anzures', value: 31, color: 'var(--viz-5)' }, { label: 'Del Valle', value: 26, color: 'var(--viz-3)' }, { label: 'Base', value: 17, color: 'var(--viz-6)' },
          ]} />
        </Card>
        <Card>
          <div className={css.chartHeaderSolo}>Flota por tipo</div>
          <Donut
            segments={[
              { label: 'Combustión', value: 96, color: DOMAIN.combustion.token, icon: DOMAIN.combustion.icon },
              { label: 'Eléctricas', value: 24, color: DOMAIN.electricas.token, icon: DOMAIN.electricas.icon },
              { label: 'Híbridas', value: 8, color: DOMAIN.hibridas.token, icon: DOMAIN.hibridas.icon },
            ]}
            centerValue="128"
            centerLabel="Unidades"
            legend
          />
        </Card>
      </div>
      <Card>
        <div className={css.chartHeader}>Adopcion EV vs meta por region</div>
        <div className={css.chartDesc}>% de la flota electrificada — barra vertical = meta</div>
        <FlowChart
          type="bar"
          horizontal
          height={200}
          labels={['CDMX', 'Guadalajara', 'Monterrey', 'Puebla']}
          series={[{ label: '% EV', values: [22, 9, 31, 5] }]}
          itemColors={['var(--viz-1)', 'var(--viz-4)', 'var(--viz-5)', 'var(--viz-3)']}
          format={v => v + '%'}
          ariaLabel="Monterrey lidera la electrificacion con 31%"
        />
      </Card>
      <div className={css.dashGrid2} style={{ marginTop: 16 }}>
        <Card>
          <div className={css.chartHeader}>kWh cargados (6 meses)</div>
          <div className={css.chartDesc}>Area sombreada = tendencia de adopcion EV</div>
          <FlowChart
            type="area"
            height={180}
            labels={['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago']}
            series={[{ label: 'kWh', values: [2800, 3100, 3400, 3900, 4200, 4820], color: DOMAIN.electromovilidad.token }]}
            ariaLabel="El consumo electrico crece 12% mensual en promedio"
          />
        </Card>
        <Card>
          <div className={css.chartHeader}>Meta de electrificacion</div>
          <div className={css.chartDesc}>% de la flota que es electrica o hibrida</div>
          <FlowChart
            type="gauge"
            height={180}
            series={[{ label: 'Electrificacion', values: [25] }]}
            target={40}
            max={100}
            thresholds={[[20, 'var(--status-danger)'], [40, 'var(--status-warning)'], [100, 'var(--status-success)']]}
            format={v => v + '%'}
            ariaLabel="25% de la flota es electrica, meta 40%"
          />
        </Card>
      </div>
      <Card style={{ marginTop: 16 }}>
        <div className={css.chartHeaderSolo}>Costo de energia vs gasolina equivalente</div>
        <div className={css.sparkRow}>
          <div className={css.sparkItem}>
            <div className={css.sparkItemLabel}>$/kWh promedio</div>
            <Sparkline values={[4.4, 4.3, 4.2, 4.1, 4.2, 4.0, 4.05]} width={240} height={44} color="var(--status-success)" />
          </div>
          <div className={css.sparkItem}>
            <div className={css.sparkItemLabel}>Equivalente gasolina $/L</div>
            <Sparkline values={[22.4, 22.6, 22.9, 23.1, 23.0, 23.2, 23.0]} width={240} height={44} color="var(--status-warning)" />
          </div>
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center' }}>
            <Badge tone="success" icon="savings">Ahorro estimado: $41,200/mes con 24 EVs</Badge>
          </div>
        </div>
      </Card>
    </>
  )
}

function PeajeView() {
  return (
    <>
      <DashboardHeader title="Peaje" crumbs={['Dashboards', 'Peaje']}
        cta={<Button variant="accent" icon="toll">Registrar cruce</Button>}
      />
      <div className={css.kpiGrid4}>
        <StatTile label="Gasto en peaje (mes)" value="$41,080" delta="+6%" icon="toll" tone="danger" />
        <StatTile label="Cruces" value="1,204" delta="+9%" icon="swap_horiz" />
        <StatTile label="Tags por vencer (30 d)" value="7" icon="sell" tone="warning" />
        <StatTile label="Disputas abiertas" value="2" delta="−1" icon="flag" tone="success" />
      </div>
      <div className={css.dashGrid2}>
        <Card>
          <div className={css.chartHeaderSolo}>Gasto por caseta</div>
          <Bars height={180} data={[
            { label: 'Tepotzotlan', value: 12.4, color: 'var(--viz-4)' }, { label: 'San Marcos', value: 8.9, color: 'var(--viz-1)' },
            { label: 'Ecatepec', value: 7.2, color: 'var(--viz-5)' }, { label: 'Chalco', value: 6.8, color: 'var(--viz-3)' }, { label: 'Otras', value: 5.8, color: 'var(--viz-6)' },
          ]} />
        </Card>
        <Card>
          <div className={css.chartHeaderSolo}>Tags por vencer</div>
          <Table
            columns={[
              { key: 'unit', label: 'Unidad', mono: true },
              { key: 'days', label: 'Vence', render: (r: { days: number }) =>
                r.days <= 7 ? <Badge tone="warning" icon="schedule">{r.days} dias</Badge> : <Badge>{r.days} dias</Badge>
              },
              { key: 'a', label: '', align: 'right' as const, render: () => <Button variant="ghost" size="sm">Renovar</Button> },
            ]}
            rows={[
              { unit: 'PLQ-472-D', days: 5 },
              { unit: 'JMX-214-B', days: 12 },
              { unit: 'QRS-330-E', days: 21 },
              { unit: 'TWN-559-F', days: 26 },
            ]}
            rowKey="unit"
            density="compact"
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </Card>
      </div>
      <div className={css.dashGrid2} style={{ marginTop: 16 }}>
        <Card>
          <div className={css.chartHeader}>Resolucion de disputas</div>
          <div className={css.chartDesc}>Embudo de cobros disputados este trimestre</div>
          <FlowChart
            type="funnel"
            height={200}
            color={DOMAIN.peaje.token}
            series={[{ label: 'Disputas', data: [
              { label: 'Cobros totales', value: 1204 },
              { label: 'Revisados', value: 840 },
              { label: 'Disputados', value: 420 },
              { label: 'Resueltos a favor', value: 248 },
              { label: 'Reembolsados', value: 168 },
            ] }]}
            ariaLabel="De 1204 cobros, 420 fueron disputados y 168 reembolsados"
          />
        </Card>
        <Card>
          <div className={css.chartHeaderSolo}>Cruces recientes</div>
          <Table
            columns={[
              { key: 'unit', label: 'Unidad', mono: true },
              { key: 'caseta', label: 'Caseta' },
              { key: 'amount', label: 'Importe', align: 'right' as const, mono: true },
              { key: 'time', label: 'Cuando' },
              { key: 'st', label: 'Estado', render: (r: { disputed?: boolean }) =>
                r.disputed ? <Badge tone="danger" icon="flag">En disputa</Badge> : <Badge tone="success" icon="check">Aplicado</Badge>
              },
            ]}
            rows={[
              { unit: 'JMX-214-B', caseta: 'Tepotzotlan', amount: '$118.00', time: 'hoy 07:44' },
              { unit: 'MVD-101-C', caseta: 'San Marcos', amount: '$96.00', time: 'hoy 06:10' },
              { unit: 'KTR-882-A', caseta: 'Tepotzotlan', amount: '$236.00', time: 'ayer 22:03', disputed: true },
            ]}
            rowKey="unit"
            density="compact"
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </Card>
      </div>
    </>
  )
}

function FinanzasView() {
  return (
    <>
      <DashboardHeader title="Finanzas" crumbs={['Dashboards', 'Finanzas']}
        cta={<Button variant="accent" icon="summarize">Generar reporte</Button>}
      />
      <div className={css.kpiGrid4}>
        <StatTile label="Ingreso del mes" value="$612k" delta="+11%" icon="trending_up" tone="success" />
        <StatTile label="Costo operativo" value="$248k" delta="−4%" icon="payments" tone="success" />
        <StatTile label="Margen" value="59.5%" delta="+2.1 pts" icon="percent" tone="success" />
        <StatTile label="Proyeccion trimestre" value="$1.9M" delta="on track" icon="query_stats" />
      </div>
      <Card style={{ marginBottom: 16 }}>
        <div className={css.chartHeader}>Gasto por region</div>
        <div className={css.chartDesc}>Tamaño = gasto — click para entrar a la region</div>
        <Treemap nodes={[
          { label: 'CDMX', value: 812, deviation: 0.06, color: 'var(--viz-1)' },
          { label: 'Guadalajara', value: 340, deviation: -0.03, color: 'var(--viz-4)' },
          { label: 'Monterrey', value: 298, deviation: 0.12, color: 'var(--viz-5)' },
          { label: 'Puebla', value: 120, deviation: -0.08, color: 'var(--viz-3)' },
        ]} />
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <div className={css.chartHeader}>El 20% de unidades que concentra el gasto</div>
        <div className={css.chartDesc}>Pareto — enfoca la revision en las barras accent</div>
        <ParetoChart
          data={[
            { label: 'MVD-101', value: 24 },
            { label: 'JMX-214', value: 19 },
            { label: 'KTR-882', value: 16 },
            { label: 'PLQ-472', value: 8 },
            { label: 'QRS-330', value: 6 },
            { label: 'TWN-559', value: 5 },
            { label: 'XCV-100', value: 3 },
            { label: 'BNM-220', value: 2 },
          ]}
          threshold={0.8}
        />
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <div className={css.chartHeader}>Puente ingreso → margen</div>
        <div className={css.chartDesc}>Waterfall — como el ingreso se convierte en margen operativo</div>
        <FlowChart
          type="waterfall"
          height={220}
          labels={['Ingreso', 'Combustible', 'Peaje', 'Mantenimiento', 'Personal', 'Otros', 'Margen']}
          series={[{ label: 'Flujo', values: [612, -182, -41, -25, -85, -15, 264] }]}
          format={v => '$' + Math.abs(v) + 'k'}
          ariaLabel="De $612k de ingreso, el margen operativo es $264k tras restar costos"
        />
      </Card>
      <div className={css.dashGrid2}>
        <Card>
          <div className={css.chartHeader}>Ingreso vs costo (6 meses)</div>
          <div className={css.chartDesc}>Linea con guia sincronizada al pasar el mouse</div>
          <FlowChart
            type="line"
            height={190}
            format={v => '$' + v + 'k'}
            labels={['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']}
            series={[
              { label: 'Ingreso', values: [540, 571, 558, 590, 601, 612], color: DOMAIN.ingreso.token },
              { label: 'Costo', values: [262, 255, 270, 259, 258, 248], color: DOMAIN.costo.token },
            ]}
            ariaLabel="El ingreso crece y el costo baja: el margen se abre en 6 meses"
          />
        </Card>
        <Card>
          <div className={css.chartHeaderSolo}>Estructura de costos</div>
          <Donut
            segments={[
              { label: 'Combustible', value: 182, color: DOMAIN.combustible.token, icon: DOMAIN.combustible.icon },
              { label: 'Peaje', value: 41, color: DOMAIN.peaje.token, icon: DOMAIN.peaje.icon },
              { label: 'Mantenimiento', value: 25, color: DOMAIN.mantenimiento.token, icon: DOMAIN.mantenimiento.icon },
            ]}
            centerValue="$248k"
            centerLabel="Total"
            legend
          />
        </Card>
      </div>
      <Card style={{ marginTop: 16 }}>
        <div className={css.chartHeaderSolo}>Margen por unidad (top y bottom)</div>
        <Table
          columns={[
            { key: 'unit', label: 'Unidad', mono: true },
            { key: 'driver', label: 'Conductor' },
            { key: 'rev', label: 'Ingreso', align: 'right' as const, mono: true },
            { key: 'cost', label: 'Costo', align: 'right' as const, mono: true },
            { key: 'm', label: 'Margen', align: 'right' as const, render: (r: { pct: number }) => (
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: r.pct >= 55 ? 'var(--status-success-text)' : 'var(--status-danger-text)' }}>{r.pct}%</span>
            ) },
          ]}
          rows={[
            { unit: 'MVD-101-C', driver: 'Rosa Duarte', rev: '$8,410', cost: '$2,930', pct: 65 },
            { unit: 'JMX-214-B', driver: 'Ana Sosa', rev: '$7,850', cost: '$2,990', pct: 62 },
            { unit: 'PLQ-472-D', driver: 'Marco Gil', rev: '$5,120', cost: '$1,470', pct: 71 },
            { unit: 'KTR-882-A', driver: 'Luis Prieto', rev: '$6,020', cost: '$3,480', pct: 42 },
          ]}
          rowKey="unit"
          density="compact"
          style={{ border: 'none', boxShadow: 'none' }}
        />
      </Card>
    </>
  )
}

export { OverviewView as DashboardPage }
export { CombustibleView, MantenimientoView, ElectroView, PeajeView, FinanzasView }
