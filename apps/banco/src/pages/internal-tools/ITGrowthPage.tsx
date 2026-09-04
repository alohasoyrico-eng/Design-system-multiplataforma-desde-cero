import { useState } from 'react'
import { Guard } from '../../layout/InternalToolsLayout'
import { StatTile } from '@alohasoyrico-eng/flow-react'
import { Badge } from '@alohasoyrico-eng/flow-react'
import { Avatar } from '@alohasoyrico-eng/flow-react'
import { Button } from '@alohasoyrico-eng/flow-react'
import { AutoGrid } from '@alohasoyrico-eng/flow-react'
import { DetailRow } from '@alohasoyrico-eng/flow-react'
import { KanbanBoard } from '@alohasoyrico-eng/flow-react'
import { Timeline } from '@alohasoyrico-eng/flow-react'
import { PageHeader } from '@alohasoyrico-eng/flow-react'
import css from './ITGrowthPage.module.css'
import {
  GROWTH_STAGES, GROWTH_CANDIDATES, CHANNEL_TONE, RISK_TONE,
  type GrowthCandidate,
} from './data'

const KANBAN_COLS = GROWTH_STAGES.map(s => ({
  id: s.id,
  label: s.label,
  color: s.id === 'activada' ? 'var(--status-success)' : undefined,
}))

const ABANDON_COL = { id: 'abandonado', label: 'Abandonado' }

export function ITGrowthPage() {
  const [candidates, setCandidates] = useState(GROWTH_CANDIDATES)
  const [detailKey, setDetailKey] = useState<string | null>(null)

  const active = candidates.filter(c => c.stage !== 'activada' && c.stage !== 'abandonado')
  const highRisk = active.filter(c => c.risk === 'alto').length
  const activated = candidates.filter(c => c.stage === 'activada').length
  const pipelineValue = active.reduce((sum, c) => sum + parseInt(c.value.replace(/[^0-9]/g, ''), 10), 0)

  const moveCandidate = (id: string, toStage: string) => {
    setCandidates(cs => cs.map(c => {
      if (c.id !== id) return c
      return { ...c, stage: toStage, days: 0, risk: toStage === 'activada' ? null : c.risk }
    }))
    return true
  }

  const advanceCandidate = (id: string) => {
    setCandidates(cs => cs.map(c => {
      if (c.id !== id) return c
      const idx = GROWTH_STAGES.findIndex(s => s.id === c.stage)
      if (idx < 0 || idx >= GROWTH_STAGES.length - 1) return c
      return { ...c, stage: GROWTH_STAGES[idx + 1].id, days: 0, risk: GROWTH_STAGES[idx + 1].id === 'activada' ? null : c.risk }
    }))
  }

  return (
    <Guard allowed={['admin', 'growth']}>
      <PageHeader
        title="Growth · Onboarding de flotas"
        description="Embudo de onboarding B2B: de prospecto a flota activada. Arrastra tarjetas entre columnas o usa Shift+flechas."
      />

      <AutoGrid minWidth="180px" gap="var(--space-3)" style={{ marginBottom: 'var(--space-7)' }}>
        <StatTile label="Cuentas en proceso" value={active.length} icon="hourglass_top" />
        <StatTile label="Riesgo alto" value={highRisk} icon="warning" tone={highRisk > 0 ? 'warning' : 'neutral'} />
        <StatTile label="Flotas activadas" value={activated} icon="check_circle" tone="success" />
        <StatTile label="Valor en pipeline" value={`$${(pipelineValue / 1000).toFixed(0)}k/mes`} icon="payments" />
      </AutoGrid>

      <KanbanBoard<GrowthCandidate>
        columns={KANBAN_COLS}
        items={candidates}
        columnKey="stage"
        itemKey="id"
        abandonColumn={ABANDON_COL}
        onMove={moveCandidate}
        onAdvance={advanceCandidate}
        detailKey={detailKey}
        onDetailChange={setDetailKey}
        renderCard={(c, { dragging }) => (
          <div style={{ opacity: dragging ? 0.5 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={c.name} size="sm" />
              <span className={css.cardName}>{c.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
              <Badge tone={CHANNEL_TONE[c.channel]}>{c.channel}</Badge>
              {c.risk && <Badge tone={RISK_TONE[c.risk]}>{c.risk}</Badge>}
            </div>
            <div className={css.cardMeta}>
              {c.units} unidades · {c.value}
            </div>
          </div>
        )}
        renderDetail={(c) => {
          const stageIdx = GROWTH_STAGES.findIndex(s => s.id === c.stage)
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={c.name} size="lg" />
                <div style={{ flex: 1 }}>
                  <div className={css.detailName}>{c.name}</div>
                  <div className={css.detailContact}>{c.contact}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge tone={CHANNEL_TONE[c.channel]}>{c.channel}</Badge>
                {c.risk && <Badge tone={RISK_TONE[c.risk]}>riesgo {c.risk}</Badge>}
              </div>
              <AutoGrid minWidth="120px" gap="var(--space-3)">
                <DetailRow label="Unidades" value={c.units} mono />
                <DetailRow label="Valor estimado" value={c.value} mono />
                <DetailRow label="Account exec" value={c.owner} />
                <DetailRow label="Días en etapa" value={c.days} mono />
              </AutoGrid>
              <Timeline
                items={GROWTH_STAGES.map((s, i) => ({
                  title: s.label,
                  status: i < stageIdx ? 'done' as const : i === stageIdx ? 'active' as const : 'pending' as const,
                }))}
                mode="steps"
              />
              {c.stage !== 'activada' && c.stage !== 'abandonado' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button variant="secondary" onClick={() => { moveCandidate(c.id, 'abandonado'); setDetailKey(null) }}>
                    Marcar abandonado
                  </Button>
                  <Button variant="primary" onClick={() => { advanceCandidate(c.id); setDetailKey(null) }}>
                    Mover a siguiente etapa
                  </Button>
                </div>
              )}
            </div>
          )
        }}
        style={{ marginTop: 8 }}
      />
    </Guard>
  )
}
