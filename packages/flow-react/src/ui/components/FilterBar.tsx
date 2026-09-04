import type { CSSProperties, ReactNode } from 'react'
import css from './FilterBar.module.css'

export interface FilterBarProps {
  children: ReactNode
  style?: CSSProperties
}

export function FilterBar({ children, style }: FilterBarProps) {
  return (
    <div className={css.root} style={style}>
      {children}
    </div>
  )
}
