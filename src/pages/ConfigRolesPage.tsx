import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Breadcrumb } from '../ui/primitives/Breadcrumb'
import { Tabs } from '../ui/components/Tabs'
import { Table } from '../ui/components/Table'
import { RoleMatrix } from '../ui/patterns/RoleMatrix'
import { Menu } from '../ui/components/Menu'
import { Dialog } from '../ui/components/Dialog'
import { Toast, ToastStack } from '../ui/primitives/Toast'
import { Button } from '../ui/primitives/Button'
import { IconButton } from '../ui/primitives/IconButton'
import { Badge } from '../ui/primitives/Badge'
import { Avatar } from '../ui/primitives/Avatar'
import { Input } from '../ui/primitives/Input'
import { Select } from '../ui/primitives/Select'
import { Field } from '../ui/primitives/Field'
import { Textarea } from '../ui/primitives/Textarea'
import css from './ConfigRolesPage.module.css'

const DRIVERS = [
  { id: 'd1', name: 'Ana Sosa', unit: 'JMX-214-B', role: 'driver', status: 'activo', [Symbol.toPrimitive]: undefined } as Record<string, unknown>,
  { id: 'd2', name: 'Luis Prieto', unit: 'KTR-882-A', role: 'driver', status: 'activo' } as Record<string, unknown>,
  { id: 'd3', name: 'Rosa Duarte', unit: 'MVD-101-C', role: 'driver', status: 'activo' } as Record<string, unknown>,
  { id: 'd4', name: 'Elena Ruz', unit: '—', role: 'ops', status: 'invitado' } as Record<string, unknown>,
]

const VEHICLES = [
  { id: 'v1', plate: 'JMX-214-B', type: 'Sedan', year: '2024', status: 'activo' } as Record<string, unknown>,
  { id: 'v2', plate: 'KTR-882-A', type: 'Van', year: '2022', status: 'activo' } as Record<string, unknown>,
  { id: 'v3', plate: 'QRS-330-E', type: 'Van', year: '2021', status: 'archivado' } as Record<string, unknown>,
]

const VEHICLE_OPTIONS = VEHICLES.map(v => ({ value: v.plate as string, label: v.plate as string }))

const ROLES = [
  { id: 'admin', label: 'Admin', locked: true },
  { id: 'ops', label: 'Operaciones' },
  { id: 'finanzas', label: 'Finanzas' },
  { id: 'driver', label: 'Driver' },
]

const PERMISSIONS = [
  { id: 'verFlota', label: 'Ver unidades y viajes', group: 'Flota' },
  { id: 'editarUnidades', label: 'Editar unidades', group: 'Flota' },
  { id: 'eliminarUnidades', label: 'Eliminar / archivar unidades', group: 'Flota' },
  { id: 'congelarTarjetas', label: 'Congelar tarjetas', group: 'Tarjetas' },
  { id: 'verMovimientos', label: 'Ver movimientos', group: 'Tarjetas' },
  { id: 'verFinanzas', label: 'Ver dashboard de finanzas', group: 'Finanzas' },
  { id: 'exportar', label: 'Exportar reportes', group: 'Finanzas' },
  { id: 'invitar', label: 'Invitar miembros', group: 'Equipo' },
  { id: 'editarRoles', label: 'Editar roles y permisos', group: 'Equipo' },
]

type Values = Record<string, Record<string, boolean>>

const INITIAL_VALUES: Values = {
  verFlota: { admin: true, ops: true, finanzas: true, driver: true },
  editarUnidades: { admin: true, ops: true },
  eliminarUnidades: { admin: true },
  verFinanzas: { admin: true, finanzas: true },
  exportar: { admin: true, ops: true, finanzas: true },
  invitar: { admin: true, ops: true },
  editarRoles: { admin: true },
  congelarTarjetas: { admin: true, ops: true },
  verMovimientos: { admin: true, ops: true, finanzas: true, driver: true },
}

