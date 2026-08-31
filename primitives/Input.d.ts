/** Single-line text input. Rounded 16, red focus ring, optional leading icon and suffix. */
export interface InputProps {
  /** Ojo de mostrar/ocultar con target de 44px. Absorbe InputPassword. */
  revealable?: boolean;
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  /** Material Symbols Rounded glyph, leading. */
  icon?: string;
  /** Static text at the end (units, domain). */
  suffix?: string;
  disabled?: boolean;
  invalid?: boolean;
  /** JetBrains Mono for plates/IDs/amounts. */
  mono?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
