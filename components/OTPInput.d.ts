/** One-time code boxes driven by one hidden input (autocomplete one-time-code). Shakes on invalid. */
export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}
export declare function OTPInput(props: OTPInputProps): JSX.Element;
