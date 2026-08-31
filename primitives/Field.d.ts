/** Label + control + help/error wrapper for any form control. */
export interface FieldProps {
  label?: string;
  /** id of the wrapped control, for label association. */
  htmlFor?: string;
  required?: boolean;
  help?: string;
  /** Overrides help; renders in danger with role="alert". */
  error?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Field(props: FieldProps): JSX.Element;
