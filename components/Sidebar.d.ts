export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: SidebarItem[];
}
/** App nav lateral: secciones colapsables, items anidados, modo collapsed de 60px solo-iconos. */
export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  activeId?: string;
  expandedSections?: Set<string>;
  onNavigate?: (id: string, href?: string) => void;
  onToggleSection?: (id: string) => void;
  headerContent?: React.ReactNode;
  footerActions?: React.ReactNode;
  width?: string;
  ariaLabel?: string;
  style?: React.CSSProperties;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;
