/** Surface container. interactive=true renders a button that lifts -3px on hover. */
export interface CardProps {
  /** 'minimal' quita fondo/borde/sombra · 'elevated' borde 2px accent + shadow-float · 'ghost' 40% + blur para overlays. */
  variant?: 'default' | 'minimal' | 'elevated' | 'ghost';
  /** Color del borde en variant 'elevated'. */
  accent?: string;
  /** Renders as <button>, adds hover lift + focus ring. */
  interactive?: boolean;
  /** Accent border (selection states). */
  selected?: boolean;
  /** CSS padding, default var(--pad-card) = 24px. */
  padding?: string | number;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
