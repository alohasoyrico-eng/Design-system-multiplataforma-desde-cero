export interface MenuItem { label: string; icon?: string; danger?: boolean; disabled?: boolean; onClick?: () => void; }
/** Dropdown menu anchored to any trigger element. Esc and outside-click close it. */
export interface MenuProps {
  /** Element that toggles the menu (usually IconButton "more_vert" or a Button). */
  trigger: React.ReactNode;
  /** Items or the string 'divider'. */
  items: Array<MenuItem | 'divider'>;
  align?: 'left' | 'right';
  style?: React.CSSProperties;
}
export declare function Menu(props: MenuProps): JSX.Element;
