/** Bandera de pais en SVG (flag-icons), recortada circular por defecto. Nunca emoji. */
export interface FlagProps {
  /** ISO 3166-1 alpha-2, p.ej. 'MX'. Sin distinguir mayusculas. */
  country: string;
  /** Lado en px. La bandera es cuadrada. */
  size?: number;
  shape?: 'circle' | 'rounded' | 'square';
  /** Nombre del pais. Sin el, la bandera es decorativa (aria-hidden). */
  label?: string;
  /** Anillo interior para que las banderas con blanco al borde no se desvanezcan. */
  ring?: boolean;
  style?: React.CSSProperties;
}
export declare function Flag(props: FlagProps): JSX.Element;
/** Inyecta la hoja de flag-icons una sola vez. Llamalo para precargar. */
export declare function ensureFlagCss(href?: string): void;
