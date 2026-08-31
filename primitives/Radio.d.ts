/** Radio button; dot pops in with a spring. */
export interface RadioProps {
  name?: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  label?: string;
  /** Secondary line under the label. */
  description?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;
