export interface TabBarItem { id: string; icon: string; label: string; badge?: number | boolean; }
/** Bottom tab bar for mobile shells. Sticky, safe-area aware. */
export interface TabBarProps {
  items: TabBarItem[];
  activeId: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function TabBar(props: TabBarProps): JSX.Element;
