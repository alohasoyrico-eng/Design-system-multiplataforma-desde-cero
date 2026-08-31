export interface TimelineItem {
  id?: string;
  title: string;
  description?: string;
  timestamp?: string;
  status?: 'done' | 'active' | 'pending' | 'error';
  icon?: string;
}
/** Vertical activity/audit timeline: historial de viaje, bitácora de soporte, log de sincronización. */
export interface TimelineProps {
  items: TimelineItem[];
  style?: React.CSSProperties;
}
export declare function Timeline(props: TimelineProps): JSX.Element;
