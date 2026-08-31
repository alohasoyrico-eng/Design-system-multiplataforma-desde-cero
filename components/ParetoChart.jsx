import React from 'react';
import { FlowChart } from '../primitives/FlowChart.jsx';

/** Barras ordenadas + acumulado. Las que cruzan el umbral van en accent. */
export function ParetoChart({ data = [], height = 240, format, threshold = 0.8, style }) {
  const sorted = data.slice().sort((a, b) => b.value - a.value);
  const total = sorted.reduce((a, d) => a + d.value, 0) || 1;
  let acc = 0;
  const itemColors = sorted.map((d) => {
    const before = acc / total;
    acc += d.value;
    return before < threshold ? 'var(--viz-accent)' : 'var(--viz-neutral)';
  });
  return React.createElement(FlowChart, {
    type: 'pareto', height, format, style, itemColors,
    labels: sorted.map((d) => d.label),
    series: [{ label: 'Valor', values: sorted.map((d) => d.value) }],
    ariaLabel: 'Pareto: pocas causas concentran el ' + Math.round(threshold * 100) + '% del total',
  });
}
