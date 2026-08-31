export interface TabItem { value: string; label: string; icon?: string; count?: number; }
/** Tab bar with a spring-sliding indicator. 'pill' = segmented on sunken track; 'underline' = accent bar. */
export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  variant?: 'pill' | 'underline';
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
