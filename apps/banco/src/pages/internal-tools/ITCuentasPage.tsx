import { useState } from 'react'
import { Table } from '@alohasoyrico-eng/flow-react'
import { Badge } from '@alohasoyrico-eng/flow-react'
import { Avatar } from '@alohasoyrico-eng/flow-react'
import { DetailRow } from '@alohasoyrico-eng/flow-react'
import { Tabs } from '@alohasoyrico-eng/flow-react'
import { Drawer } from '@alohasoyrico-eng/flow-react'
import { Timeline } from '@alohasoyrico-eng/flow-react'
import { PageHeader } from '@alohasoyrico-eng/flow-react'
import { ACCOUNTS, STATUS_TONE, type Account } from './data'
import css from './ITCuentasPage.module.css'

function AccountDetail({ account, onClose }: { account: Account | null; onClose: () => void }) {
  const [tab, setTab] = useState('perfil')

  const prev = useState<string | null>(null)
  if (account && prev[0] !== account.id) {
    prev[0] = account.id
    setTab('perfil')
  }

  return (
    <Drawer open={!!account} onClose={onClose} title={account?.name ?? ''} width={520}>
      {account && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-stack)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Avatar name={account.name} size="lg" />
            <div style={{ flex: 1 }}>
              <Badge tone={account.type === 'Flota' ? 'info' : 'default'}>{account.type}</Badge>
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 4 }}>{account.metric} · desde {account.since}</div>
            </div>
            <Badge tone={STATUS_TONE[account.status]}>{account.status}</Badge>
          </div>

          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { value: 'perfil', label: 'Perfil' },
              { value: 'actividad', label: 'Actividad' },
              { value: 'tickets', label: `Tickets (${account.tickets.length})` },
            ]}
          />

          {tab === 'perfil' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <DetailRow label="Tipo de cuenta" value={account.type} />
              <DetailRow label={account.type === 'Flota' ? 'Unidades' : 'Viajes'} value={account.metric} />
              <DetailRow label="Cliente desde" value={account.since} />
              <DetailRow label="Estado" value={<Badge tone={STATUS_TONE[account.status]}>{account.status}</Badge>} />
            </div>
          )}

          {tab === 'actividad' && (
            <Timeline
              items={account.activity.map(a => ({
                title: a.title,
                timestamp: a.timestamp,
                status: a.status as 'done' | 'active' | 'pending' | 'error',
              }))}
              mode="events"
            />
          )}

          {tab === 'tickets' && (
            <div className={css.ticketLinks}>
              {account.tickets.length === 0 && (
                <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Sin tickets asociados</div>
              )}
              {account.tickets.map(t => (
                <div key={t.id} className={css.ticketLinkCard}>
                  <div style={{ flex: 1 }}>
                    <span className={css.ticketId}>{t.id}</span> {t.subject}
                  </div>
                  <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Drawer>
  )
}

export function ITCuentasPage() {
  const [selected, setSelected] = useState<Account | null>(null)

  return (
    <>
      <PageHeader title="Cuentas" trailing={<span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{ACCOUNTS.length} cuentas</span>} />

      <Table
        rowKey="id"
        onRowClick={(row) => setSelected(row as Account)}
        columns={[
          { key: 'name', label: 'Nombre', render: (r) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={(r as Account).name} size="sm" />
              <span style={{ fontWeight: 600 }}>{(r as Account).name}</span>
            </div>
          )},
          { key: 'type', label: 'Tipo', render: (r) => <Badge tone={(r as Account).type === 'Flota' ? 'info' : 'default'}>{(r as Account).type}</Badge> },
          { key: 'metric', label: 'Métrica', mono: true, align: 'right' as const },
          { key: 'status', label: 'Estado', render: (r) => <Badge tone={STATUS_TONE[(r as Account).status]}>{(r as Account).status}</Badge> },
          { key: 'since', label: 'Desde', align: 'right' as const },
        ]}
        rows={ACCOUNTS}
      />

      <AccountDetail account={selected} onClose={() => setSelected(null)} />
    </>
  )
}
