import type { CSSProperties, MouseEventHandler } from 'react'
import css from './IconButton.module.css'

export type IconButtonVariant = 'ghost' | 'secondary'

export interface IconButtonProps {
  icon: string
  ariaLabel: string
  variant?: IconButtonVariant
  size?: 'md'
  badge?: number | boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  style?: CSSProperties
}

export function IconButton({
  icon,
  ariaLabel,
  variant = 'ghost',
  badge,
  disabled,
  onClick,
  style,
  ...rest
}: IconButtonProps) {
  return (
    <button
      className={css.root}
      data-variant={variant}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...rest}
    >
      <span className={`flow-icon ${css.icon}`}>{icon}</span>
      {badge != null && <span className={css.badge} />}
    </button>
  )
}
