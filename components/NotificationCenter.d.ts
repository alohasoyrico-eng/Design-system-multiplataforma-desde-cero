export interface NotificationItem { id: string; tone?: 'info' | 'success' | 'warning' | 'danger'; title: string; desc?: string; time?: string; read?: boolean; }
/** Bell trigger + dropdown panel. Badge shows unread count (9+ caps). */
export interface NotificationCenterProps {
  items: NotificationItem[];
  onItemClick?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
  align?: 'left' | 'right';
  style?: React.CSSProperties;
}
export declare function NotificationCenter(props: NotificationCenterProps): JSX.Element;
