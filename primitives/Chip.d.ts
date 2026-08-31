/** Filter/selection chip. Selected = inverse ink fill. */
export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  /** Shows an × affordance. */
  onRemove?: () => void;
  icon?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
