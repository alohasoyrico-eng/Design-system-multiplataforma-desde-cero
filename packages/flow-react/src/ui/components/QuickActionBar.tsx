import type { CSSProperties, ReactNode } from 'react'
import css from './QuickActionBar.module.css'

export interface QuickActionBarProps {
  children: ReactNode
  style?: CSSProperties
}

export function QuickActionBar({ children, style }: QuickActionBarProps) {
  return (
    <div className={css.root} style={style}>
      {children}
    </div>
  )
}
