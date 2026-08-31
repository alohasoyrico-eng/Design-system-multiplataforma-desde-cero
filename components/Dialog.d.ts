/** Modal on blurred scrim; springs up from below. Esc and scrim-click close. */
export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  /** Adds a tinted icon circle next to the title. */
  tone?: 'danger' | 'success';
  /** Body content. */
  children?: React.ReactNode;
  /** Right-aligned footer, usually Buttons. */
  actions?: React.ReactNode;
  width?: number;
  style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element;
