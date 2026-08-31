/**
 * Primary action control. Pill-shaped, springy press/hover feedback.
 * @startingPoint section="Actions" subtitle="Botón pill con feedback de resorte — 5 variantes, 3 tamaños" viewport="700x320"
 */
export interface ButtonProps {
  /** Visual role. 'primary' = ink, 'accent' = brand red (max 1 per view), 'secondary' = outline, 'ghost', 'danger'. */
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Material Symbols Rounded glyph name, leading. */
  icon?: string;
  /** Material Symbols Rounded glyph name, trailing. */
  iconTrailing?: string;
  /** Shows spinner, disables interaction, keeps width. */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  /** Required when the button has no visible text. */
  ariaLabel?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
