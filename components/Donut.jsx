import React from 'react';
import { FlowChart } from '../primitives/FlowChart.jsx';

/** Donut con etiqueta central y leyenda con porcentajes. Delega en FlowChart. */
export function Donut({ segments = [], size = 160, thickness, centerLabel, centerValue, legend = true, style }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;

  // Mismo criterio que FlowChart (tinta+accent con pocas categorias) resuelto aqui,
  // para que el swatch de la leyenda y la rebanada nunca discrepen.
  const pick = segments.length <= 3
    ? ['var(--text-primary)', 'var(--viz-accent)', 'var(--viz-neutral)']
    : [1, 2, 3, 4, 5, 6, 7, 8].map((n) => 'var(--viz-' + n + ')');
  const colored = segments.map((s, i) => ({ ...s, color: s.color || pick[i % pick.length] }));

  const chart = React.createElement(FlowChart, {
    type: 'donut', height: size, legend: false,
    series: [{ data: colored }],
    ariaLabel: 'Reparto: ' + segments.map((s) => s.label).join(', '),
  });

  const center = (centerValue || centerLabel) && React.createElement('div', {
    style: {
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 1,
    },
  },
    centerValue && React.createElement('div', {
      style: { font: 'var(--type-data-lg)', color: 'var(--text-primary)', lineHeight: 1.1 },
    }, centerValue),
    centerLabel && React.createElement('div', {
      style: { fontSize: 11, color: 'var(--text-muted)' },
    }, centerLabel)
  );

  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: 18, ...style },
  },
    React.createElement('div', {
      style: { position: 'relative', width: size, height: size, flex: 'none' },
    }, chart, center),
    legend && React.createElement('div', {
      style: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, flex: 1 },
    }, colored.map((s, i) => React.createElement('div', {
      key: s.label,
      style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, minWidth: 0 },
    },
      React.createElement('span', {
        'aria-hidden': true,
        style: {
          width: 9, height: 9, borderRadius: '50%', flex: 'none',
          background: s.color,
        },
      }),
      React.createElement('span', {
        style: { flex: 1, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
      }, s.label),
      React.createElement('span', {
        style: { fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', flex: 'none' },
      }, Math.round(s.value / total * 100) + '%')
    )))
  );
}
