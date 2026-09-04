import { useState } from 'react'
import { Guard, useITToast } from '../../layout/InternalToolsLayout'
import { Table } from '@alohasoyrico-eng/flow-react'
import { Badge } from '@alohasoyrico-eng/flow-react'
import { Button } from '@alohasoyrico-eng/flow-react'
import { Drawer } from '@alohasoyrico-eng/flow-react'
import { Timeline } from '@alohasoyrico-eng/flow-react'
import { StatusView } from '@alohasoyrico-eng/flow-react'
import { PageHeader } from '@alohasoyrico-eng/flow-react'
import { CASES, STATUS_TONE, type Case } from './data'

function CaseDetail({ caso, onClose, onResolve }: {
  caso: Case | null; onClose: () => void; onResolve: (id: string, status: string) => void
}) {
  const [result, setResult] = useState<string | null>(null)

  const resolve = (status: string) => {
    if (!caso) return
    setResult(status)
    setTimeout(() => {
      onResolve(caso.id, status)
      setResult(null)
    }, 1400)
  }

  const canAct = caso && !result && caso.status !== 'resuelta' && caso.status !== 'rechazada'

  return (
    <Drawer
      open={!!caso}
      onClose={() => { setResult(null); onClose() }}
      title={caso ? `${caso.id} · ${caso.type}` : ''}
      width={480}
      footer={canAct ? (
        <>
          <Button variant="danger" onClick={() => resolve('rechazada')}>Rechazar</Button>
          <Button variant="primary" onClick={() => resolve('resuelta')}>Resolver a favor del cliente</Button>
        </>
      ) : undefined}
    >
      {caso && !result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-stack)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Badge tone={STATUS_TONE[caso.status]}>{caso.status}</Badge>
            <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{caso.who} · {caso.amount} · Abierto {caso.opened}</span>
          </div>

          <Timeline
            items={caso.steps.map(s => ({
              title: s.title,
              timestamp: s.timestamp,
              status: s.status as 'done' | 'active' | 'pending' | 'error',
            }))}
            mode="events"
          />
        </div>
      )}
      {caso && result && (
        <StatusView
          status={result === 'resuelta' ? 'success' : 'error'}
          title={result === 'resuelta' ? 'Caso resuelto' : 'Caso rechazado'}
          description={
            result === 'resuelta'
              ? `El caso de ${caso.who} ha sido resuelto a favor del cliente.`
              : `El caso de ${caso.who} ha sido rechazado.`
          }
        />
      )}
    </Drawer>
  )
}

export function ITCasosPage() {
  const [cases, setCases] = useState(CASES)
  const [selected, setSelected] = useState<Case | null>(null)
  const notify = useITToast()

  const onResolve = (id: string, status: string) => {
    setCases(cs => cs.map(c => c.id === id ? { ...c, status } : c))
    setSelected(null)
    notify(`Caso ${id} ${status === 'resuelta' ? 'resuelto' : 'rechazado'}.`)
  }

  const openCount = cases.filter(c => c.status !== 'resuelta' && c.status !== 'rechazada').length

  return (
    <Guard allowed={['admin', 'agente']}>
      <PageHeader title="Casos" trailing={<span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{openCount} abiertos de {cases.length}</span>} />

      <Table
        rowKey="id"
        onRowClick={(row) => setSelected(row as Case)}
        columns={[
          { key: 'id', label: 'ID', mono: true },
          { key: 'type', label: 'Tipo' },
          { key: 'who', label: 'Cuenta' },
          { key: 'amount', label: 'Monto', mono: true, align: 'right' as const },
          { key: 'status', label: 'Estado', render: (r) => <Badge tone={STATUS_TONE[(r as Case).status]}>{(r as Case).status}</Badge> },
          { key: 'opened', label: 'Abierto', align: 'right' as const },
        ]}
        rows={cases}
      />

      <CaseDetail caso={selected} onClose={() => setSelected(null)} onResolve={onResolve} />
    </Guard>
  )
}
