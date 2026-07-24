import { useId } from "react";
import { FlowChartLegend } from "./FlowChartLegend";
import { FlowChartTable } from "./FlowChartTable";
import { type ChartSeries, seriesColor, niceScale } from "./chart-utils";
import "../../css/data/Chart.css";

export interface FlowBarChartProps {
  title: string;
  categories: string[];
  series: ChartSeries[];
  formatValue?: (n: number) => string;
}

const W = 560;
const H = 280;
const M = { top: 12, right: 12, bottom: 28, left: 44 };

/** FlowBarChart — grouped categorical bars. Fixed-order palette, legend, hover titles, data table. */
export function FlowBarChart({
  title,
  categories,
  series,
  formatValue = String,
}: FlowBarChartProps) {
  const titleId = useId();
  const max = Math.max(0, ...series.flatMap((s) => s.values));
  const { top, ticks } = niceScale(max);
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const band = plotW / categories.length;
  const groupW = band * 0.7;
  const barW = groupW / series.length;
  const gap = 2;
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
        {categories.map((cat, ci) => {
          const bandX = M.left + band * ci;
          const groupX = bandX + (band - groupW) / 2;
          return (
            <g key={cat}>
              {series.map((s, si) => {
                const v = s.values[ci] ?? 0;
                const h = plotH * (v / top);
                return (
                  <rect
                    key={s.name}
                    className="flow-chart__bar"
                    x={groupX + si * barW + gap / 2}
                    y={y(v)}
                    width={Math.max(0, barW - gap)}
                    height={Math.max(0, h)}
                    rx={4}
                    fill={seriesColor(si)}
                  >
                    <title>{`${s.name} · ${cat}: ${formatValue(v)}`}</title>
                  </rect>
                );
              })}
              <text
                className="flow-chart__label"
                x={bandX + band / 2}
                y={H - M.bottom + 18}
                textAnchor="middle"
              >
                {cat}
              </text>
            </g>
          );
        })}
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
