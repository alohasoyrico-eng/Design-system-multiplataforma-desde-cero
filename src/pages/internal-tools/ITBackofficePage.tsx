import { useState } from 'react'
import { Guard, useITToast } from '../../layout/InternalToolsLayout'
import { Table } from '../../ui/components/Table'
import { BulkActionsTable } from '../../ui/components/BulkActionsTable'
import { Badge } from '../../ui/primitives/Badge'
import { Button } from '../../ui/primitives/Button'
import { Card } from '../../ui/components/Card'
import { Drawer } from '../../ui/components/Drawer'
import { StatusView } from '../../ui/primitives/StatusView'
import { PageHeader } from '../../ui/patterns/PageHeader'
import { DOCS, STATUS_TONE, type Doc } from './data'
import css from './ITBackofficePage.module.css'

function DocDetail({ doc, onClose, onDecision }: {
  doc: Doc | null; onClose: () => void; onDecision: (id: string, status: string) => void
}) {
  const [result, setResult] = useState<string | null>(null)

  const decide = (status: string) => {
    if (!doc) return
    setResult(status)
    setTimeout(() => {
      onDecision(doc.id, status)
      setResult(null)
    }, 1200)
  }

  const canAct = doc && !result && doc.status === 'pendiente'

  return (
    <Drawer
      open={!!doc}
      onClose={() => { setResult(null); onClose() }}
      title={doc ? `${doc.id} · ${doc.who}` : ''}
      width={460}
      footer={canAct ? (
        <>
          <Button variant="danger" onClick={() => decide('rechazado')}>Rechazar</Button>
          <Button variant="primary" onClick={() => decide('aprobado')}>Aprobar</Button>
        </>
      ) : undefined}
    >
      {doc && !result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-stack)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span className={css.docName}>{doc.who}</span>
            <Badge tone={STATUS_TONE[doc.status]}>{doc.status}</Badge>
          </div>
          <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Enviado {doc.submitted}</div>

          <Card style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className={`flow-symbol ${css.docIcon}`} aria-hidden="true">draft</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={css.docFile}>{doc.file}</div>
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{doc.doc}</div>
            </div>
            <Button variant="secondary" size="sm" icon="visibility">Ver</Button>
          </Card>
        </div>
      )}
      {doc && result && (
        <StatusView
          status={result === 'aprobado' ? 'success' : 'error'}
          title={result === 'aprobado' ? 'Documento aprobado' : 'Documento rechazado'}
          description={
            result === 'aprobado'
              ? `El documento de ${doc.who} ha sido aprobado.`
              : `El documento de ${doc.who} ha sido rechazado.`
          }
        />
      )}
    </Drawer>
  )
}

export function ITBackofficePage() {
  const [docs, setDocs] = useState(DOCS)
  const [selected, setSelected] = useState<Doc | null>(null)
  const notify = useITToast()

  const onDecision = (id: string, status: string) => {
    setDocs(ds => ds.map(d => d.id === id ? { ...d, status } : d))
    setSelected(null)
    notify(`Documento ${id} ${status === 'aprobado' ? 'aprobado' : 'rechazado'}.`)
  }

  const pendingCount = docs.filter(d => d.status === 'pendiente').length

  return (
    <Guard allowed={['admin', 'ops']}>
      <PageHeader title="Back-office" trailing={<span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{pendingCount} pendientes de {docs.length}</span>} />

      <BulkActionsTable
        rowKey="id"
        actions={[
          { id: 'approve', label: 'Aprobar', icon: 'check_circle' },
          { id: 'reject', label: 'Rechazar', icon: 'cancel', danger: true },
        ]}
        onActionClick={(actionId, keys) => {
          const status = actionId === 'approve' ? 'aprobado' : 'rechazado'
          setDocs(ds => ds.map(d => keys.includes(d.id) ? { ...d, status } : d))
          notify(`${keys.length} documento${keys.length > 1 ? 's' : ''} ${status}${keys.length > 1 ? 's' : ''}.`)
        }}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'who', label: 'Persona / Empresa', render: (r) => <span style={{ fontWeight: 600 }}>{String((r as Record<string, unknown>).who)}</span> },
          { key: 'doc', label: 'Documento' },
          { key: 'submitted', label: 'Enviado' },
          { key: 'status', label: 'Estado', render: (r) => <Badge tone={STATUS_TONE[String((r as Record<string, unknown>).status)]}>{String((r as Record<string, unknown>).status)}</Badge> },
        ]}
        rows={docs}
      />

      <Card style={{ marginTop: 'var(--gap-stack)' }}>
        <div style={{ font: 'var(--type-label-sm)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
          Vista detallada (click en fila)
        </div>
        <Table
          rowKey="id"
          onRowClick={(row) => setSelected(row as Doc)}
          columns={[
            { key: 'id', label: 'ID', mono: true },
            { key: 'who', label: 'Persona / Empresa', render: (r) => <span style={{ fontWeight: 600 }}>{(r as Doc).who}</span> },
            { key: 'doc', label: 'Documento' },
            { key: 'submitted', label: 'Enviado' },
            { key: 'status', label: 'Estado', render: (r) => <Badge tone={STATUS_TONE[(r as Doc).status]}>{(r as Doc).status}</Badge> },
          ]}
          rows={docs}
          density="compact"
          style={{ border: 'none', boxShadow: 'none' }}
        />
      </Card>

      <DocDetail doc={selected} onClose={() => setSelected(null)} onDecision={onDecision} />
    </Guard>
  )
}
