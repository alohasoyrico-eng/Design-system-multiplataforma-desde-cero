import type { CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import css from './BalanceDisplay.module.css'
import { IconButton } from '../primitives/IconButton'

export interface BalanceDisplayProps {
  label?: string
  value: string
  hidden?: boolean
  onToggleHidden?: () => void
  style?: CSSProperties
}

export function BalanceDisplay({ label, value, hidden, onToggleHidden, style }: BalanceDisplayProps) {
  const intl = useIntl()
  const resolvedLabel = label ?? intl.formatMessage({ id: 'balance.label', defaultMessage: 'Balance total' })

  return (
    <div className={css.root} style={style}>
      <span className={css.label}>{resolvedLabel}</span>
      <div className={css.row}>
        <span className={css.value}>{hidden ? '••••••' : value}</span>
        {onToggleHidden && (
          <IconButton
            icon={hidden ? 'visibility' : 'visibility_off'}
            ariaLabel={hidden ? intl.formatMessage({ id: 'balance.show', defaultMessage: 'Mostrar saldo' }) : intl.formatMessage({ id: 'balance.hide', defaultMessage: 'Ocultar saldo' })}
            variant="ghost"
            size="sm"
            onClick={onToggleHidden}
          />
        )}
      </div>
    </div>
  )
}
