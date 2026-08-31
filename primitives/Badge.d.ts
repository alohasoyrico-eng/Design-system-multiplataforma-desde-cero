/** Status pill. live=true adds a pulsing dot (en ruta, en línea). */
export interface BadgeProps {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
  /** Pulsing dot for realtime states. */
  live?: boolean;
  /** Material Symbols Rounded glyph. */
  icon?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