export function ConfigRolesPage() {
  const [tab, setTab] = useState('roles')
  const [vals, setVals] = useState<Values>(INITIAL_VALUES)
  const [confirm, setConfirm] = useState<{ type: string; label: string } | null>(null)
  const [invite, setInvite] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('driver')
  const [reason, setReason] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const notify = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <div className={css.container}>
      <Breadcrumb items={[{ label: 'Flota' }, { label: 'Configuración' }]} />

      <div className={css.headerRow}>
        <h1 className={css.title}>Configuración</h1>
        <Link to="/" className={css.backLink}>
          <span className="flow-symbol flow-symbol--sm" aria-hidden="true">arrow_back</span>
          Dashboards
        </Link>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'roles', label: 'Roles y permisos' },
          { value: 'equipo', label: `Conductores y equipo (${DRIVERS.length})` },
          { value: 'vehiculos', label: `Vehículos (${VEHICLES.length})` },
        ]}
        style={{ marginBottom: 24, display: 'inline-flex' }}
      />

      {tab === 'roles' && (
        <div className={css.sectionContent}>
          <div className={css.sectionHeader}>
            <p className={css.sectionHint}>
              El rol <b>Admin</b> está bloqueado. Cada cambio queda en la bitácora de seguridad.
            </p>
            <Button variant="secondary" size="sm" icon="add" style={{ marginLeft: 'auto' }}>
              Nuevo rol
            </Button>
          </div>
          <RoleMatrix
            roles={ROLES}
            permissions={PERMISSIONS}
            values={vals}
            onChange={(next) => {
              setVals(next)
              notify('Permiso actualizado. Registrado en bitácora.')
            }}
          />
        </div>
      )}

      {tab === 'equipo' && (
        <div className={css.sectionContent}>
          <div className={css.searchRow}>
            <div className={css.searchInput}>
              <Input icon="search" placeholder="Buscar…" size="sm" value="" onChange={() => {}} />
            </div>
            <Button variant="primary" icon="person_add" style={{ marginLeft: 'auto' }} onClick={() => setInvite(true)}>
              Invitar
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={[
              {
                key: 'name',
                label: 'Miembro',
                render: (r) => (
                  <div className={css.memberCell}>
                    <Avatar name={r.name as string} size="sm" />
                    <span style={{ fontWeight: 600 }}>{r.name as string}</span>
                  </div>
                ),
              },
              {
                key: 'role',
                label: 'Rol',
                render: (r) => (
                  <Badge tone={r.role === 'ops' ? 'info' : 'default'}>
                    {r.role === 'ops' ? 'Operaciones' : 'Driver'}
                  </Badge>
                ),
              },
              {
                key: 'unit',
                label: 'Unidad',
                mono: true,
                render: (r) => (
                  <Select
                    searchable
                    clearable
                    value={r.unit === '—' ? undefined : (r.unit as string)}
                    onChange={() => notify('Unidad reasignada.')}
                    icon="local_taxi"
                    placeholder="Sin asignar"
                    options={VEHICLE_OPTIONS}
                    style={{ minWidth: 150 }}
                  />
                ),
              },
              {
                key: 'status',
                label: 'Estado',
                render: (r) =>
                  r.status === 'activo' ? (
                    <Badge tone="success">Activo</Badge>
                  ) : (
                    <Badge tone="warning" icon="schedule">Invitación enviada</Badge>
                  ),
              },
              {
                key: 'm',
                label: '',
                align: 'right' as const,
                render: (r) => (
                  <Menu
                    align="right"
                    trigger={<IconButton icon="more_vert" ariaLabel={`Acciones ${r.name}`} />}
                    items={[
                      { label: 'Editar rol', icon: 'badge' },
                      { label: 'Reasignar unidad', icon: 'swap_horiz' },
                      'divider',
                      {
                        label: 'Dar de baja',
                        icon: 'person_off',
                        danger: true,
                        onClick: () => setConfirm({ type: 'driver', label: r.name as string }),
                      },
                    ]}
                  />
                ),
              },
            ]}
            rows={DRIVERS}
          />
        </div>
      )}

      {tab === 'vehiculos' && (
        <div className={css.sectionContent}>
          <div className={css.searchRow}>
            <div className={css.searchInput}>
              <Input icon="search" placeholder="Buscar placa…" size="sm" value="" onChange={() => {}} />
            </div>
            <Link to="/unidades/nueva" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
              <Button variant="primary" icon="add">Alta de unidad</Button>
            </Link>
          </div>
          <Table
            rowKey="id"
            columns={[
              { key: 'plate', label: 'Placa', mono: true },
              { key: 'type', label: 'Tipo' },
              { key: 'year', label: 'Año', mono: true },
              {
                key: 'status',
                label: 'Estado',
                render: (r) =>
                  r.status === 'activo' ? (
                    <Badge tone="success">Activo</Badge>
                  ) : (
                    <Badge>Archivado</Badge>
                  ),
              },
              {
                key: 'm',
                label: '',
                align: 'right' as const,
                render: (r) => (
                  <Menu
                    align="right"
                    trigger={<IconButton icon="more_vert" ariaLabel={`Acciones ${r.plate}`} />}
                    items={[
                      { label: 'Editar', icon: 'edit' },
                      { label: 'Ver historial', icon: 'history' },
                      'divider',
                      {
                        label: 'Dar de baja',
                        icon: 'archive',
                        danger: true,
                        onClick: () => setConfirm({ type: 'vehicle', label: r.plate as string }),
                      },
                    ]}
                  />
                ),
              },
            ]}
            rows={VEHICLES}
          />
          <p className={css.footnote}>Las bajas archivan la unidad con su historial — nunca se borra.</p>
        </div>
      )}

      <Dialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        tone="danger"
        title={
          confirm
            ? confirm.type === 'driver'
              ? `¿Dar de baja a ${confirm.label}?`
              : `¿Dar de baja ${confirm.label}?`
            : ''
        }
        description="Se archiva con su historial y pierde acceso. Puedes reactivar después."
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirm(null)
                setReason('')
                notify('Baja registrada con motivo.')
              }}
            >
              Dar de baja
            </Button>
          </>
        }
      >
        <Field label="Motivo de la baja" required help="Alimenta el análisis de rotación.">
          <Textarea rows={2} value={reason} onChange={setReason} placeholder="Ej. renuncia voluntaria, fin de contrato…" />
        </Field>
      </Dialog>

      <Dialog
        open={invite}
        onClose={() => setInvite(false)}
        title="Invitar al equipo"
        description="Recibirá un correo con su código de activación."
        actions={
          <>
            <Button variant="ghost" onClick={() => setInvite(false)}>Cancelar</Button>
            <Button
              variant="primary"
              disabled={!email.includes('@')}
              onClick={() => {
                setInvite(false)
                notify(`Invitación enviada a ${email}.`)
                setEmail('')
              }}
            >
              Enviar invitación
            </Button>
          </>
        }
      >
        <div className={css.inviteFields}>
          <Field label="Correo">
            <Input type="email" icon="mail" placeholder="persona@flota.mx" value={email} onChange={setEmail} />
          </Field>
          <Field label="Rol">
            <Select
              value={role}
              onChange={(v) => setRole(v as string)}
              options={[
                { value: 'driver', label: 'Driver' },
                { value: 'ops', label: 'Operaciones' },
                { value: 'finanzas', label: 'Finanzas' },
              ]}
            />
          </Field>
        </div>
      </Dialog>

      {toast && (
        <ToastStack>
          <Toast tone="success" message={toast} onDismiss={() => setToast(null)} />
        </ToastStack>
      )}
    </div>
  )
}
