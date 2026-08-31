/** Side panel over a blurred scrim; springs in from the edge. For detail views and secondary forms. */
export interface DrawerProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  /** Right-aligned action row pinned to the bottom. */
  footer?: React.ReactNode;
  width?: number;
  side?: 'right' | 'left';
  style?: React.CSSProperties;
}
export declare function Drawer(props: DrawerProps): JSX.Element;
