import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import css from './Settings.module.css'

export interface SettingsRowProps {
  label: string
  description?: string
  control: ReactNode
}

export function SettingsRow({ label, description, control }: SettingsRowProps) {
  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.rowLabel}>{label}</div>
        {description && <div className={css.rowDesc}>{description}</div>}
      </div>
      <div className={css.rowControl}>{control}</div>
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
