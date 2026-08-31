/** Indeterminate loading ring. */
export interface SpinnerProps {
  size?: number;
  color?: string;
  /** Accessible label, default "Cargando". */
  label?: string;
  style?: React.CSSProperties;
}
export declare function Spinner(props: SpinnerProps): JSX.Element;
