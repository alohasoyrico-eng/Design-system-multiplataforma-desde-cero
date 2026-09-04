import type { CSSProperties, ReactNode } from 'react'
import css from './TransactionGroup.module.css'

export interface TransactionGroupProps {
  label: string
  children: ReactNode
  style?: CSSProperties
}

export function TransactionGroup({ label, children, style }: TransactionGroupProps) {
  return (
    <div className={css.root} style={style}>
      <span className={css.label}>{label}</span>
      {children}
    </div>
  )
}
