import React from 'react';

/** Grid of mini sparklines, one per entity, sharing the same Y scale so shapes are comparable at a glance. Outliers get accent color. */
export function SmallMultiples({ items = [], height = 46, columns = 4, isOutlier, format, onSelect, selectedId, style }) {
  // Sin datos, Math.min de un array vacio da Infinity y la rejilla salia muda:
  // ni dibujo ni texto, indistinguible de un fallo de carga (smm-v1).
  if (!items.length) return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 6, minHeight: 120, color: 'var(--text-muted)', font: 'var(--type-caption)',
    },
  },
    React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 22 } }, 'bar_chart'),
    'Sin datos para este periodo');
  const all = items.flatMap(it => it.values);
  const min = Math.min(...all), max = Math.max(...all);
  const span = max - min || 1;

  const spark = (values, color) => {
    const w = 140;
    const px = (i) => 3 + (i / (values.length - 1)) * (w - 6);
    const py = (v) => height - 4 - ((v - min) / span) * (height - 8);
    const pts = values.map((v, i) => px(i) + ',' + py(v)).join(' ');
    return React.createElement('svg', { width: '100%', height, viewBox: '0 0 ' + w + ' ' + height, 'aria-hidden': true, style: { display: 'block' } },
      React.createElement('polyline', { points: pts, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }));
  };

  return React.createElement('div', {
    style: { display: 'grid', gridTemplateColumns: 'repeat(' + columns + ', 1fr)', gap: 10, fontFamily: 'var(--font-body)', ...style },
  }, items.map(it => {
    const out = isOutlier ? isOutlier(it) : false;
    const sel = it.id === selectedId;
    const last = it.values[it.values.length - 1];
    return React.createElement('button', {
      key: it.id, type: 'button', onClick: onSelect ? () => onSelect(it) : undefined,
      style: {
        textAlign: 'left', border: sel ? '1.5px solid var(--border-focus)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', padding: '10px 12px 8px', cursor: onSelect ? 'pointer' : 'default',
        boxShadow: sel ? 'var(--focus-ring)' : 'none', transition: 'border-color var(--dur-fast) var(--ease-out)',
      },
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 } },
        React.createElement('span', { style: { fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, it.label),
        out && React.createElement('span', { className: 'flow-symbol', 'aria-hidden': true, style: { fontSize: 14, color: 'var(--status-danger-text)', marginLeft: 'auto' } }, 'priority_high'),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600, color: out ? 'var(--status-danger-text)' : 'var(--text-secondary)', marginLeft: out ? 4 : 'auto' } }, format ? format(last) : last)),
      spark(it.values, out ? 'var(--flow-red-500)' : 'var(--flow-ink-500)'));
  }));
}
