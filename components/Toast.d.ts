/** Inverse-surface notification; springs up. Compose inside ToastStack. */
export interface ToastProps {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  message: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
/** Fixed bottom-center column for Toasts. */
export interface ToastStackProps { children?: React.ReactNode; style?: React.CSSProperties; }
export declare function ToastStack(props: ToastStackProps): JSX.Element;
