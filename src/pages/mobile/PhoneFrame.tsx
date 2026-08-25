import type { ReactNode, CSSProperties } from 'react'
import css from './PhoneFrame.module.css'

interface PhoneFrameProps {
  children: ReactNode
  dark?: boolean
  fullBleed?: boolean
  style?: CSSProperties
}

export function PhoneFrame({ children, dark, fullBleed, style }: PhoneFrameProps) {
  return (
    <div className={css.frame} data-mode={dark ? 'dark' : undefined} style={style}>
      {fullBleed ? (
        <div className={css.bleed}>
          {children}
          <div className={css.notchFloat} />
        </div>
      ) : (
        <>
          <div className={css.notchFloat} />
          <div className={css.screen}>{children}</div>
        </>
      )}
    </div>
  )
}
