import type { CSSProperties } from 'react'
import css from './SectionRule.module.css'

export interface SectionRuleProps {
  label: string
  meta?: string
  style?: CSSProperties
}

export function SectionRule({ label, meta, style }: SectionRuleProps) {
  return (
    <div className={css.root} style={style}>
      <span className={css.label}>{label}</span>
      <span className={css.line} />
      {meta && <span className={css.meta}>{meta}</span>}
    </div>
  )
}
