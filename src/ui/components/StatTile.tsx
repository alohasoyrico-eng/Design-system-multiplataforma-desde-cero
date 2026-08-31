import type { CSSProperties } from 'react'
import { Sparkline } from '../primitives/Sparkline'
import css from './StatTile.module.css'

export interface StatTileProps {
  label: string
  value: string | number
  delta?: string
  trend?: number[]
  icon?: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
  style?: CSSProperties
}

export function StatTile({ label, value, delta, trend, icon, tone = 'neutral', style }: StatTileProps) {
  const toneColor = tone === 'success' ? 'var(--status-success-text)'
    : tone === 'danger' ? 'var(--status-danger-text)'
    : tone === 'warning' ? 'var(--status-warning-text)'
    : 'var(--text-muted)'

  const deltaUp = delta && (delta.startsWith('+') || delta.startsWith('↑'))
  const deltaDown = delta && (delta.startsWith('-') || delta.startsWith('−') || delta.startsWith('↓'))
  const deltaColor = deltaUp ? 'var(--status-success-text)' : deltaDown ? 'var(--status-danger-text)' : 'var(--text-muted)'
  const deltaIcon = deltaUp ? 'trending_up' : deltaDown ? 'trending_down' : 'trending_flat'

  return (
    <div className={css.root} style={style}>
      <div className={css.header}>
        {icon && (
          <span className={`flow-icon flow-icon--md ${css.toneIcon}`} aria-hidden="true" style={{ color: toneColor }}>
            {icon}
          </span>
        )}
        <span className={css.label}>{label}</span>
      </div>
      <div className={css.body}>
        <div className={css.value}>{value}</div>
        {trend && (
          <Sparkline
            values={trend}
            width={88}
            height={32}
            showDot={false}
            color={deltaDown ? 'var(--status-danger)' : 'var(--action-accent)'}
            aria-hidden="true"
            style={{ marginLeft: 'auto', flexShrink: 0 }}
          />
        )}
      </div>
      {delta && (
        <div className={css.delta} style={{ color: deltaColor }}>
          <span className={`flow-icon flow-icon--xs ${css.deltaIcon}`} aria-hidden="true">{deltaIcon}</span>
          {delta}
        </div>
      )}
    </div>
  )
}
