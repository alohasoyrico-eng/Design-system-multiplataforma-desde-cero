import React from 'react';

/** Compact real-vs-target bar. rows: [{label, value, target, prev?, max?}]. Denser than a gauge for comparing many entities. */
export function BulletChart({ rows = [], format, style }) {
  // Sin filas mostraba solo su leyenda -- Real, Meta, Periodo anterior -- que es
  // una leyenda de nada (blt-v1).
  if (!rows.length) return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 6, minHeight: 100, color: 'var(--text-muted)', font: 'var(--type-caption)',
    },
  },
    React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 22 } }, 'bar_chart'),
    'Sin datos para este periodo');
  const gmax = Math.max(...rows.map(r => r.max || Math.max(r.value, r.target) * 1.2), 1);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'var(--font-body)', ...style } },
    rows.map((r, i) => {
      const over = r.value > r.target;
      const pct = Math.min(100, (r.value / gmax) * 100);
      const tPct = Math.min(100, (r.target / gmax) * 100);
      const prevPct = r.prev != null ? Math.min(100, (r.prev / gmax) * 100) : null;
      return React.createElement('div', { key: i, style: { display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 12, alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, r.label),
        React.createElement('div', { style: { position: 'relative', height: 18, background: 'var(--surface-sunken)', borderRadius: 6 } },
          prevPct != null && React.createElement('span', { 'aria-hidden': true, style: { position: 'absolute', left: 0, top: '35%', bottom: '35%', width: prevPct + '%', background: 'var(--border-strong)', opacity: 0.4, borderRadius: 4 } }),
          React.createElement('span', {
            'aria-hidden': true,
            style: { position: 'absolute', left: 0, top: 3, bottom: 3, width: pct + '%', borderRadius: 5, background: over ? 'var(--status-danger)' : 'var(--flow-red-500)', transition: 'width var(--dur-slow) var(--ease-out)' },
          }),
          React.createElement('span', { 'aria-hidden': true, style: { position: 'absolute', left: tPct + '%', top: -2, bottom: -2, width: 2.5, background: 'var(--flow-ink-900)' } })),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: over ? 'var(--status-danger-text)' : 'var(--text-primary)', minWidth: 60, textAlign: 'right' } },
          format ? format(r.value) : r.value));
    }),
    React.createElement('div', { style: { display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)', marginTop: 2 } },
      React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 5 } }, React.createElement('span', { 'aria-hidden': true, style: { width: 10, height: 10, borderRadius: 3, background: 'var(--flow-red-500)' } }), 'Real'),
      React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 5 } }, React.createElement('span', { 'aria-hidden': true, style: { width: 2.5, height: 12, background: 'var(--flow-ink-900)' } }), 'Meta'),
      React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 5 } }, React.createElement('span', { 'aria-hidden': true, style: { width: 10, height: 6, borderRadius: 3, background: 'var(--border-strong)', opacity: 0.5 } }), 'Periodo anterior')));
}
