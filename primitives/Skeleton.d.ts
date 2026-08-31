/** Loading shimmer placeholder. */
export interface SkeletonProps {
  variant?: 'text' | 'title' | 'circle' | 'card' | 'pill';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;
