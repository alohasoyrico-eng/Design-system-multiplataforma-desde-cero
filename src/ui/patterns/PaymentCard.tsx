import type { CSSProperties } from 'react'
import { useIntl } from 'react-intl'
import css from './PaymentCard.module.css'

export interface PaymentCardProps {
  holder: string
  last4: string
  variant?: 'ink' | 'accent' | 'sand' | 'fuel' | 'ev' | 'maintenance' | 'toll'
  frozen?: boolean
  label?: string
  icon?: string
  expires?: string
  balance?: string
  hidden?: boolean
  onToggleHidden?: () => void
  onClick?: () => void
  style?: CSSProperties
}

function mask(text: string) {
  return text.replace(/\S/g, '•')
}

export function PaymentCard({
  holder,
  last4,
  variant = 'ink',
  frozen,
  label,
  icon,
  expires,
  balance,
  hidden,
  onToggleHidden,
  onClick,
  style,
}: PaymentCardProps) {
  const intl = useIntl()
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      className={css.root}
      data-variant={variant}
      data-frozen={frozen || undefined}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      style={style}
      aria-label={`Tarjeta ${holder} terminación ${last4}${frozen ? ', congelada' : ''}`}
    >
      <div className={css.top}>
        <span className={css.balance}>{balance ? (hidden ? '••••••' : balance) : ''}</span>
        {onToggleHidden && (
          <button
            type="button"
            className={css.toggleBtn}
            onClick={(e) => { e.stopPropagation(); onToggleHidden() }}
            aria-label={hidden ? intl.formatMessage({ id: 'balance.show', defaultMessage: 'Mostrar saldo' }) : intl.formatMessage({ id: 'balance.hide', defaultMessage: 'Ocultar saldo' })}
          >
            <span className="flow-icon flow-icon--sm" aria-hidden="true">
              {hidden ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        )}
      </div>

      <div className={css.productRow}>
        <span className={css.chip}>
          <span className="flow-icon flow-icon--sm" aria-hidden="true">{icon ?? 'sim_card'}</span>
        </span>
        {label && <span className={css.label}>{label}</span>}
      </div>

      <div className={css.number}>
        <span className={css.dots}>••••</span>
        <span className={css.dots}>••••</span>
        <span className={css.dots}>••••</span>
        <span className={css.last4}>{hidden ? '••••' : last4}</span>
      </div>

      <div className={css.bottom}>
        <div className={css.holder}>{hidden ? mask(holder) : holder}</div>
        {expires && <div className={css.expires}>{hidden ? '••/••' : expires}</div>}
      </div>

      {frozen && (
        <div className={css.frozenOverlay} aria-hidden="true">
          <span className={`flow-icon ${css.frozenIcon}`}>ac_unit</span>
          <span>Congelada</span>
        </div>
      )}
    </Tag>
  )
}
