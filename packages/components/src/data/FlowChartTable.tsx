import type { ChartSeries } from "./chart-utils";

/** Visually-hidden data table — the screen-reader / print equivalent of the chart. */
export function FlowChartTable({
  caption,
  categories,
  series,
  format = String,
}: {
  caption: string;
  categories: string[];
  series: ChartSeries[];
  format?: (n: number) => string;
}) {
  return (
    <table className="flow-chart__table">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Categoría</th>
          {series.map((s) => (
            <th key={s.name} scope="col">
              {s.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {categories.map((cat, i) => (
          <tr key={cat}>
            <th scope="row">{cat}</th>
            {series.map((s) => (
              <td key={s.name}>{format(s.values[i] ?? 0)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
