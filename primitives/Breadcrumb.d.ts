export interface BreadcrumbItem { label: string; href?: string; onClick?: () => void; }
/** Path trail; last item is the current page. */
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  style?: React.CSSProperties;
}
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;
