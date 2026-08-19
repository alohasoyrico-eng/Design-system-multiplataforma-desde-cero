import { useState } from 'react'
import { Guard } from '../../layout/InternalToolsLayout'
import { StatTile } from '../../ui/components/StatTile'
import { Badge } from '../../ui/primitives/Badge'
import { Avatar } from '../../ui/primitives/Avatar'
import { Button } from '../../ui/primitives/Button'
import { KanbanBoard } from '../../ui/components/KanbanBoard'
import { Timeline } from '../../ui/components/Timeline'
import {
  GROWTH_STAGES, GROWTH_CANDIDATES, CHANNEL_TONE, RISK_TONE,
  type GrowthCandidate,
} from './data'
import css from './internal-tools.module.css'

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
      <div className={css.pageIntro}>
        <h1 className={css.pageTitle}>Growth · Onboarding de flotas</h1>
        <p className={css.pageDesc}>
          Embudo de onboarding B2B: de prospecto a flota activada. Arrastra tarjetas entre columnas o usa Shift+flechas.
        </p>
      </div>

      <div className={css.kpiGrid}>
        <StatTile label="Cuentas en proceso" value={active.length} icon="hourglass_top" />
        <StatTile label="Riesgo alto" value={highRisk} icon="warning" tone={highRisk > 0 ? 'warning' : 'neutral'} />
        <StatTile label="Flotas activadas" value={activated} icon="check_circle" tone="success" />
        <StatTile label="Valor en pipeline" value={`$${(pipelineValue / 1000).toFixed(0)}k/mes`} icon="payments" />
      </div>

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
              <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
              <Badge tone={CHANNEL_TONE[c.channel]}>{c.channel}</Badge>
              {c.risk && <Badge tone={RISK_TONE[c.risk]}>{c.risk}</Badge>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
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
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{c.contact}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge tone={CHANNEL_TONE[c.channel]}>{c.channel}</Badge>
                {c.risk && <Badge tone={RISK_TONE[c.risk]}>riesgo {c.risk}</Badge>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Unidades</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{c.units}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Valor estimado</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{c.value}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Account exec</div>
                  <div style={{ fontSize: 14, marginTop: 2 }}>{c.owner}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Días en etapa</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{c.days}</div>
                </div>
              </div>
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
                  <Button variant="accent" onClick={() => { advanceCandidate(c.id); setDetailKey(null) }}>
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
