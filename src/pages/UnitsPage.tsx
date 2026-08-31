import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/primitives/Button'
import { Input } from '../ui/primitives/Input'
import { Avatar } from '../ui/primitives/Avatar'
import { Skeleton } from '../ui/primitives/Skeleton'
import { Card } from '../ui/components/Card'
import { Table } from '../ui/components/Table'
import { Tabs } from '../ui/components/Tabs'
import { EmptyState } from '../ui/primitives/EmptyState'
import { Dialog } from '../ui/components/Dialog'
import { DetailPanel } from '../app/DetailPanel'
import { PageHeader } from '../ui/patterns/PageHeader'
import { statusBadge } from '../utils/statusBadge'
import { useNotify } from '../app/NotifyContext'
import { useUnits, useDeleteUnit } from '../data/api'
import css from './UnitsPage.module.css'

export function UnitsPage() {
  const notify = useNotify()
  const { data: units = [], isLoading, isError } = useUnits()
  const deleteMutation = useDeleteUnit()
  const [tab, setTab] = useState('todas')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const filtered = units.filter(
    (u) =>
      (tab === 'todas' || u.status === tab) &&
      (query === '' || (u.plate + u.driver).toLowerCase().includes(query.toLowerCase()))
  )
  const unit = units.find((u) => u.id === selected)

  const doDelete = () => {
    if (!selected) return
    deleteMutation.mutate(selected, {
      onSuccess: () => {
        setConfirmOpen(false)
        setSelected(null)
        notify('Unidad eliminada.')
      },
    })
  }

  return (
    <div className={css.unitsWrapper}>
      <div className={css.unitsContent}>
        <PageHeader
          breadcrumb={['Flota', 'Unidades']}
          title="Unidades"
          actions={<Link to="/unidades/nueva" style={{ textDecoration: 'none' }}><Button variant="primary" icon="add">Agregar unidad</Button></Link>}
        />
        <div className={css.filterRow}>
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { value: 'todas', label: 'Todas', count: units.length },
              { value: 'ruta', label: 'En ruta', icon: 'navigation', count: units.filter((u) => u.status === 'ruta').length },
              { value: 'taller', label: 'Taller', count: units.filter((u) => u.status === 'taller').length },
              { value: 'inactiva', label: 'Inactivas' },
            ]}
          />
          <div className={css.searchWrapper}>
            <Input icon="search" placeholder="Buscar placa o conductor…" value={query} onChange={setQuery} size="sm" />
          </div>
        </div>
        {isLoading ? (
          <Card>
            <Skeleton variant="title" width="30%" />
            <Skeleton variant="card" height={240} style={{ marginTop: 14 }} />
          </Card>
        ) : isError ? (
          <Card padding={0}>
            <EmptyState
              icon="error"
              title="Error al cargar"
              description="No se pudieron obtener las unidades. Intenta de nuevo."
            />
          </Card>
        ) : filtered.length === 0 ? (
          <Card padding={0}>
            <EmptyState
              icon="search_off"
              title="Sin resultados"
              description={'Nada coincide con "' + query + '". Revisa la placa o el nombre.'}
              action={<Button variant="secondary" size="sm" onClick={() => setQuery('')}>Limpiar busqueda</Button>}
            />
          </Card>
        ) : (
          <Table
            rowKey="id"
            selectedKey={selected ?? undefined}
            onRowClick={(r) => setSelected(r.id === selected ? null : r.id as string)}
            columns={[
              { key: 'plate', label: 'Placa', mono: true },
              {
                key: 'driver',
                label: 'Conductor',
                render: (r) => (
                  <span className={css.cellDriver}>
                    <Avatar name={r.driver as string} size="sm" />
                    {r.driver as string}
                  </span>
                ),
              },
              { key: 'type', label: 'Tipo' },
              { key: 'trips', label: 'Viajes', align: 'right', mono: true },
              { key: 'km', label: 'Km', align: 'right', mono: true },
              { key: 'status', label: 'Estado', render: (r) => statusBadge(r.status as string) },
            ]}
            rows={filtered}
          />
        )}
      </div>
      {unit && <DetailPanel unit={unit} onClose={() => setSelected(null)} onDelete={() => setConfirmOpen(true)} />}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        tone="danger"
        title="Eliminar unidad?"
        description={unit ? unit.plate + ' se desvinculara de ' + unit.driver + '. Esta accion no se puede deshacer.' : ''}
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={doDelete}>Eliminar</Button>
          </>
        }
      />
    </div>
  )
}
