import type { CSSProperties } from 'react'
import { Card } from '../ui/components/Card'
import { Sparkline } from '../ui/primitives/Sparkline'
import css from '../App.module.css'

export interface KPICardProps {
  label: string
  value: string
  delta?: string
  tone?: 'up' | 'down'
  spark?: number[]
}

export function KPICard({ label, value, delta, tone, spark }: KPICardProps) {
  const deltaColor = tone === 'up' ? 'var(--status-success-text)' : tone === 'down' ? 'var(--status-danger-text)' : 'var(--text-muted)'
  return (
    <Card padding={20} style={{ flex: 1, minWidth: 0 }}>
      <div className={css.kpiLabel}>{label}</div>
      <div className={css.kpiRow}>
        <div className={css.kpiValue}>{value}</div>
        {spark && <Sparkline values={spark} width={90} height={34} showDot={false} color={tone === 'down' ? 'var(--status-warning)' : 'var(--action-accent)'} style={{ marginLeft: 'auto' }} />}
      </div>
      {delta && (
        <div className={css.kpiDelta} style={{ '--_delta-color': deltaColor } as CSSProperties}>
          <span className={`flow-icon ${css.kpiDeltaIcon}`} aria-hidden="true">{tone === 'up' ? 'trending_up' : 'trending_down'}</span>
          {delta}
        </div>
      )}
    </Card>
  )
}
