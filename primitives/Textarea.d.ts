/** Multi-line input with optional live character counter. */
export interface TextareaProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  /** Shows a live counter bottom-right. */
  maxLength?: number;
  disabled?: boolean;
  invalid?: boolean;
  style?: React.CSSProperties;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
