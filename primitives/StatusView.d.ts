/** Full state screen for connection/validation flows: API, base de datos, biometricos, pagos, GPS. */
export interface StatusViewProps {
  status?: 'success' | 'error' | 'pending' | 'loading' | 'offline';
  title?: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  fullScreen?: boolean;
  style?: React.CSSProperties;
}
export declare function StatusView(props: StatusViewProps): JSX.Element;
