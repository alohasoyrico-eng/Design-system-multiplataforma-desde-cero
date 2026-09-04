import { isValidElement, cloneElement, useId, type ReactNode } from 'react'
import { useIntl } from 'react-intl'
import css from './Settings.module.css'

export interface SettingsRowProps {
  label: string
  description?: string
  control: ReactNode
}

export function SettingsRow({ label, description, control }: SettingsRowProps) {
  // set-p5 / st-4: la etiqueta queda asociada al control por referencia —
  // en una pantalla de cincuenta filas, una etiqueta huerfana es invisible.
  const labelId = useId()
  const asociado = isValidElement(control)
    ? cloneElement(control as React.ReactElement<Record<string, unknown>>, {
        'aria-labelledby': (control.props as Record<string, unknown>)['aria-labelledby'] ?? labelId,
      })
    : control
  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div id={labelId} className={css.rowLabel}>{label}</div>
        {description && <div className={css.rowDesc}>{description}</div>}
      </div>
      <div className={css.rowControl}>{asociado}</div>
    </div>
  )
}

export interface SettingsSectionProps {
  title: string
  children: ReactNode
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className={css.section}>
      <div className={css.sectionTitle}>{title}</div>
      {children}
    </div>
  )
}

export interface SettingsDangerZoneProps {
  title?: string
  children: ReactNode
}

export function SettingsDangerZone({ title, children }: SettingsDangerZoneProps) {
  const intl = useIntl()
  const resolvedTitle = title ?? intl.formatMessage({ id: 'settings.dangerZone', defaultMessage: 'Zona peligrosa' })
  return (
    <div className={css.danger}>
      <div className={css.dangerTitle}>{resolvedTitle}</div>
      {children}
    </div>
  )
}

export interface SettingsDangerRowProps {
  description: string
  action: ReactNode
}

export function SettingsDangerRow({ description, action }: SettingsDangerRowProps) {
  return (
    <div className={css.dangerRow}>
      <div className={css.dangerDesc}>{description}</div>
      {action}
    </div>
  )
}

export interface SettingsProps {
  children: ReactNode
}

export function Settings({ children }: SettingsProps) {
  return <div className={css.root}>{children}</div>
}
