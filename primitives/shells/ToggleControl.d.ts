/** Mecanica compartida de Checkbox, Radio y Switch. Generado desde contracts/toggle-control.json. */
export interface ToggleState {
  checked: boolean; indeterminate: boolean;
  focus: boolean; hover: boolean; press: boolean; disabled: boolean;
}
export interface ToggleControlProps {
  type: 'checkbox' | 'radio' | 'switch';
  checked?: boolean;
  /** Solo checkbox. */
  indeterminate?: boolean;
  onChange?: (v: any) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  /** Agrupa los radio. */
  name?: string;
  value?: string;
  /** La piel: es todo lo que diferencia a los tres. */
  renderIndicator: (state: ToggleState) => React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ToggleControl(props: ToggleControlProps): JSX.Element;
