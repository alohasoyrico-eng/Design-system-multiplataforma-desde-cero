import React from 'react';

const CATS = {
  fuel: ['local_gas_station', 'var(--status-warning-text)', 'var(--status-warning-bg)'],
  charge: ['bolt', 'var(--status-success-text)', 'var(--status-success-bg)'],
  toll: ['toll', 'var(--status-info-text)', 'var(--status-info-bg)'],
  food: ['restaurant', 'var(--text-accent)', 'var(--surface-accent-subtle)'],
  transfer: ['sync_alt', 'var(--text-secondary)', 'var(--surface-sunken)'],
  income: ['south_west', 'var(--status-success-text)', 'var(--status-success-bg)'],
};

/** Movement/transaction list row: category icon, merchant, meta, signed mono amount. */
export function TransactionRow({ category = 'transfer', title, subtitle, amount = 0, currency = '$', pending = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const [ic, fg, bg] = CATS[category] || CATS.transfer;
  const negative = amount < 0;
  const amt = currency + Math.abs(amount).toLocaleString('es-MX', { minimumFractionDigits: 2 });
  return React.createElement(onClick ? 'button' : 'div', {
    type: onClick ? 'button' : undefined, onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 60, padding: '8px 4px',
      border: 'none', background: hover && onClick ? 'var(--surface-sunken)' : 'transparent',
      borderRadius: 'var(--radius-md)', cursor: onClick ? 'pointer' : 'default', textAlign: 'left',
      fontFamily: 'var(--font-body)', color: 'var(--text-primary)', boxSizing: 'border-box',
      transition: 'background var(--dur-instant) var(--ease-out)', ...style,
    },
  },
    React.createElement('span', {
      'aria-hidden': true,
      style: { width: 42, height: 42, borderRadius: 14, background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' },
    }, React.createElement('span', { className: 'flow-symbol', style: { fontSize: 21, color: fg } }, ic)),
    React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 } },
      React.createElement('span', { style: { fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, title),
      subtitle && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, subtitle)),
    React.createElement('span', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, flex: 'none' } },
      React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', color: negative ? 'var(--text-primary)' : 'var(--status-success-text)' } }, (negative ? '\u2212' : '+') + amt),
      pending && React.createElement('span', { style: { fontSize: 11, color: 'var(--text-muted)' } }, 'Pendiente')));
}
