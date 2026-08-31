/** Donut chart with animated segments and legend with percentages. */
export interface DonutSegment { label: string; value: number; color?: string; }
export interface DonutProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  legend?: boolean;
  style?: React.CSSProperties;
}
export declare function Donut(props: DonutProps): JSX.Element;
