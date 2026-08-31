export interface SelectOption { value: string; label: string; icon?: string; group?: string; hint?: string; }
/** Seleccion de una lista conocida. Generado desde contracts/select.json. Absorbe SelectMultiple, SelectCountry, SelectCombo, SelectWithInput y Combobox. */
export interface SelectProps {
  id?: string;
  options: Array<string | SelectOption>;
  /** Array cuando multiple. */
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  /** Absorbe SelectMultiple. */
  multiple?: boolean;
  /** Filtro por escritura. Absorbe SelectCombo y la busqueda de SelectCountry. */
  searchable?: boolean;
  /** Permite un valor fuera de la lista. Absorbe SelectWithInput. */
  creatable?: boolean;
  /** Boton de limpiar en la zona trailing cuando hay valor. Absorbe Combobox. */
  clearable?: boolean;
  /** La bandera de SelectCountry deja de necesitar un componente propio. */
  renderOption?: (o: SelectOption, state: { active: boolean; selected: boolean; trigger?: boolean }) => React.ReactNode;
  placeholder?: string;
  /** Glifo Material Symbols, leading. */
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  invalid?: boolean;
  emptyLabel?: string;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
