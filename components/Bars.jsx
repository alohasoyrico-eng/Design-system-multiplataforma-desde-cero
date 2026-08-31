import React from 'react';
import { FlowChart } from '../primitives/FlowChart.jsx';

/** Barras verticales. Delega en FlowChart; la maxima en accent si highlightMax. */
export function Bars({ data = [], height = 200, color, highlightMax = true, format, style }) {
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const maxIdx = values.indexOf(Math.max.apply(null, values));
  const itemColors = highlightMax
    ? values.map((_, i) => (i === maxIdx ? 'var(--viz-accent)' : (color || 'var(--text-primary)')))
    : undefined;
  return React.createElement(FlowChart, {
    type: 'bar', height, labels, format, style, itemColors,
    series: [{ label: 'Valor', values, color: color }],
    ariaLabel: 'Barras por ' + labels.join(', '),
  });
}
