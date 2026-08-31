import { useState } from 'react'
import { Guard, useITToast } from '../../layout/InternalToolsLayout'
import { Table } from '../../ui/components/Table'
import { FilterableEditableTable, type FilterableColumn } from '../../ui/patterns/FilterableEditableTable'
import { Badge } from '../../ui/primitives/Badge'
import { Button } from '../../ui/primitives/Button'
import { Drawer } from '../../ui/components/Drawer'
import { Field } from '../../ui/primitives/Field'
import { Input } from '../../ui/primitives/Input'
import { Select } from '../../ui/primitives/Select'
import { StatusView } from '../../ui/primitives/StatusView'
import { PageHeader } from '../../ui/patterns/PageHeader'
import { PRICING_RULES, STATUS_TONE, type PricingRule } from './data'

function RuleDetail({ rule, onClose, onSubmit }: {
  rule: PricingRule | null; onClose: () => void; onSubmit: (id: string) => void
}) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!rule) return
    setSubmitted(true)
    setTimeout(() => {
      onSubmit(rule.id)
      setSubmitted(false)
    }, 900)
  }

  return (
    <Drawer
      open={!!rule}
      onClose={() => { setSubmitted(false); onClose() }}
      title={rule ? `${rule.id} · ${rule.name}` : ''}
      width={460}
      footer={rule && !submitted ? (
        <>
          <Button variant="secondary" onClick={() => { setSubmitted(false); onClose() }}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Enviar a aprobación</Button>
        </>
      ) : undefined}
    >
      {rule && !submitted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-stack)' }}>
          <Field label="Nombre">
            <Input value={rule.name} disabled />
          </Field>
          <Field label="Alcance">
            <Input value={rule.scope} disabled />
          </Field>
          <Field label="Tipo">
            <Select
              value={rule.type}
              onChange={() => {}}
              options={[
                { value: 'Base', label: 'Base' },
                { value: 'Surge', label: 'Surge' },
                { value: 'Comision', label: 'Comisión' },
              ]}
            />
          </Field>
          <Field label="Valor">
            <Input value={rule.value} disabled />
          </Field>
          <Field label="Estado">
            <Badge tone={STATUS_TONE[rule.status]}>{rule.status}</Badge>
          </Field>
        </div>
      )}
      {rule && submitted && (
        <StatusView
          status="pending"
          title="Enviado a aprobación"
          description={`La regla "${rule.name}" ha sido enviada. Recibirás notificación cuando sea aprobada.`}
        />
      )}
    </Drawer>
  )
}

const PRICING_COLUMNS: FilterableColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre', filterable: true },
  { key: 'scope', label: 'Alcance', filterable: true },
  { key: 'type', label: 'Tipo', filterable: true },
  { key: 'value', label: 'Valor', editable: true },
  { key: 'status', label: 'Estado' },
  { key: 'by', label: 'Última edición' },
]

export function ITPricingPage() {
  const [rules, setRules] = useState(PRICING_RULES)
  const [selected, setSelected] = useState<PricingRule | null>(null)
  const notify = useITToast()

  const onSubmit = (id: string) => {
    setRules(rs => rs.map(r => r.id === id ? { ...r, status: 'pendiente aprobacion' } : r))
    setSelected(null)
    notify(`Regla ${id} enviada a aprobación.`)
  }

  return (
    <Guard allowed={['admin', 'pricing']}>
      <PageHeader title="Pricing" trailing={<span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{rules.length} reglas</span>} />

      <FilterableEditableTable
        rowKey="id"
        columns={PRICING_COLUMNS}
        rows={rules}
        onUpdate={(rk, ck, val) => {
          setRules(rs => rs.map(r => r.id === rk ? { ...r, [ck]: val } : r))
          notify(`Regla ${rk}: ${ck} actualizado.`)
        }}
      />

      <div style={{ marginTop: 'var(--gap-stack)', font: 'var(--type-label-sm)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
        Detalle (click en fila)
      </div>
      <Table
        rowKey="id"
        onRowClick={(row) => setSelected(row as PricingRule)}
        columns={[
          { key: 'id', label: 'ID', mono: true },
          { key: 'name', label: 'Nombre', render: (r) => <span style={{ fontWeight: 600 }}>{(r as PricingRule).name}</span> },
          { key: 'scope', label: 'Alcance' },
          { key: 'type', label: 'Tipo' },
          { key: 'value', label: 'Valor', mono: true, align: 'right' as const },
          { key: 'status', label: 'Estado', render: (r) => <Badge tone={STATUS_TONE[(r as PricingRule).status]}>{(r as PricingRule).status}</Badge> },
          { key: 'by', label: 'Última edición' },
        ]}
        rows={rules}
        density="compact"
      />

      <RuleDetail rule={selected} onClose={() => setSelected(null)} onSubmit={onSubmit} />
    </Guard>
  )
}
