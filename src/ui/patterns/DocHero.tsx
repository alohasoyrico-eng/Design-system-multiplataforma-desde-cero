import type { CSSProperties } from 'react'
import { StatusPill } from '../primitives/StatusPill'
import { Badge } from '../primitives/Badge'
import css from './DocHero.module.css'

export interface DocHeroPlatform {
  label: string
  tone: 'success' | 'warning' | 'danger' | 'info'
}

export interface DocHeroProps {
  name: string
  summary: string
  platforms?: DocHeroPlatform[]
  a11yLevel?: string
  style?: CSSProperties
}

export function DocHero({ name, summary, platforms = [], a11yLevel, style }: DocHeroProps) {
  return (
    <section className={css.root} style={style}>
      <div className={css.main}>
        <h1 className={css.headline}>{name}</h1>
        <p className={css.desc}>{summary}</p>
      </div>
      <div className={css.meta}>
        <div className={css.pills}>
          {platforms.map(p => (
            <StatusPill key={p.label} label={p.label} tone={p.tone} />
          ))}
          {a11yLevel && <Badge tone="info">{a11yLevel}</Badge>}
        </div>
      </div>
    </section>
  )
}
