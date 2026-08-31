import React from 'react';

export function Progress({ value = 0, max = 100, label, showValue = false, tone = 'accent', size = 'md', style }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = { accent: 'var(--action-accent)', success: 'var(--status-success)', warning: 'var(--status-warning)', ink: 'var(--surface-inverse)' }[tone] || 'var(--action-accent)';
  const h = size === 'sm' ? 6 : 10;
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', ...style } },
    (label || showValue) && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } },
      React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' } }, label),
      showValue && React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' } }, Math.round(pct) + '%')),
    React.createElement('div', {
      role: 'progressbar', 'aria-valuenow': value, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-label': label,
      style: { height: h, borderRadius: 999, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', overflow: 'hidden' },
    }, React.createElement('div', {
      style: { width: pct + '%', height: '100%', borderRadius: 999, background: color, transition: 'width var(--dur-slow) var(--ease-out)' },
    })));
}
