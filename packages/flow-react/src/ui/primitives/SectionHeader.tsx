import type { CSSProperties, ReactNode } from 'react'
import css from './SectionHeader.module.css'

export interface SectionHeaderProps {
  children: ReactNode
  trailing?: ReactNode
  size?: 'sm' | 'md' | 'display'
  /** Nivel del heading real que emite el titulo. El viejo emitia h2; el span
      que lo sustituyo rompia el outline del documento (×86 usos en eOne). */
  level?: 2 | 3 | 4
  /** Bajada del título en muted, fuera del heading (sh-3): el outline
      dice el título limpio. */
  description?: string
  style?: CSSProperties
}

export function SectionHeader({ children, trailing, size = 'md', level = 2, description, style }: SectionHeaderProps) {
  const Heading = `h${level}` as const
  return (
    <div className={css.root} data-size={size} style={style}>
      <div className={css.row}>
        <Heading className={css.title}>{children}</Heading>
        {trailing && <span className={css.trailing}>{trailing}</span>}
      </div>
      {description && <p className={css.description}>{description}</p>}
    </div>
  )
}
