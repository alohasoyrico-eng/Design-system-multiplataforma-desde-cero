import type { CSSProperties } from 'react'
import { ToggleControl } from './ToggleControl'
import css from './Switch.module.css'

export interface SwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  /** Nombre accesible por referencia (SettingsRow y afines lo inyectan). */
  'aria-labelledby'?: string
  style?: CSSProperties
}

export function Switch({ checked, onChange, label, disabled, 'aria-labelledby': ariaLabelledBy, style }: SwitchProps) {
  return (
    <ToggleControl
      checked={checked}
      onChange={onChange}
      label={label}
      disabled={disabled}
      aria-labelledby={ariaLabelledBy}
      style={style}
    >
      <span
        className={css.track}
        data-checked={checked || undefined}
        aria-hidden="true"
      >
        <span className={css.thumb} />
      </span>
    </ToggleControl>
  )
}
