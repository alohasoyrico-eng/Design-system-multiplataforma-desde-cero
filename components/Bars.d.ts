export interface BarDatum { label: string; value: number; }
/** Vertical bar chart; bars spring up staggered on mount; max bar gets accent. */
export interface BarsProps {
  data: BarDatum[];
  height?: number;
  color?: string;
  highlightMax?: boolean;
  format?: (value: number) => string;
  style?: React.CSSProperties;
}
export declare function Bars(props: BarsProps): JSX.Element;
