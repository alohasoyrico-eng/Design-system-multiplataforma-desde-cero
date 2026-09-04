import type { CSSProperties, ReactNode } from 'react'
import css from './NavBar.module.css'
import { IconButton } from '../primitives/IconButton'

export interface NavBarProps {
  title: string
  onBack?: () => void
  trailing?: ReactNode
  style?: CSSProperties
}

export function NavBar({ title, onBack, trailing, style }: NavBarProps) {
  return (
    <div className={css.root} style={style}>
      <IconButton icon="arrow_back" ariaLabel="Volver" variant="tonal" size="sm" onClick={onBack} />
      <span className={css.title}>{title}</span>
      {trailing}
    </div>
  )
}
