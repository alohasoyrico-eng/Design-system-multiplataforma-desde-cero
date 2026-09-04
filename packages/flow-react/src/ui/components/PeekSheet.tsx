import type { CSSProperties, ReactNode } from 'react'
import css from './PeekSheet.module.css'

export interface PeekSheetProps {
  title: string
  children: ReactNode
  style?: CSSProperties
}

export function PeekSheet({ title, children, style }: PeekSheetProps) {
  return (
    <div className={css.root} style={style}>
      <span className={css.handle} />
      <span className={css.title}>{title}</span>
      <div className={css.list}>
        {children}
      </div>
    </div>
  )
}
