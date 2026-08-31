export interface ParetoDatum { label: string; value: number; }
/** Bars sorted descending + cumulative % line. Highlights the items crossing the 80% threshold — finds "the few units driving most of the cost". */
export interface ParetoChartProps {
  data: ParetoDatum[];
  height?: number;
  format?: (v: number) => string;
  threshold?: number;
  style?: React.CSSProperties;
}
export declare function ParetoChart(props: ParetoChartProps): JSX.Element;
