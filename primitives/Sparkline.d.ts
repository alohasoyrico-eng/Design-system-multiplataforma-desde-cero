/** Micro line chart with pulsing last-point dot. */
export interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  showDot?: boolean;
  style?: React.CSSProperties;
}
export declare function Sparkline(props: SparklineProps): JSX.Element;
