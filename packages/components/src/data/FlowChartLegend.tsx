import { seriesColor } from "./chart-utils";

/** Shared legend — identity is never color-alone (swatch + label). Text wears text tokens. */
export function FlowChartLegend({ names }: { names: string[] }) {
  if (names.length < 2) return null;
  return (
    <ul className="flow-chart__legend">
      {names.map((name, i) => (
        <li key={name} className="flow-chart__legend-item">
          <span
            className="flow-chart__swatch"
            style={{ background: seriesColor(i) }}
            aria-hidden="true"
          />
          {name}
        </li>
      ))}
    </ul>
  );
}
