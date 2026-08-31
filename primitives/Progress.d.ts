/** Determinate progress bar; width animates with ease-out. */
export interface ProgressProps {
  value?: number;
  max?: number;
  label?: string;
  /** Shows percentage in mono at the right. */
  showValue?: boolean;
  tone?: 'accent' | 'success' | 'warning' | 'ink';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Progress(props: ProgressProps): JSX.Element;
