/** Circular determinate progress/gauge. Compact alternative to Progress for dashboard tiles and connection states. */
export interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
  tone?: 'accent' | 'success' | 'warning' | 'ink';
  style?: React.CSSProperties;
}
export declare function CircularProgress(props: CircularProgressProps): JSX.Element;
