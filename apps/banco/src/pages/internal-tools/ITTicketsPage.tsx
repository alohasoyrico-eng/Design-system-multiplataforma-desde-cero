import { useState } from 'react'
import { Guard, useITToast } from '../../layout/InternalToolsLayout'
import { Table } from '@alohasoyrico-eng/flow-react'
import { Badge } from '@alohasoyrico-eng/flow-react'
import { Avatar } from '@alohasoyrico-eng/flow-react'
import { Button } from '@alohasoyrico-eng/flow-react'
import { IconButton } from '@alohasoyrico-eng/flow-react'
import { Input } from '@alohasoyrico-eng/flow-react'
import { Drawer } from '@alohasoyrico-eng/flow-react'
import { ChatMessage } from '@alohasoyrico-eng/flow-react'
import { PageHeader } from '@alohasoyrico-eng/flow-react'
import { TICKETS, PRIORITY_TONE, STATUS_TONE, type Ticket } from './data'

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
          <Button variant="primary" onClick={() => onStatusChange(ticket.id, 'cerrado')}>Cerrar ticket</Button>
        </>
      ) : undefined}
    >
      {ticket && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-stack)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Avatar name={ticket.who} size="sm" />
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--type-body-md)', fontWeight: 700 }}>{ticket.who}</div>
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Canal: {ticket.channel} · Asignado a {ticket.assignee}</div>
            </div>
            <Badge tone={PRIORITY_TONE[ticket.priority]}>{ticket.priority}</Badge>
            <Badge tone={STATUS_TONE[ticket.status]}>{ticket.status}</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1, minHeight: 200, overflowY: 'auto', padding: 'var(--space-2) 0' }}>
            {ticket.thread.map((msg, i) => (
              <ChatMessage key={i} role={msg.role as 'user' | 'agent'} text={msg.text} timestamp={msg.timestamp} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
            <Input
              value={reply}
              onChange={setReply}
              placeholder="Escribe una respuesta…"
              style={{ flex: 1 }}
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
      <PageHeader title="Tickets" trailing={<span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{openCount} abiertos de {tickets.length}</span>} />

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
