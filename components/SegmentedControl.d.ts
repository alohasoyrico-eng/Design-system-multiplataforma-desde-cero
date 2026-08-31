/** Full-width equal segments for mobile view switching; indicator slides with spring. */
export interface SegmentedControlProps {
  items: Array<{ value: string; label: string; icon?: string }>;
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
