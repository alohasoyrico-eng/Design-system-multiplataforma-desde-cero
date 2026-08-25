import { useState } from 'react'
import { Button } from '../ui/primitives/Button'
import { Sparkline } from '../ui/primitives/Sparkline'
import { Skeleton } from '../ui/primitives/Skeleton'
import { Card } from '../ui/components/Card'
import { Tabs } from '../ui/components/Tabs'
import { Menu } from '../ui/components/Menu'
import { Bars } from '../ui/components/Bars'
import { DatePicker } from '../ui/components/DatePicker'
import { PageHeader } from '../layout/PageHeader'
import css from '../App.module.css'

export function ReportsPage() {
  const [range, setRange] = useState('7d')
  const [from, setFrom] = useState('2026-07-01')
  const [loading, setLoading] = useState(false)

  const reload = (v: string) => {
    setRange(v)
    setLoading(true)
    setTimeout(() => setLoading(false), 700)
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Flota' }, { label: 'Reportes' }]}
        title="Reportes"
        actions={
          <Menu
            align="right"
            trigger={<Button variant="secondary" icon="download" iconTrailing="expand_more">Exportar</Button>}
            items={[
              { label: 'CSV', icon: 'table' },
              { label: 'PDF', icon: 'picture_as_pdf' },
              { label: 'Enviar por correo', icon: 'mail' },
            ]}
          />
        }
      />
      <div className={css.reportsFilterRow}>
        <Tabs
          value={range}
          onChange={reload}
          items={[
            { value: '7d', label: '7 dias' },
            { value: '30d', label: '30 dias' },
            { value: '90d', label: 'Trimestre' },
          ]}
        />
        <div className={css.dateWrapper}>
          <DatePicker value={from} onChange={setFrom} />
        </div>
      </div>
      {loading ? (
        <div aria-busy="true" aria-label="Cargando reportes" className={css.reportsGrid}>
          <Card>
            <Skeleton variant="title" width="40%" />
            <Skeleton variant="card" height={200} style={{ marginTop: 14 }} />
          </Card>
          <Card>
            <Skeleton variant="title" width="40%" />
            <Skeleton variant="card" height={200} style={{ marginTop: 14 }} />
          </Card>
        </div>
      ) : (
        <div className={css.reportsGrid}>
          <Card>
            <div className={css.chartTitle}>Ingresos por dia</div>
            <div className={css.chartSubtitle}>
              Total del periodo: <span className={css.chartTotal}>$7,627</span>
            </div>
            <Bars
              height={200}
              format={(v) => '$' + v}
              data={[
                { label: 'Lun', value: 820 },
                { label: 'Mar', value: 1140 },
                { label: 'Mie', value: 960 },
                { label: 'Jue', value: 1310 },
                { label: 'Vie', value: 1482 },
                { label: 'Sab', value: 1275 },
                { label: 'Dom', value: 640 },
              ]}
            />
          </Card>
          <Card>
            <div className={css.chartTitle}>Viajes por tipo de unidad</div>
            <div className={css.chartSubtitle}>412 viajes en el periodo</div>
            <Bars
              height={200}
              color="var(--surface-inverse)"
              data={[
                { label: 'Sedan', value: 218 },
                { label: 'Van', value: 104 },
                { label: 'Moto', value: 90 },
              ]}
            />
          </Card>
          <Card style={{ gridColumn: '1 / -1' }}>
            <div className={css.sparklineRow}>
              {([
                ['Tendencia de viajes', [290, 340, 310, 365, 388, 395, 412], 'var(--viz-1)'],
                ['Km recorridos', [610, 720, 684, 790, 812, 795, 810], 'var(--surface-inverse)'],
                ['Cancelaciones', [18, 14, 16, 11, 9, 12, 8], 'var(--status-warning)'],
              ] as [string, number[], string][]).map(([title, vals, color], i) => (
                <div key={i} className={css.sparklineItem}>
                  <div className={css.sparklineLabel}>{title}</div>
                  <Sparkline values={vals} width={220} height={48} color={color} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
