import type { CSSProperties, ReactNode } from 'react'
import css from './SheetBody.module.css'

export interface SheetBodyProps {
  children: ReactNode
  center?: boolean
  style?: CSSProperties
}

export function SheetBody({ children, center, style }: SheetBodyProps) {
  return (
    <div className={css.root} data-center={center || undefined} style={style}>
      {children}
    </div>
  )
}
