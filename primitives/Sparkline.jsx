import React from 'react';

/**
 * Sparkline se queda en SVG a mano a proposito: 60-90px inline dentro de un KPI
 * no justifica montar ECharts, y hay decenas por pantalla.
 */
export function Sparkline({ values = [], width = 88, height = 28, color, showDot = true, style }) {
  if (!values.length) return React.createElement('span', { style: { width, height, display: 'inline-block', ...style } });
  const min = Math.min.apply(null, values), max = Math.max.apply(null, values);
  const span = (max - min) || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1 || 1)) * (width - 4) + 2,
    height - 3 - ((v - min) / span) * (height - 6),
  ]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  const stroke = color || 'var(--action-accent)';
  return React.createElement('svg', {
    width, height, viewBox: '0 0 ' + width + ' ' + height, 'aria-hidden': true,
    style: { display: 'block', overflow: 'visible', ...style },
  },
    React.createElement('path', { d, fill: 'none', stroke, strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }),
    showDot && React.createElement('circle', { cx: last[0], cy: last[1], r: 2.75, fill: stroke })
  );
}
