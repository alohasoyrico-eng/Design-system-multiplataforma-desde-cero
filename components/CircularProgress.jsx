import React from 'react';

/** Circular determinate progress/gauge. Compact alternative to Progress for dashboard tiles and connection states. */
export function CircularProgress({ value = 0, max = 100, size = 56, strokeWidth = 5, label, showValue = false, tone = 'accent', style }) {
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const color = { accent: 'var(--action-accent)', success: 'var(--status-success)', warning: 'var(--status-warning)', ink: 'var(--flow-ink-900)' }[tone] || 'var(--action-accent)';
  return React.createElement('div', {
    style: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', ...style },
  },
    React.createElement('span', { style: { position: 'relative', width: size, height: size, display: 'inline-flex' } },
      React.createElement('svg', { width: size, height: size, style: { transform: 'rotate(-90deg)' } },
        React.createElement('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: 'var(--border-subtle)', strokeWidth }),
        React.createElement('circle', {
          cx: size / 2, cy: size / 2, r, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round',
          strokeDasharray: c, strokeDashoffset: c * (1 - pct),
          style: { transition: 'stroke-dashoffset var(--dur-base) var(--ease-out)' },
        })),
      showValue && React.createElement('span', {
        style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: size * 0.24, color: 'var(--text-primary)' },
      }, Math.round(pct * 100) + '%')),
    label && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 } }, label));
}
