import type { CSSProperties } from 'react'
import css from './PaymentCard.module.css'

export interface PaymentCardProps {
  holder: string
  last4: string
  variant?: 'ink' | 'accent' | 'sand'
  frozen?: boolean
  label?: string
  expires?: string
  onClick?: () => void
  style?: CSSProperties
}

export function PaymentCard({
  holder,
  last4,
  variant = 'ink',
  frozen,
  label,
  expires,
  onClick,
  style,
}: PaymentCardProps) {
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
        <span className={css.logo}>
          <span className="flow-icon" aria-hidden="true" style={{ fontSize: 28 }}>credit_card</span>
        </span>
        {label && <span className={css.label}>{label}</span>}
      </div>

      <div className={css.number}>
        <span className={css.dots}>••••</span>
        <span className={css.dots}>••••</span>
        <span className={css.dots}>••••</span>
        <span className={css.last4}>{last4}</span>
      </div>

      <div className={css.bottom}>
        <div className={css.holder}>{holder}</div>
        {expires && <div className={css.expires}>{expires}</div>}
      </div>

      {frozen && (
        <div className={css.frozenOverlay} aria-hidden="true">
          <span className="flow-icon" style={{ fontSize: 32 }}>ac_unit</span>
          <span>Congelada</span>
        </div>
      )}
    </Tag>
  )
}
