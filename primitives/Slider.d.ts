/** Range slider; thumb grows + glows while dragging, value readout in mono. */
export interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  /** Formats the readout, e.g. (v) => v + ' km'. */
  format?: (value: number) => string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Slider(props: SliderProps): JSX.Element;
