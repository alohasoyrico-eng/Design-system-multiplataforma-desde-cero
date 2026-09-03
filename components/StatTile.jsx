import React from 'react';

/** Compact KPI tile: overline label, mono value, delta with trend icon. */
export function StatTile({ label, value, delta, trend, icon, tone, style }) {
  const deltaColor = trend === 'up' ? 'var(--status-success-text)' : trend === 'down' ? 'var(--status-danger-text)' : 'var(--text-muted)';
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      padding: 18, boxShadow: 'var(--shadow-rest)', fontFamily: 'var(--font-body)', minWidth: 0, ...style,
    },
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      icon && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 18, color: tone || 'var(--text-muted)' } }, icon),
      React.createElement('span', { style: { fontSize: 11, fontWeight: 600, letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase', color: 'var(--text-muted)' } }, label)),
    React.createElement('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, marginTop: 8, letterSpacing: '-0.01em' } }, value),
    delta && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, marginTop: 4, color: deltaColor } },
      trend && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 14 } }, trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat'),
      delta));
}
