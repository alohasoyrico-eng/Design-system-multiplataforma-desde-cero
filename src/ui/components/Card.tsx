import type { ReactNode, CSSProperties, MouseEventHandler } from 'react'
import css from './Card.module.css'

export interface CardProps {
  padding?: string | number
  interactive?: boolean
  children: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
  style?: CSSProperties
}

export function Card({ padding, interactive, children, onClick, style }: CardProps) {
  return (
    <div
      className={css.root}
      data-interactive={interactive || undefined}
      onClick={onClick}
      style={{
        ...(padding != null ? { padding } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
