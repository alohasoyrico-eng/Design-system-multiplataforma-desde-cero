import { useState } from 'react'
import { Button } from '../ui/primitives/Button'
import { IconButton } from '../ui/primitives/IconButton'
import { Input } from '../ui/primitives/Input'
import { Badge } from '../ui/primitives/Badge'
import { Avatar } from '../ui/primitives/Avatar'
import { Progress } from '../ui/primitives/Progress'
import { Card } from '../ui/components/Card'
import { Table } from '../ui/components/Table'
import { Pagination } from '../ui/primitives/Pagination'
import { Accordion } from '../ui/components/Accordion'
import { Drawer } from '../ui/components/Drawer'
import { Menu } from '../ui/components/Menu'
import { FileUpload } from '../ui/components/FileUpload'
import type { UploadedFile } from '../ui/components/FileUpload'
import { Skeleton } from '../ui/primitives/Skeleton'
import { EmptyState } from '../ui/primitives/EmptyState'
import { PageHeader } from '../ui/patterns/PageHeader'
import { statusBadge } from '../utils/statusBadge'
import { useNotify } from '../app/NotifyContext'
import { useDrivers } from '../data/api'
import css from './DriversPage.module.css'

export function DriversPage() {
  const notify = useNotify()
  const { data: drivers = [], isLoading, isError } = useDrivers()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const [docs, setDocs] = useState<UploadedFile[]>([{ name: 'licencia-conducir.pdf', size: 684000 }])

  const filtered = drivers.filter((d) => query === '' || d.name.toLowerCase().includes(query.toLowerCase()))
  const drv = drivers.find((d) => d.id === selected)

  return (
    <>
      <PageHeader
        breadcrumb={['Flota', 'Conductores']}
        title="Conductores"
        actions={
          <>
            <div className={css.inputWidth260}>
              <Input icon="search" placeholder="Buscar conductor…" value={query} onChange={setQuery} size="sm" />
            </div>
            <Button variant="primary" icon="person_add">Invitar</Button>
          </>
        }
      />
      {isLoading ? (
        <Card>
          <Skeleton variant="title" width="30%" />
          <Skeleton variant="card" height={240} style={{ marginTop: 14 }} />
        </Card>
      ) : isError ? (
        <Card padding={0}>
          <EmptyState icon="error" title="Error al cargar" description="No se pudieron obtener los conductores." />
        </Card>
      ) : (
      <>
      <Table
        rowKey="id"
        selectedKey={selected ?? undefined}
        onRowClick={(r) => setSelected(r.id as string)}
        columns={[
          {
            key: 'name',
            label: 'Conductor',
            render: (r) => (
              <span className={css.cellDriver}>
                <Avatar name={r.name as string} size="sm" status={(r.status as string) === 'ruta' ? 'busy' : 'offline'} />
                {r.name as string}
              </span>
            ),
          },
          {
            key: 'rating',
            label: 'Rating',
            align: 'right',
            mono: true,
            render: (r) => (
              <span className={css.cellRating}>
                <span className={`flow-icon flow-icon--fill ${css.ratingIcon}`} aria-hidden="true">star</span>
                {(r.rating as number).toFixed(2)}
              </span>
            ),
          },
          { key: 'trips', label: 'Viajes', align: 'right', mono: true, render: (r) => (r.trips as number).toLocaleString() },
          { key: 'unit', label: 'Unidad', mono: true },
          {
            key: 'docs',
            label: 'Documentos',
            render: (r) => (r.docs as number) === 4
              ? <Badge tone="success" icon="check">Completos</Badge>
              : <Badge tone="warning" icon="schedule">{r.docs as number} de 4</Badge>,
          },
          { key: 'status', label: 'Estado', render: (r) => statusBadge(r.status as string) },
          {
            key: 'menu',
            label: '',
            align: 'right',
            render: (r) => (
              <Menu
                align="right"
                trigger={<IconButton icon="more_vert" ariaLabel={'Acciones ' + (r.name as string)} />}
                items={[
                  { label: 'Ver perfil', icon: 'person', onClick: () => setSelected(r.id as string) },
                  { label: 'Reasignar unidad', icon: 'swap_horiz' },
                  'divider',
                  { label: 'Dar de baja', icon: 'person_off', danger: true },
                ]}
              />
            ),
          },
        ]}
        rows={filtered}
      />
      <div className={css.paginationRow}>
        <span className={css.paginationLabel}>
          {filtered.length} conductores · pagina {page} de 8
        </span>
        <Pagination page={page} pages={8} onChange={setPage} />
      </div>
      </>
      )}
      <Drawer
        open={!!drv}
        onClose={() => setSelected(null)}
        title={drv ? drv.name : ''}
        width={420}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>Cerrar</Button>
            <Button variant="primary" onClick={() => { setSelected(null); notify('Cambios guardados.') }}>Guardar</Button>
          </>
        }
      >
        {drv && (
          <div className={css.drawerProfile}>
            <div className={css.drawerHeader}>
              <Avatar name={drv.name} size="xl" status={drv.status === 'ruta' ? 'busy' : 'offline'} />
              <div>
                {statusBadge(drv.status)}
                <div className={css.drawerSince}>
                  Desde {drv.since} · unidad <span className={css.monoText}>{drv.unit}</span>
                </div>
              </div>
            </div>
            <div className={css.statGrid3}>
              <Card padding={14}>
                <div className={css.statLabelSm}>RATING</div>
                <div className={css.statValueSm}>{drv.rating.toFixed(2)}</div>
              </Card>
              <Card padding={14}>
                <div className={css.statLabelSm}>VIAJES</div>
                <div className={css.statValueSm}>{drv.trips.toLocaleString()}</div>
              </Card>
              <Card padding={14}>
                <div className={css.statLabelSm}>DOCS</div>
                <div className={css.statValueSm}>{drv.docs}/4</div>
              </Card>
            </div>
            <Accordion
              defaultOpen="docs"
              items={[
                {
                  id: 'docs',
                  title: 'Documentos',
                  icon: 'description',
                  meta: drv.docs + ' de 4',
                  content: (
                    <div className={css.docsContent}>
                      <Progress label="Verificacion" value={drv.docs} max={4} showValue />
                      <FileUpload files={docs} onChange={setDocs} accept=".pdf,image/*" label="Sube un documento" hint="PDF o foto · max 10 MB" />
                    </div>
                  ),
                },
                { id: 'hist', title: 'Historial de viajes', icon: 'history', content: '128 viajes este mes. Ultimo: hoy 14:32, Roma Norte → Polanco.' },
                { id: 'pagos', title: 'Pagos', icon: 'payments', content: 'Deposito semanal a cuenta terminacion 4821. Proximo corte: viernes.' },
              ]}
            />
          </div>
        )}
      </Drawer>
    </>
  )
}
