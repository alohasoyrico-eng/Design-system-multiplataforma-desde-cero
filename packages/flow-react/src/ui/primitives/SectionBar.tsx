import type { CSSProperties, ReactNode } from 'react'
import css from './SectionBar.module.css'

export interface SectionBarProps {
  children: ReactNode
  trailing?: ReactNode
  sticky?: boolean
  /** Centra el contenido a --content-max (para barras full-bleed de página). */
  contained?: boolean
  style?: CSSProperties
}

export function SectionBar({ children, trailing, sticky = true, contained = false, style }: SectionBarProps) {
  const content = (
    <>
      {children}
      <span className={css.spacer} />
      {trailing && <div className={css.trailing}>{trailing}</div>}
    </>
  )
  return (
    <div
      className={css.root}
      data-sticky={sticky || undefined}
      data-contained={contained || undefined}
      style={style}
    >
      {contained ? <div className={css.inner}>{content}</div> : content}
    </div>
  )
}
