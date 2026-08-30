import { useState } from 'react'
import { Guard, useITToast } from '../../layout/InternalToolsLayout'
import { Table } from '../../ui/components/Table'
import { Badge } from '../../ui/primitives/Badge'
import { Button } from '../../ui/primitives/Button'
import { Drawer } from '../../ui/components/Drawer'
import { CASES, STATUS_TONE, type Case } from './data'
import css from './internal-tools.module.css'

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
        <div className={css.drawerContent}>
          <div className={css.drawerHeaderRow}>
            <Badge tone={STATUS_TONE[caso.status]}>{caso.status}</Badge>
            <span className={css.drawerMeta}>{caso.who} · {caso.amount} · Abierto {caso.opened}</span>
          </div>

          <div className={css.timeline}>
            {caso.steps.map((s, i) => (
              <div key={i} className={css.timelineItem} data-status={s.status}>
                <div className={css.timelineDot} />
                <div className={css.timelineBody}>
                  <div className={css.timelineTitle}>{s.title}</div>
                  <div className={css.timelineTime}>{s.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {caso && result && (
        <div className={css.statusView}>
          <span className="flow-icon" style={{ fontSize: 48, color: result === 'resuelta' ? 'var(--status-success)' : 'var(--status-danger)' }}>
            {result === 'resuelta' ? 'check_circle' : 'cancel'}
          </span>
          <div className={css.statusTitle}>{result === 'resuelta' ? 'Caso resuelto' : 'Caso rechazado'}</div>
          <div className={css.statusDesc}>
            {result === 'resuelta'
              ? `El caso de ${caso.who} ha sido resuelto a favor del cliente.`
              : `El caso de ${caso.who} ha sido rechazado.`}
          </div>
        </div>
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
      <div className={css.pageHeaderRow}>
        <h1 className={css.pageTitle}>Casos</h1>
        <span className={css.pageCount}>{openCount} abiertos de {cases.length}</span>
      </div>

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
