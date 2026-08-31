export interface TopBarNavItem { id?: string; label: string; href?: string; active?: boolean; }
export interface TopBarCrumb { label: string; href?: string; }
export interface TopBarEntity { id: string; label: string; }
/** Header de app. 'fullscreen' devuelve null (pantallas inmersivas sin chrome). */
export interface TopBarProps {
  variant?: 'standard' | 'minimal' | 'admin' | 'multientity' | 'mobile' | 'fullscreen';
  logo?: React.ReactNode;
  avatar?: React.ReactNode;
  /** variant 'standard' */
  navItems?: TopBarNavItem[];
  /** variant 'minimal' */
  breadcrumb?: TopBarCrumb[];
  /** variant 'admin' */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  notificationCount?: number;
  onNotifications?: () => void;
  /** variant 'multientity' */
  entities?: TopBarEntity[];
  currentEntity?: string;
  onEntityChange?: (id: string) => void;
  /** variants 'mobile' */
  onToggleSidebar?: () => void;
  style?: React.CSSProperties;
}
export declare function TopBar(props: TopBarProps): JSX.Element | null;
