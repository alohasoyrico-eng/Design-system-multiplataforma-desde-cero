import type { CSSProperties, ReactNode } from 'react'
import css from './ChipGroup.module.css'

export interface ChipGroupProps {
  children: ReactNode
  style?: CSSProperties
}

export function ChipGroup({ children, style }: ChipGroupProps) {
  return (
    <div className={css.root} style={style}>
      {children}
    </div>
  )
}
