/** Page switcher with ellipsis collapse; current page = inverse pill. */
export interface PaginationProps {
  page?: number;
  pages?: number;
  onChange?: (page: number) => void;
  style?: React.CSSProperties;
}
export declare function Pagination(props: PaginationProps): JSX.Element;
