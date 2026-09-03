/** Empty/zero-data state: icon circle, title, guidance, optional action. */
export interface EmptyStateProps {
  /** Material Symbols Rounded glyph. */
  icon?: string;
  title?: string;
  description?: string;
  /** Usually a <Button>. */
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
