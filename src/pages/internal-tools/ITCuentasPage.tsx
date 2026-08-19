import { useState } from 'react'
import { Table } from '../../ui/components/Table'
import { Badge } from '../../ui/primitives/Badge'
import { Avatar } from '../../ui/primitives/Avatar'
import { Tabs } from '../../ui/components/Tabs'
import { Drawer } from '../../ui/components/Drawer'
import { ACCOUNTS, STATUS_TONE, type Account } from './data'
import css from './internal-tools.module.css'

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
        <div className={css.drawerContent}>
          <div className={css.drawerHeaderRow}>
            <Avatar name={account.name} size="lg" />
            <div style={{ flex: 1 }}>
              <Badge tone={account.type === 'Flota' ? 'info' : 'default'}>{account.type}</Badge>
              <div className={css.drawerMeta} style={{ marginTop: 4 }}>{account.metric} · desde {account.since}</div>
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
            <div className={css.kvList}>
              <div className={css.kvRow}><span className={css.kvLabel}>Tipo de cuenta</span><span>{account.type}</span></div>
              <div className={css.kvRow}><span className={css.kvLabel}>{account.type === 'Flota' ? 'Unidades' : 'Viajes'}</span><span>{account.metric}</span></div>
              <div className={css.kvRow}><span className={css.kvLabel}>Cliente desde</span><span>{account.since}</span></div>
              <div className={css.kvRow}><span className={css.kvLabel}>Estado</span><Badge tone={STATUS_TONE[account.status]}>{account.status}</Badge></div>
            </div>
          )}

          {tab === 'actividad' && (
            <div className={css.timeline}>
              {account.activity.map((a, i) => (
                <div key={i} className={css.timelineItem} data-status={a.status}>
                  <div className={css.timelineDot} />
                  <div className={css.timelineBody}>
                    <div className={css.timelineTitle}>{a.title}</div>
                    <div className={css.timelineTime}>{a.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'tickets' && (
            <div className={css.ticketLinks}>
              {account.tickets.length === 0 && (
                <div className={css.drawerMeta}>Sin tickets asociados</div>
              )}
              {account.tickets.map(t => (
                <div key={t.id} className={css.ticketLinkCard}>
                  <div style={{ flex: 1 }}>
                    <span className={css.mono}>{t.id}</span> {t.subject}
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
      <div className={css.pageHeaderRow}>
        <h1 className={css.pageTitle}>Cuentas</h1>
        <span className={css.pageCount}>{ACCOUNTS.length} cuentas</span>
      </div>

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
