import { useState } from 'react'
import { Guard, useITToast } from '../../layout/InternalToolsLayout'
import { Table } from '../../ui/components/Table'
import { Badge } from '../../ui/primitives/Badge'
import { Avatar } from '../../ui/primitives/Avatar'
import { Button } from '../../ui/primitives/Button'
import { IconButton } from '../../ui/primitives/IconButton'
import { Drawer } from '../../ui/components/Drawer'
import { TICKETS, PRIORITY_TONE, STATUS_TONE, type Ticket } from './data'
import css from './internal-tools.module.css'

function TicketDetail({ ticket, onClose, onStatusChange }: {
  ticket: Ticket | null
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}) {
  const [reply, setReply] = useState('')

  return (
    <Drawer
      open={!!ticket}
      onClose={onClose}
      title={ticket ? `${ticket.id} · ${ticket.subject}` : ''}
      width={520}
      footer={ticket ? (
        <>
          <Button variant="secondary" onClick={() => onStatusChange(ticket.id, 'esperando cliente')}>Esperar cliente</Button>
          <Button variant="accent" onClick={() => onStatusChange(ticket.id, 'cerrado')}>Cerrar ticket</Button>
        </>
      ) : undefined}
    >
      {ticket && (
        <div className={css.drawerContent}>
          <div className={css.drawerHeaderRow}>
            <Avatar name={ticket.who} size="sm" />
            <div style={{ flex: 1 }}>
              <div className={css.drawerName}>{ticket.who}</div>
              <div className={css.drawerMeta}>Canal: {ticket.channel} · Asignado a {ticket.assignee}</div>
            </div>
            <Badge tone={PRIORITY_TONE[ticket.priority]}>{ticket.priority}</Badge>
            <Badge tone={STATUS_TONE[ticket.status]}>{ticket.status}</Badge>
          </div>

          <div className={css.threadList}>
            {ticket.thread.map((msg, i) => (
              <div key={i} className={css.threadMsg} data-role={msg.role}>
                <div className={css.threadBubble}>
                  <div className={css.threadText}>{msg.text}</div>
                  <div className={css.threadTime}>{msg.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={css.replyRow}>
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Escribe una respuesta…"
              className={css.replyInput}
            />
            <IconButton icon="send" ariaLabel="Enviar" onClick={() => setReply('')} />
          </div>
        </div>
      )}
    </Drawer>
  )
}

export function ITTicketsPage() {
  const [tickets, setTickets] = useState(TICKETS)
  const [selected, setSelected] = useState<Ticket | null>(null)
  const notify = useITToast()

  const onStatusChange = (id: string, status: string) => {
    setTickets(ts => ts.map(t => t.id === id ? { ...t, status } : t))
    setSelected(null)
    notify(status === 'cerrado' ? `Ticket ${id} cerrado.` : `Ticket ${id} marcado como esperando cliente.`)
  }

  const openCount = tickets.filter(t => t.status !== 'cerrado').length

  return (
    <Guard allowed={['admin', 'agente']}>
      <div className={css.pageHeaderRow}>
        <h1 className={css.pageTitle}>Tickets</h1>
        <span className={css.pageCount}>{openCount} abiertos de {tickets.length}</span>
      </div>

      <Table
        rowKey="id"
        onRowClick={(row) => setSelected(row as Ticket)}
        columns={[
          { key: 'id', label: 'ID', mono: true },
          { key: 'subject', label: 'Asunto', render: (r) => <span style={{ fontWeight: 600 }}>{(r as Ticket).subject}</span> },
          { key: 'who', label: 'Cliente' },
          { key: 'channel', label: 'Canal' },
          { key: 'priority', label: 'Prioridad', render: (r) => <Badge tone={PRIORITY_TONE[(r as Ticket).priority]}>{(r as Ticket).priority}</Badge> },
          { key: 'status', label: 'Estado', render: (r) => <Badge tone={STATUS_TONE[(r as Ticket).status]}>{(r as Ticket).status}</Badge> },
          { key: 'assignee', label: 'Asignado' },
          { key: 'updated', label: 'Actualizado', align: 'right' as const },
        ]}
        rows={tickets}
      />

      <TicketDetail ticket={selected} onClose={() => setSelected(null)} onStatusChange={onStatusChange} />
    </Guard>
  )
}
