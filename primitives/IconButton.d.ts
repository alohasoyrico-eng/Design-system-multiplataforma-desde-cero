/** Circular icon-only button. ariaLabel is mandatory — there is no visible text. */
export interface IconButtonProps {
  /** Material Symbols Rounded glyph name. */
  icon: string;
  /** Accessible name — required. */
  ariaLabel: string;
  variant?: 'ghost' | 'tonal' | 'primary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  /** Fills the glyph and tints it accent (e.g. active nav item). */
  selected?: boolean;
  /** Shows a pulsing live dot (notifications). */
  badge?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
