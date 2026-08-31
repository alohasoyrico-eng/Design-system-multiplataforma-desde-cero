import React from 'react';
import { FlowChart } from '../primitives/FlowChart.jsx';

/** Treemap: tamano = valor, color = desvio vs presupuesto. Delega en FlowChart. */
export function Treemap({ nodes = [], width, height = 280, format, onDrill, style }) {
  // width se ignora a proposito: venia de la era SVG y aqui el chart es responsivo.
  const colorFor = (dev) => {
    if (dev == null) return 'var(--viz-neutral)';
    if (dev > 0.1) return 'var(--viz-negative)';
    if (dev > 0) return 'var(--viz-3)';
    return 'var(--viz-positive)';
  };
  const data = nodes.map((n) => ({ label: n.label, value: n.value, color: colorFor(n.deviation) }));
  return React.createElement(FlowChart, {
    type: 'treemap', height, format,
    style: style,
    series: [{ data }],
    onSelect: onDrill ? (p) => {
      const hit = nodes.filter((n) => n.label === p.name)[0];
      if (hit) onDrill(hit);
    } : undefined,
    ariaLabel: 'Gasto por region, tamano por valor y color por desvio vs presupuesto',
  });
}
