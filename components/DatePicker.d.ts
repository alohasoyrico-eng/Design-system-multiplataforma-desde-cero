export interface DateRange { from?: string; to?: string; }
/** El unico calendario del sistema. Generado desde contracts/datepicker.json. Absorbe DateRangePicker e InputDate. */
export interface DatePickerProps {
  id?: string;
  /** Cambia el tipo de value y de onChange, no solo la piel. */
  mode?: 'single' | 'range';
  /** ISO 'YYYY-MM-DD' en single; DateRange en range. */
  value?: string | DateRange;
  onChange?: (value: string | DateRange) => void;
  /** Por defecto depende del mode. */
  placeholder?: string;
  min?: string;
  max?: string;
  /** Atajos de 7, 30 y 90 dias. Por defecto true en range. */
  presets?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  style?: React.CSSProperties;
}
export declare function DatePicker(props: DatePickerProps): JSX.Element;
