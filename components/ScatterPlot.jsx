import React from 'react';
import { FlowChart } from '../primitives/FlowChart.jsx';

/** Dispersion con umbrales de cuadrante. Delega en FlowChart. */
export function ScatterPlot({
  points = [], xLabel, yLabel, xThreshold, yThreshold, format = {},
  width, height = 260, selectedId, onSelect, style,
}) {
  // width se ignora a proposito: venia de la era SVG y aqui el chart es responsivo.
  const values = points.map((p) => [p.x, p.y, p.label, p.id]);
  const fmt = format.y || format.x || ((v) => v);

  const lines = [].concat(
    xThreshold != null ? [{ xAxis: xThreshold }] : [],
    yThreshold != null ? [{ yAxis: yThreshold }] : []
  );

  return React.createElement(FlowChart, {
    type: 'scatter', height, format: fmt,
    style: style,
    series: [{
      label: yLabel || 'Unidades',
      values,
      markLine: lines.length ? {
        silent: true, symbol: 'none',
        lineStyle: { color: 'var(--viz-axis)', type: 'dashed', width: 1 },
        label: { show: false },
        data: lines,
      } : undefined,
    }],
    onSelect: onSelect ? (p) => {
      const hit = points.filter((x) => x.id === (p.value && p.value[3]))[0];
      if (hit) onSelect(hit);
    } : undefined,
    option: {
      grid: { bottom: xLabel ? 30 : 6, left: yLabel ? 24 : 8 },
      xAxis: { name: xLabel, nameLocation: 'middle', nameGap: 30, nameTextStyle: { fontSize: 11, color: 'var(--viz-label)' } },
      yAxis: { name: yLabel, nameLocation: 'middle', nameGap: 42, nameTextStyle: { fontSize: 11, color: 'var(--viz-label)' } },
    },
    ariaLabel: (yLabel || 'Y') + ' contra ' + (xLabel || 'X') + ', ' + points.length + ' unidades',
  });
}
