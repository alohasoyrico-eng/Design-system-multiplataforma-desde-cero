/** Shared chart types + helpers. The categorical palette is fixed-order sys.chart.cat1..5. */
export interface ChartSeries {
  name: string;
  values: number[];
}

export const CHART_SLOTS = 5;

/** Series index → its fixed categorical color custom property. Never cycled beyond the ramp. */
export function seriesColor(index: number): string {
  return `var(--sys-chart-cat${(index % CHART_SLOTS) + 1})`;
}

/** "Nice" upper bound + evenly spaced ticks for a value axis starting at 0. */
export function niceScale(max: number, ticks = 4): { top: number; ticks: number[] } {
  if (max <= 0) return { top: 1, ticks: [0, 1] };
  const raw = max / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const top = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) out.push(Number(v.toFixed(6)));
  return { top, ticks: out };
}
