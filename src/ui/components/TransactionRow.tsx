import type { CSSProperties } from 'react'
import css from './TransactionRow.module.css'

export type TransactionCategory = 'transfer' | 'fuel' | 'toll' | 'service' | 'payment'

const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  transfer: 'swap_horiz',
  fuel: 'local_gas_station',
  toll: 'toll',
  service: 'build',
  payment: 'payments',
}

export interface TransactionRowProps {
  category?: TransactionCategory
  title: string
  subtitle?: string
  amount?: number
  currency?: string
  pending?: boolean
  onClick?: () => void
  style?: CSSProperties
}

function formatMoney(n: number, currency: string): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '−' : '+'
  const formatted = abs.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${sign}${currency}${formatted}`
}

export function TransactionRow({
  category = 'transfer',
  title,
  subtitle,
  amount = 0,
  currency = '$',
  pending,
  onClick,
  style,
}: TransactionRowProps) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      className={css.root}
      data-pending={pending || undefined}
      data-negative={amount < 0 || undefined}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      style={style}
    >
      <span className={css.icon} data-category={category}>
        <span className="flow-icon" aria-hidden="true">{CATEGORY_ICONS[category]}</span>
      </span>

      <div className={css.body}>
        <span className={css.title}>{title}</span>
        {subtitle && <span className={css.subtitle}>{subtitle}</span>}
        {pending && <span className={css.pendingLabel}>Pendiente</span>}
      </div>

      <span className={css.amount} aria-label={`${amount < 0 ? 'cargo' : 'abono'} ${currency}${Math.abs(amount).toFixed(2)}`}>
        {formatMoney(amount, currency)}
      </span>
    </Tag>
  )
}
