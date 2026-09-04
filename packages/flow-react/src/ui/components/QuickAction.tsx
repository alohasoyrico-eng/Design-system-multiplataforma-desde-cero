import type { CSSProperties } from 'react'
import css from './QuickAction.module.css'

export interface QuickActionProps {
  icon: string
  label: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  style?: CSSProperties
}

export function QuickAction({
  icon,
  label,
  active,
  disabled,
  onClick,
  style,
}: QuickActionProps) {
  return (
    <button
      className={css.root}
      data-active={active || undefined}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      <span className={css.circle}>
        <span
          className={`flow-symbol${active ? ' flow-symbol--fill' : ''} ${css.icon}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      </span>
      <span className={css.label}>{label}</span>
    </button>
  )
}
