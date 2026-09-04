import { Link } from '@tanstack/react-router'
import { useRole } from '../../layout/InternalToolsLayout'
import { StatTile } from '@alohasoyrico-eng/flow-react'
import { Card } from '@alohasoyrico-eng/flow-react'
import { CardMedia } from '@alohasoyrico-eng/flow-react'
import { Badge } from '@alohasoyrico-eng/flow-react'
import { AutoGrid } from '@alohasoyrico-eng/flow-react'
import { PageHeader } from '@alohasoyrico-eng/flow-react'
import {
  ROLES, TICKETS, CASES, PRICING_RULES, DOCS, ACCOUNTS,
  TICKETS_PREVIEW, CASES_PREVIEW, PRICING_PREVIEW, BACKOFFICE_PREVIEW,
  PRIORITY_TONE, STATUS_TONE,
} from './data'
import css from './ITResumenPage.module.css'

function QueueCard({ icon, title, to, count, children }: {
  icon: string; title: string; to: string; count: number; children: React.ReactNode
}) {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
      <div className={css.queueHeader}>
        <span className="flow-symbol flow-symbol--fill flow-symbol--default" aria-hidden="true" style={{ color: 'var(--text-accent)' }}>{icon}</span>
        <div className={css.queueTitle}>{title}</div>
        <span className={css.queueCount}>{count}</span>
      </div>
      <div className={css.queueRows}>{children}</div>
      <Link to={to} className={css.queueLink}>
        Ver todo
        <span className="flow-symbol flow-symbol--sm" aria-hidden="true">arrow_forward</span>
      </Link>
    </Card>
  )
}

function Row({ left, right }: { left: string; right: React.ReactNode }) {
  return (
    <div className={css.queueRow}>
      <span className={css.queueRowLeft}>{left}</span>
      {right}
    </div>
  )
}

export function ITResumenPage() {
  const { role } = useRole()
  const can = (roles: string[]) => roles.includes(role)
  const roleLabel = ROLES.find(r => r.value === role)?.label ?? role

  const openTickets = TICKETS.filter(t => t.status !== 'cerrado').length
  const openCases = CASES.filter(c => c.status !== 'resuelta' && c.status !== 'rechazada').length
  const pendingRules = PRICING_RULES.filter(r => r.status === 'pendiente aprobacion').length
  const pendingDocs = DOCS.filter(d => d.status === 'pendiente').length

  return (
    <>
      <PageHeader
        overline="Internal Tools"
        title="Resumen"
        description={`Vista consolidada de soporte, cuentas, pricing y back-office. Viendo como ${roleLabel}.`}
      />

      <AutoGrid minWidth="180px" gap="var(--space-3)" style={{ marginBottom: 'var(--space-7)' }}>
        {can(['admin', 'agente']) && <StatTile label="Tickets abiertos" value={openTickets} delta="+3 hoy" icon="confirmation_number" />}
        {can(['admin', 'agente']) && <StatTile label="Casos abiertos" value={openCases} delta="1 nuevo hoy" icon="gavel" />}
        {can(['admin', 'pricing']) && <StatTile label="Reglas pendientes" value={pendingRules} delta="por aprobar" icon="sell" />}
        {can(['admin', 'ops']) && <StatTile label="Aprobaciones pendientes" value={pendingDocs} delta="documentos" icon="fact_check" />}
      </AutoGrid>

      <div className={css.queueGrid}>
        {can(['admin', 'agente']) && (
          <QueueCard icon="confirmation_number" title="Tickets" to="/internal-tools/tickets" count={openTickets}>
            {TICKETS_PREVIEW.map(t => (
              <Row key={t.id} left={t.subject} right={<Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge>} />
            ))}
          </QueueCard>
        )}
        {can(['admin', 'agente']) && (
          <QueueCard icon="gavel" title="Casos" to="/internal-tools/casos" count={openCases}>
            {CASES_PREVIEW.map(c => (
              <Row key={c.id} left={`${c.type} · ${c.who}`} right={<Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>} />
            ))}
          </QueueCard>
        )}
        {can(['admin', 'pricing']) && (
          <QueueCard icon="sell" title="Pricing" to="/internal-tools/pricing" count={pendingRules}>
            {PRICING_PREVIEW.map(p => (
              <Row key={p.id} left={p.name} right={<Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>} />
            ))}
          </QueueCard>
        )}
        {can(['admin', 'ops']) && (
          <QueueCard icon="fact_check" title="Back-office" to="/internal-tools/backoffice" count={pendingDocs}>
            {BACKOFFICE_PREVIEW.map(d => (
              <Row key={d.id} left={`${d.who} · ${d.doc}`} right={<Badge tone={STATUS_TONE[d.status]}>{d.status}</Badge>} />
            ))}
          </QueueCard>
        )}
        <QueueCard icon="apartment" title="Cuentas" to="/internal-tools/cuentas" count={ACCOUNTS.length}>
          {ACCOUNTS.slice(0, 3).map(a => (
            <Row key={a.id} left={`${a.name} · ${a.type}`} right={<Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>} />
          ))}
        </QueueCard>
      </div>

      <PageHeader overline="Recursos" title="" style={{ marginTop: 'var(--space-8)' }} />
      <div className={css.resourceGrid}>
        <CardMedia
          image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%231a365d' width='400' height='200'/%3E%3Ctext x='200' y='90' text-anchor='middle' fill='%2390cdf4' font-size='32' font-weight='700'%3ESLA%3C/text%3E%3Ctext x='200' y='120' text-anchor='middle' fill='%2390cdf4' font-size='13'%3ETiempos de respuesta%3C/text%3E%3C/svg%3E"
          title="Guía de SLA"
          description="Tiempos de respuesta por prioridad y canal."
          interactive
          onClick={() => {}}
        />
        <CardMedia
          image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23234e52' width='400' height='200'/%3E%3Ctext x='200' y='90' text-anchor='middle' fill='%2381e6d9' font-size='32' font-weight='700'%3EKYB%3C/text%3E%3Ctext x='200' y='120' text-anchor='middle' fill='%2381e6d9' font-size='13'%3EVerificación de empresas%3C/text%3E%3C/svg%3E"
          title="Proceso KYB"
          description="Checklist de verificación para nuevas cuentas."
          interactive
          onClick={() => {}}
        />
        <CardMedia
          image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23553c9a' width='400' height='200'/%3E%3Ctext x='200' y='90' text-anchor='middle' fill='%23d6bcfa' font-size='32' font-weight='700'%3EFAQ%3C/text%3E%3Ctext x='200' y='120' text-anchor='middle' fill='%23d6bcfa' font-size='13'%3EPreguntas frecuentes%3C/text%3E%3C/svg%3E"
          title="FAQ interno"
          description="Respuestas a las preguntas más comunes de soporte."
          interactive
          onClick={() => {}}
        />
      </div>
    </>
  )
}
