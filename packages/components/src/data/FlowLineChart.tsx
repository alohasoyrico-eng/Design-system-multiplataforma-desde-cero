import { useId } from "react";
import { FlowChartLegend } from "./FlowChartLegend";
import { FlowChartTable } from "./FlowChartTable";
import { type ChartSeries, seriesColor, niceScale } from "./chart-utils";
import "../../css/data/Chart.css";

export interface FlowLineChartProps {
  title: string;
  categories: string[];
  series: ChartSeries[];
  formatValue?: (n: number) => string;
}

const W = 560;
const H = 280;
const M = { top: 12, right: 12, bottom: 28, left: 44 };

/** FlowLineChart — multi-series lines over an ordered axis. One y-axis only. */
export function FlowLineChart({
  title,
  categories,
  series,
  formatValue = String,
}: FlowLineChartProps) {
  const titleId = useId();
  const max = Math.max(0, ...series.flatMap((s) => s.values));
  const { top, ticks } = niceScale(max);
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const n = categories.length;
  const x = (i: number) => M.left + (n <= 1 ? plotW / 2 : (plotW / (n - 1)) * i);
  const y = (v: number) => M.top + plotH * (1 - v / top);

  return (
    <figure className="flow-chart">
      <figcaption className="flow-chart__title" id={titleId}>
        {title}
      </figcaption>
      <FlowChartLegend names={series.map((s) => s.name)} />
      <svg
        className="flow-chart__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={titleId}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line className="flow-chart__grid" x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} />
            <text className="flow-chart__tick" x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end">
              {formatValue(t)}
            </text>
          </g>
        ))}
        {categories.map((cat, i) => (
          <text
            key={cat}
            className="flow-chart__label"
            x={x(i)}
            y={H - M.bottom + 18}
            textAnchor="middle"
          >
            {cat}
          </text>
        ))}
        {series.map((s, si) => (
          <g key={s.name}>
            <polyline
              className="flow-chart__line"
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
              stroke={seriesColor(si)}
            />
            {s.values.map((v, i) => (
              <circle
                key={i}
                className="flow-chart__dot"
                cx={x(i)}
                cy={y(v)}
                r={4}
                fill={seriesColor(si)}
              >
                <title>{`${s.name} · ${categories[i]}: ${formatValue(v)}`}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
      <FlowChartTable
        caption={title}
        categories={categories}
        series={series}
        format={formatValue}
      />
    </figure>
  );
}
